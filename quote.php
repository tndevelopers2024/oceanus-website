<?php
    // Handles the "Request A Quote" form on quote.html.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Every field the quote form submits, in the order it should appear in the email.
        $fields = array(
            "name"       => "Name",
            "company"    => "Company",
            "email"      => "Email",
            "phone"      => "Phone",
            "service"    => "Service Required",
            "cargo_type" => "Cargo Type",
            "cargo"      => "Cargo / Product",
            "un_number"  => "UN Number & Class",
            "pol"        => "Port of Loading",
            "pod"        => "Port of Discharge",
            "equipment"  => "Equipment Required",
            "units"      => "Number of Units",
            "ship_date"  => "Target Shipment Date",
            "volume"     => "Estimated Volume / Weight",
        );

        $name  = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : "";
        $email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";

        if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "Please provide your name and a valid email address.";
            exit;
        }

        // Set the recipient email address.
        $recipient = "info@oceanuscontainer.com";

        // Build the email content.
        $email_content = "";
        foreach ($fields as $key => $label) {
            $value = isset($_POST[$key]) ? strip_tags(trim($_POST[$key])) : "";
            $value = str_replace(array("\r", "\n"), array(" ", " "), $value);
            if ($value !== "" && $value !== "Please Select") {
                $email_content .= "$label: $value\n";
            }
        }

        $message = isset($_POST["message"]) ? trim($_POST["message"]) : "";
        if ($message !== "") {
            $email_content .= "\nMessage:\n$message\n";
        }

        // Build the email headers.
        $email_headers = "From: $name <$email>";

        // Send the email.
        if (mail($recipient, "New Quote Request", $email_content, $email_headers)) {
            http_response_code(200);
            echo "Thank You! Your quote request has been sent.";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your request.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }
?>
