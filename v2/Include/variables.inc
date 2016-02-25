<?php

$js_files = glob('Assets/js/*.js');
$css_files = glob('Assets/css/*.css');

$module_path = backtrace_filename_includes();
$module = explode('\\', $module_path);

$base_path = realpath($_SERVER['DOCUMENT_ROOT']);

$files = scandir($base_path . '/Modules/');

$title = 'Origam Demo';

$sections  = array();
$sections[] = 'core';

$content = '';

