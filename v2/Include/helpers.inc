<?php
/**
 * @file
 * Helpers for origam
 */

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

function get_current_module_title(){
  return dirname($_SERVER['PHP_SELF']);
}