<?php
$content = '';
$variables = array();
$description = '';
$variables['#function'] = 'origam_create_grid';

for ($line = 1; $line < (3 + 1); $line++) {
    $variables['#content']['items'][$line][1]['content'] = '<div class="example-color-box"></div>';
    $variables['#content']['items'][$line][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
    $variables['#content']['items'][$line][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of3';
    if($line == 2){
        $variables['#content']['items'][$line][1]['content_attributes_array']['class'][]= 'origam-grid__cell_push-1of6';
    }
}

$variables['#code']['items'][1][1]['content'] = 'content';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of5';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][]= 'origam-grid__cell_push-1of6';

$content = origam_create_example($variables);

include $base_path . "/Templates/section.tpl.php";