<?php
$content = '';
$variables = array();
$description = '';
$variables['#function'] = 'origam_create_grid';

$variables['#code']['items'][1][1]['content'] = 'content';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid__cell';
$variables['#code']['items'][1][1]['content_attributes_array']['class'][] = 'origam-grid_size-1of5';
$variables['#code']['#full'] = TRUE;

$content = origam_create_example($variables);