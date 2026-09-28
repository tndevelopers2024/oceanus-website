<?php
defined('OCEANUS_MAILER') or die('Direct access not permitted');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/lib/phpmailer/Exception.php';
require_once __DIR__ . '/lib/phpmailer/PHPMailer.php';
require_once __DIR__ . '/lib/phpmailer/SMTP.php';

function getMailer(): PHPMailer {
    $mail = new PHPMailer(true);

    // Google Workspace SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@oceanuscontainer.com';
    $mail->Password   = 'dwfkcswdnvwzorhv';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Sender details
    $mail->setFrom('info@oceanuscontainer.com', 'Oceanus Line Website');

    return $mail;
}
