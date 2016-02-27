<?php
$content = '';
$variables = array();
$description = '';
$variables['#function'] = 'origam_create_grid';

for ($line = 1; $line < (12 + 1); $line++) {
  for ($col = 1; $col < ($line + 1); $col++) {
    $variables['#content']['items'][$line][$col]['content'] = '<div class="example-color-box"></div>';
    $variables['#content']['items'][$line][$col]['content_attributes_array']['class'][] = 'origam-grid__cell';
    $variables['#content']['items'][$line][$col]['content_attributes_array']['class'][] = 'origam-grid_size-1of' . $line;
  }
}

$variables['#code']['items'][1][1]['content'] = 'content';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of5';

$content = origam_create_example($variables);
