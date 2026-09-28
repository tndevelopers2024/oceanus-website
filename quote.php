<?php
    define('OCEANUS_MAILER', true);
    require_once __DIR__ . '/mailer-config.php';

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo "Method Not Allowed.";
        exit;
    }

    // Honeypot
    if (!empty($_POST["website"])) {
        http_response_code(200);
        exit;
    }

    // Rate Limiting
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
    $rate_limit_dir = sys_get_temp_dir() . '/oceanus_rate_limit';
    if (!is_dir($rate_limit_dir)) {
        @mkdir($rate_limit_dir, 0777, true);
    }
    $ip_hash = md5($ip . '_quote');
    $limit_file = $rate_limit_dir . '/' . $ip_hash . '.json';
    
    $now = time();
    $requests = [];
    if (file_exists($limit_file)) {
        $data = json_decode(file_get_contents($limit_file), true);
        if (is_array($data)) {
            $requests = array_filter($data, function($t) use ($now) {
                return ($now - $t) < 3600;
            });
        }
    }
    
    if (!empty($requests)) {
        $last_request = end($requests);
        if (($now - $last_request) < 10) {
            http_response_code(429);
            echo "Please wait 10 seconds before submitting again.";
            exit;
        }
    }
    
    if (count($requests) >= 5) {
        http_response_code(429);
        echo "Too many submissions. Please try again later.";
        exit;
    }
    
    $requests[] = $now;
    file_put_contents($limit_file, json_encode(array_values($requests)));

    // Helper for fields
    function get_post($key) {
        return isset($_POST[$key]) ? trim($_POST[$key]) : "";
    }

    // 1. Name
    $name = strip_tags(str_replace(["\r", "\n"], "", get_post("name")));
    if (mb_strlen($name) < 2 || mb_strlen($name) > 80 || !preg_match('/^[a-zA-Z\s\.\'\-]+$/u', $name)) {
        http_response_code(400);
        echo "Please provide a valid name (2-80 characters, letters and basic punctuation only).";
        exit;
    }

    // 2. Email
    $email = get_post("email");
    if (preg_match('/[\r\n]/', $email) || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please provide a valid email address.";
        exit;
    }

    // 3. Phone
    $phone = get_post("phone");
    if (!preg_match('/^\+?[0-9\s\-().]{7,25}$/', $phone)) {
        http_response_code(400);
        echo "Please provide a valid phone number.";
        exit;
    }

    // 4. Service Required
    $service = get_post("service");
    $allowed_services = [
        'NVOCC', 'ISO Tank Operator', 'Freight Forwarding', 
        'Project & Specialized Cargo', 'Gas Logistics', 
        'Domestic Logistics', 'Supply Chain Services', 'Agency Representation'
    ];
    if ($service === "Project &amp; Specialized Cargo") $service = "Project & Specialized Cargo";
    
    if (!in_array($service, $allowed_services, true)) {
        http_response_code(400);
        echo "Please select a valid service.";
        exit;
    }

    // 5. Cargo Type
    $cargo_type = get_post("cargo_type");
    $allowed_cargo_types = [
        'Food grade liquid', 'Hazardous liquid', 'Non-hazardous liquid', 
        'Industrial liquid / petrochemical', 'Dry container cargo', 
        'Reefer cargo', 'Project / oversized cargo'
    ];
    if (!in_array($cargo_type, $allowed_cargo_types, true)) {
        http_response_code(400);
        echo "Please select a valid cargo type.";
        exit;
    }

    // 6. Cargo / Product
    $cargo = get_post("cargo");
    if (mb_strlen($cargo) < 2 || mb_strlen($cargo) > 150) {
        http_response_code(400);
        echo "Please provide a valid cargo/product description (2-150 characters).";
        exit;
    }

    // 7. Port of Loading (pol)
    $pol = get_post("pol");
    if (mb_strlen($pol) < 2 || mb_strlen($pol) > 100) {
        http_response_code(400);
        echo "Please provide a valid Port of Loading (2-100 characters).";
        exit;
    }

    // 8. Port of Discharge (pod)
    $pod = get_post("pod");
    if (mb_strlen($pod) < 2 || mb_strlen($pod) > 100) {
        http_response_code(400);
        echo "Please provide a valid Port of Discharge (2-100 characters).";
        exit;
    }

    // 9. Equipment Required
    $equipment = get_post("equipment");
    $allowed_equipment = [
        'T11 ISO tank (26,000 ltr)', 'ISO tank – other capacity', 'ISO tank - other capacity',
        '20ft dry container', '40ft dry container', 'Reefer container', 
        'Not sure – please advise', 'Not sure - please advise'
    ];
    if (!in_array($equipment, $allowed_equipment, true)) {
        http_response_code(400);
        echo "Please select a valid equipment requirement.";
        exit;
    }

    // Other optional fields
    $company = strip_tags(get_post("company"));
    $un_number = strip_tags(get_post("un_number"));
    $units = strip_tags(get_post("units"));
    $ship_date = strip_tags(get_post("ship_date"));
    $volume = strip_tags(get_post("volume"));
    $message = strip_tags(get_post("message"));

    $env = getEnvConfig();
    $recipient = $env['MAIL_RECIPIENT'] ?? getenv('MAIL_RECIPIENT') ?: "info@oceanuscontainer.com";

    // Build the email content.
    $email_content = "Name: $name\n";
    if ($company !== "") $email_content .= "Company: $company\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Service Required: $service\n";
    $email_content .= "Cargo Type: $cargo_type\n";
    $email_content .= "Cargo / Product: $cargo\n";
    if ($un_number !== "") $email_content .= "UN Number & Class: $un_number\n";
    $email_content .= "Port of Loading: $pol\n";
    $email_content .= "Port of Discharge: $pod\n";
    $email_content .= "Equipment Required: $equipment\n";
    if ($units !== "") $email_content .= "Number of Units: $units\n";
    if ($ship_date !== "") $email_content .= "Target Shipment Date: $ship_date\n";
    if ($volume !== "") $email_content .= "Estimated Volume / Weight: $volume\n";
    if ($message !== "") {
        $email_content .= "\nMessage:\n$message\n";
    }

    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';
    $timestamp = gmdate('Y-m-d H:i:s \U\T\C');

    $email_content .= "\n---\n";
    $email_content .= "Submission Details:\n";
    $email_content .= "Timestamp: $timestamp\n";
    $email_content .= "IP Address: $ip\n";
    $email_content .= "User-Agent: $user_agent\n";

    try {
        $mail = getMailer();
        $mail->addAddress($recipient);
        $mail->addReplyTo($email, $name);
        $subject = str_replace(["\r", "\n"], "", "New Quote Request from $name");
        $mail->Subject = $subject;
        $mail->Body    = $email_content;
        $mail->send();

        http_response_code(200);
        echo "Thank You! Your quote request has been sent.";
    } catch (\Exception $e) {
        http_response_code(500);
        error_log("Mail Error: " . $e->getMessage());
        echo "Oops! Something went wrong and we couldn't send your request.";
    }
?>
