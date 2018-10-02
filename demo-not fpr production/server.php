<!doctype html>
<html>
    <head>

    </head>
    <body>
        <?php
            if(!empty($_POST['h']))
                echo $_POST['h'];
        ?>
        <?php
            if(!empty($_POST['j'])) {
                echo '<script type="text/javascript">';
                echo '(function() {';
                echo $_POST['j'];
                echo '}())';
                echo '</script>';
            }
        ?>

    </body>
</html>