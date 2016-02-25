<?php

$content = '';
$content = create_grid(12);

function create_grid($max_col) {

  for ($line = 1; $line < ($max_col + 1); $line++) {
    for ($col = 1; $col < ($line + 1); $col++) {
      $variables['items'][$line][$col]['content'] = '<div class="example-color-box"></div>';
      $variables['items'][$line][$col]['content_attributes']['class'][] = 'origam-grid__cell';
      $variables['items'][$line][$col]['content_attributes']['class'][] = 'origam-grid_size-1of' . $line;
    }
  }

  $output =  origam_create_grid($variables);

  return $output;
}