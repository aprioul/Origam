<?php

$module_path = str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'] . '/' .$_SERVER['REQUEST_URI']));
$base_path = $GLOBALS['base_path'] = realpath($_SERVER['DOCUMENT_ROOT']);

$module = explode('/', $module_path);

$js_files = glob('Assets/js/*.js');
$css_files = glob('Assets/css/*.css');

$files = scandir($base_path . '/Modules/');

$title = 'Origam Demo';

$sections  = array();
$sections['core'] = "Include/core.inc";

$content = '';