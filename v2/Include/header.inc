<?php
/**
 * @file
 * Make header for website.
 */

$files = scandir('Modules/');

?>
<div id="brandbar">
    <div id="brandbar-logo">

    </div>

    <div id="brandbar-content">
        Origam Demo:
        <select id="brandbar-menu" data-behaviour="open">
            <option value="">--select demo--</option>
            <?php foreach ($files as $file) : ?>
                <?php if ($file != '.' && $file != '..') : ?>
                    <option value="Modules/<?php print $file;?>/k"><?php print $file;?></option>
                <?php endif; ?>
            <?php endforeach; ?>
        </select>
    </div>

    <div id="brandbar-buttons">
        <span title="Resize to full width" class="brandbar-resize origamicon origamicon-desktop" data-width="full" ></span>
        <span title="Resize to tablet width" class="brandbar-resize origamicon origamicon-tablet" data-width="768px" ></span>
        <span title="Resize to phone width" class="brandbar-resize origamicon origamicon-mobile" data-width="320px" ></span>
    </div>
</div>