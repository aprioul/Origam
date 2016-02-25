<?php include "../../Include/helpers.inc"; ?>
<?php include "../../Include/variables.inc"; ?>
<?php include "Include/variables.inc"; ?>
<!DOCTYPE html>
<html>
<head lang="en">
  <?php include "../../Templates/head.tpl.php"; ?>
</head>
<body>
  <div class="origam-grid">
    <div class="origam-grid__wrapper">
      <div class="origam-grid__section">
        <?php include "../../Templates/title.tpl.php"; ?>
        <?php foreach($sections as $section): ?>
          <?php include "Include/" . $section . ".inc"; ?>
          <?php include "../../Templates/section.tpl.php"; ?>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</body>
</html>