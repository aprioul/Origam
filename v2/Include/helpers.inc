<?php
/**
 * @file
 * Helpers for origam
 */

require($base_path . "/Require/htmLawed.php");

function base_url() {
  return sprintf(
    "%s://%s",
    isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
    $_SERVER['SERVER_NAME']
  );
}

function scripts($path, $type = 'text/javascript') {
  return '<script type="' . $type . '" src="' . $path . '"></script>';
}

function styles($path, $rel = 'stylesheet', $type = '') {
  return '<link href="' . $path . '" rel="' . $rel . '" type="' . $type . '"/>';
}

function get_current_module_title() {
  return dirname($_SERVER['PHP_SELF']);
}

function origam_attributes(array $attributes = array()) {
  foreach ($attributes as $attribute => &$data) {
    $data = implode(' ', (array) $data);
    $data = $attribute . '="' . check_plain($data) . '"';
  }
  return $attributes ? ' ' . implode(' ', $attributes) : '';
}

function check_plain($text) {
  return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function origam_create_example($variables, $options = array()){

  $function = $variables['#function'];

  if(!empty($variables['#content'])) {
    $variables['content'] = $function($variables['#content']);
  }
  if(!empty($variables['#code'])) {
    $variables['code'] = check_plain(htmLawed($function($variables['#code']), array('tidy' => 4)));
  }

  $variables['demo_attributes_array']['class'][] = 'origam-demo';
  $variables['example_attributes_array']['class'][] = 'origam-example';
  $variables['code_attributes_array']['class'][] = 'html';

  $variables['code_attributes'] = origam_attributes($variables['code_attributes_array']);
  $variables['example_attributes'] = origam_attributes($variables['example_attributes_array']);
  $variables['demo_attributes'] = origam_attributes($variables['demo_attributes_array']);

  $output = origam_render("../../Templates/example.tpl.php", $variables);

  return $output;
}

function origam_create_grid($variables) {
  $items = $variables['items'];
  $variables['content'] = '';

  $variables['grid_attributes_array']['class'][] = 'origam-grid';
  $variables['wrapper_attributes_array']['class'][] = 'origam-grid__wrapper';
  $variables['section_attributes_array']['class'][] = 'origam-grid__section';
  if(!empty($variables['#full']) && $variables['#full']){
    $variables['section_attributes_array']['class'][] = 'origam-grid__section_full';
  }

  if(!empty($variables['#no-gutter']) && $variables['#no-gutter']){
    $variables['section_attributes_array']['class'][] = 'origam-grid_no-gutter';
  }
  $variables['content_attributes_array']['class'] = array();

  foreach ($items as $line => $line_data) {
    foreach ($line_data as $col => $col_data) {
      $variables['content'] .= origam_create_content($col_data);
    }
  }

  $variables['grid_attributes'] = origam_attributes($variables['grid_attributes_array']);
  $variables['wrapper_attributes'] = origam_attributes($variables['wrapper_attributes_array']);
  $variables['section_attributes'] = origam_attributes($variables['section_attributes_array']);

  return origam_render("../../Templates/grid.tpl.php", $variables);
}

function origam_create_content($variables) {
  $variables['content_attributes'] = origam_attributes($variables['content_attributes_array']);

  return origam_render("../../Templates/content.tpl.php", $variables);
}

function origam_render($template_file, $variables){

  // Extract the variables to a local namespace.
  extract($variables, EXTR_SKIP);

  // Start output buffering.
  ob_start();

  // Include the template file.
  include $template_file;

  // End buffering and return its contents.
  return ob_get_clean();
}