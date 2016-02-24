<?php
/**
 * @file
 * Helpers for origam
 */

$js_files = glob('Assets/js/*.js');
$css_files = glob('Assets/css/*.css');

$module_path = backtrace_filename_includes();
$module = explode('\\', $module_path);

function base_url() {
  return sprintf(
    "%s://%s",
    isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
    $_SERVER['SERVER_NAME']
  );
}

function backtrace_filename_includes() {
  $backtrace_array = debug_backtrace();

  return ($backtrace_array[1]['file']);
}

function scripts($path, $type = 'text/javascript') {
  return '<script type="' . $type . '" src="' . $path . '"></script>';
}

function styles($path, $rel = 'stylesheet', $type = '') {
  return '<link href="' . $path . '" rel="' . $rel . '" type="' . $type . '"/>';
}