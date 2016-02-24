<meta charset="UTF-8">
<title><?php print $title; ?></title>
<?php print styles('favicon.ico', 'shortcut icon', 'image/vnd.microsoft.icon'); ?>
<?php print styles(base_url() . '/Assets/css/normalize.css'); ?>
<?php print styles(base_url() . '/Assets/css/demo.css'); ?>
<?php print scripts(base_url() . '/Assets/js/jQuery.js'); ?>
<?php if (!in_array('Modules',$module)): ?>
  <?php print scripts(base_url() . '/Assets/js/brandbar.js'); ?>
<?php else : ?>
  <?php foreach ($css_files as $css_file): ?>
    <?php print styles($css_file); ?>
  <?php endforeach; ?>
  <?php foreach ($js_files as $js_file): ?>
    <?php print scripts($js_file); ?>
  <?php endforeach; ?>
<?php endif; ?>