<?php

$module_path = explode('/', get_current_module_title());
$title = $module_path[count($module_path)-1];

$components = scandir('Assets/sass/Components/');

foreach ($components as $component) {
  if (!in_array($component, array('.', '..'))) {
    $section_name = str_replace('_', '', str_replace('.scss', '', $component));
    $sections[$section_name] = "Include/" . $section_name . ".inc";
  }
}

$variables = array();