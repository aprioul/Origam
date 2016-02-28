<?php
$content = '';
$variables = array();
$description = '';
$variables['#function'] = 'origam_create_grid';

for ($line = 1; $line < (3 + 1); $line++) {
    $variables['#content']['items'][$line][1]['content'] = '<div class="example-color-box"></div>';
    $variables['#content']['items'][$line][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
    $variables['#content']['items'][$line][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of3';
}

$variables['#code']['items'][1][1]['content'] = 'content';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of5';

$variables['#content']['#no-gutter'] = $variables['#code']['#no-gutter'] = TRUE;

$content = origam_create_example($variables);

include $base_path . "/Templates/section.tpl.php";
