<?php

$title = str_replace('/Modules/', '', get_current_module_title());

$components = scandir('Assets/sass/Components/');

foreach($components as $component){
  var_dump($component);
}