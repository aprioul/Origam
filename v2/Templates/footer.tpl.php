<?php
/**
 * @file
 * Make footer for website.
 */

?>

<?php print scripts(base_url() . '/Assets/js/demo.js'); ?>
<?php if (!in_array('Modules',$module)): ?>
<script type="text/javascript">
    BRANDBAR.breakout();

    (function (BRANDBAR, $, undefined) {
        BRANDBAR.url = 'demo/demo.html';
    }(window.BRANDBAR = window.BRANDBAR || {}, jQuery));


    jQuery(function () {
        BRANDBAR.init();
    });
</script>
<?php endif; ?>