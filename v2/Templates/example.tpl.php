<div <?php print $demo_attributes; ?>>
    <?php if (!empty($content)): ?>
        <div <?php print $example_attributes; ?>>
            <?php print $content; ?>
        </div>
    <?php endif; ?>
    <?php if (!empty($code)): ?>
        <pre>
            <code <?php print $code_attributes; ?>>
<?php print $code; ?>
            </code>
        </pre>
    <?php endif; ?>
</div>
