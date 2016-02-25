<?php

$title = str_replace('/Modules/', '', get_current_module_title());

$components = scandir('Assets/sass/Components/');

foreach ($components as $component) {
  if (!in_array($component, array('.', '..'))) {
    $sections[] = str_replace('_', '', str_replace('.scss', '', $component));
  }
}