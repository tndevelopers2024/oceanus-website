<?php
defined('OCEANUS_MAILER') or die('Direct access not permitted');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/lib/phpmailer/Exception.php';
require_once __DIR__ . '/lib/phpmailer/PHPMailer.php';
require_once __DIR__ . '/lib/phpmailer/SMTP.php';

/**
 * Lightweight .env parser supporting KEY=VALUE pairs, comments (#), and quoted values.
 */
function getEnvConfig($path = __DIR__ . '/.env'): array {
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $config = [];
    if (file_exists($path)) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) {
                continue;
            }

            $parts = explode('=', $line, 2);
            if (count($parts) === 2) {
                $key = trim($parts[0]);
                $val = trim($parts[1]);
                $val = trim($val, "\"'");
                $config[$key] = $val;
                putenv("$key=$val");
                $_ENV[$key] = $val;
            }
        }
    }
    return $config;
}

/**
 * Initialize and configure a PHPMailer instance using .env settings.
 */
function getMailer(): PHPMailer {
    $env = getEnvConfig();

    $smtpHost   = $env['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $smtpPort   = (int)($env['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: 587);
    $smtpSecure = strtolower($env['SMTP_SECURE'] ?? getenv('SMTP_SECURE') ?: 'tls');
    $smtpUser   = $env['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'info@oceanuscontainer.com';
    $smtpPass   = $env['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: '';
    $fromEmail  = $env['MAIL_FROM_ADDRESS'] ?? getenv('MAIL_FROM_ADDRESS') ?: $smtpUser;
    $fromName   = $env['MAIL_FROM_NAME'] ?? getenv('MAIL_FROM_NAME') ?: 'Oceanus Line Website';

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = ($smtpSecure === 'ssl') ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 15;
    $mail->getSMTPInstance()->Timelimit = 30;

    $mail->setFrom($fromEmail, $fromName);

    return $mail;
}
