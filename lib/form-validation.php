<?php
defined('OCEANUS_MAILER') or die('Direct access not permitted');

function form_length($value) {
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : preg_match_all('/./us', $value);
}

function validate_request_fields() {
    foreach ($_POST as $value) {
        if (!is_string($value) || strlen($value) > 16000 || !preg_match('//u', $value)) {
            http_response_code(400);
            exit('Please provide valid form fields.');
        }
    }
}

function valid_phone($phone) {
    $digits = preg_replace('/\D/', '', $phone);
    return preg_match('/^\+?[0-9 () .\-]{7,25}$/', $phone) && strlen($digits) >= 7 && strlen($digits) <= 15;
}

// Serialize updates so concurrent requests cannot bypass the limit.
function enforce_rate_limit() {
    $directory = sys_get_temp_dir() . '/oceanus_rate_limit';
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        http_response_code(503);
        exit('Please try again shortly or contact info@oceanuscontainer.com.');
    }
    $key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN') . ($_SERVER['SCRIPT_NAME'] ?? ''));
    $handle = @fopen($directory . '/' . $key . '.json', 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) {
        if ($handle) fclose($handle);
        http_response_code(503);
        exit('Please try again shortly.');
    }
    $now = time();
    $stored = json_decode(stream_get_contents($handle), true);
    $requests = array_values(array_filter(is_array($stored) ? $stored : [], function ($t) use ($now) {
        return is_int($t) && $now - $t < 3600;
    }));
    $retry = count($requests) >= 5 ? max(1, 3600 - ($now - $requests[0])) : 0;
    if ($requests && $now - end($requests) < 10) $retry = max($retry, 10 - ($now - end($requests)));
    if ($retry) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: ' . $retry);
        http_response_code(429);
        exit('Too many submissions. Please wait before trying again.');
    }
    $requests[] = $now;
    rewind($handle);
    ftruncate($handle, 0);
    $saved = fwrite($handle, json_encode($requests));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    if ($saved === false) {
        http_response_code(503);
        exit('Please try again shortly.');
    }
}
