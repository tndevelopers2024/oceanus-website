<?php
    // Handles the contact form on contact.html (submitted by assets/js/ajax-mail.js).
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Honeypot: the "website" field is hidden from real visitors, so anything
        // in it came from a bot. Report success so the bot has nothing to retry.
        if (!empty($_POST["website"])) {
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
            exit;
        }

        // Get the form fields; single-line fields lose tags and line breaks.
        $name    = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : "";
        $name    = str_replace(array("\r", "\n", '"'), array(" ", " ", ""), $name);
        $email   = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";
        $phone   = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : "";
        $phone   = str_replace(array("\r", "\n"), array(" ", " "), $phone);
        $service = isset($_POST["service"]) ? strip_tags(trim($_POST["service"])) : "";
        $service = str_replace(array("\r", "\n"), array(" ", " "), $service);
        $message = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : "";

        if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === "") {
            http_response_code(400);
            echo "Please provide your name, a valid email address and a message.";
            exit;
        }

        // Set the recipient email address.
        $recipient = "info@oceanuscontainer.com";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n";
        if ($phone !== "") {
            $email_content .= "Phone: $phone\n";
        }
        if ($service !== "" && $service !== "Please Select") {
            $email_content .= "Service: $service\n";
        }
        $email_content .= "\nMessage:\n$message\n";

        // Send from the site's own domain so the email passes SPF/DMARC checks;
        // replying still goes straight to the visitor.
        $email_headers  = "From: Oceanus Line Website <noreply@oceanuscontainer.com>\r\n";
        $email_headers .= "Reply-To: \"$name\" <$email>\r\n";
        $email_headers .= "Content-Type: text/plain; charset=UTF-8";

        // Send the email.
        if (mail($recipient, "New Website Enquiry", $email_content, $email_headers, "-fnoreply@oceanuscontainer.com")) {
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }
?>
