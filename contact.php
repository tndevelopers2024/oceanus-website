<?php
    header('Content-Type: text/plain; charset=UTF-8');
    header('Cache-Control: no-store');
    define('OCEANUS_MAILER', true);
    require_once __DIR__ . '/mailer-config.php';

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        header("Allow: POST");
        http_response_code(405);
        echo "Method Not Allowed.";
        exit;
    }

    // Honeypot: the "website" field is hidden from real visitors, so anything
    // in it came from a bot. Report success so the bot has nothing to retry.
    if (!empty($_POST["website"])) {
        http_response_code(200);
        exit;
    }

    require_once __DIR__ . '/lib/form-validation.php';
    validate_request_fields();
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';

    // Strict Field Validation
    // Name: sanitize, check length between 2 and 80 chars, must match regular expression
    $name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
    $name = strip_tags(str_replace(["\r", "\n"], "", $name));
    if (form_length($name) < 2 || form_length($name) > 80 || !preg_match('/^[\p{L}\p{M} .’\'\-]+$/u', $name)) {
        http_response_code(400);
        echo "Please provide a valid name (2-80 characters, letters and basic punctuation only).";
        exit;
    }

    // Email: validate with filter_var, max length 254, reject \r\n
    $email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
    if (preg_match('/[\r\n]/', $email) || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please provide a valid email address.";
        exit;
    }

    // Phone: validate with regex
    $phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
    if (!valid_phone($phone)) {
        http_response_code(400);
        echo "Please provide a valid phone number.";
        exit;
    }

    // Service: validate against whitelist
    $allowed_services = [
        'NVOCC', 'ISO Tank Operator', 'Freight Forwarding', 
        'Project & Specialized Cargo', 'Gas Logistics', 
        'Domestic Logistics', 'Supply Chain Services', 'Agency Representation'
    ];
    $service = isset($_POST["service"]) ? trim($_POST["service"]) : "";
    if ($service === "Project &amp; Specialized Cargo") {
        $service = "Project & Specialized Cargo";
    }
    if ($service === "" || !in_array($service, $allowed_services, true)) {
        http_response_code(400);
        echo "Please select a valid service.";
        exit;
    }

    if (($_POST['consent'] ?? '') !== '1') {
        http_response_code(400);
        exit('Please agree to the Terms & Conditions.');
    }

    // Message: sanitize, check length
    $message = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : "";
    if (form_length($message) < 10 || form_length($message) > 3000) {
        http_response_code(400);
        echo "Please provide a message between 10 and 3000 characters.";
        exit;
    }

    enforce_rate_limit();

    $env = getEnvConfig();
    $recipient = $env['MAIL_RECIPIENT'] ?? getenv('MAIL_RECIPIENT') ?: "info@oceanuscontainer.com";

    // Metadata
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';
    $timestamp = gmdate('Y-m-d H:i:s \U\T\C');

    // Build the email content.
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    if ($phone !== "") {
        $email_content .= "Phone: $phone\n";
    }
    $email_content .= "Service: $service\n";
    $email_content .= "\nMessage:\n$message\n\n";
    $email_content .= "---\n";
    $email_content .= "Submission Details:\n";
    $email_content .= "Timestamp: $timestamp\n";
    $email_content .= "IP Address: $ip\n";
    $email_content .= "User-Agent: $user_agent\n";

    try {
        $mail = getMailer();
        $mail->addAddress($recipient);
        $mail->addReplyTo($email, $name);
        // Strip CRLF from subject to prevent header injection
        $subject = str_replace(["\r", "\n"], "", "New Website Enquiry from $name");
        $mail->Subject = $subject;
        $mail->Body    = $email_content;
        $mail->send();

        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } catch (\Exception $e) {
        http_response_code(500);
        error_log("Mail Error: " . $e->getMessage());
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
?>
