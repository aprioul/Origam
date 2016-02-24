<?php

$js_files = glob('Assets/js/*.js');
$css_files = glob('Assets/css/*.css');

$module_path = backtrace_filename_includes();
$module = explode('\\', $module_path);

$files = scandir('../../Modules/');

$title = 'Origam Demo';

$section  = array();
$section[] = 'core';

