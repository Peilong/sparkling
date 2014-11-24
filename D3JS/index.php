<?php
/**
 * Author: Peilong Li
 * Date: 07/22/2014
 * Purpose: Index page
 */
require_once("uploadFile.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Sparkling Web Tool</title>

        <!-- JS Public -->
        <script type='text/javascript' src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
        <script type='text/javascript' src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <script type='text/javascript' src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
        <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages:["corechart"]});
            google.load('visualization', '1', {packages:['table']});
        </script>

        <!-- JS User Defined -->
        <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
        <script type="text/javascript" src="gantt-chart-d3v2.js"></script>
        <script type="text/javascript" src="TaskTimelineView.js"></script>
        <script type="text/javascript" src="loadData.js"></script>
        <script type="text/javascript" src="radioButton.js"></script>
        <script type="text/javascript" src="histogramView.js"></script>

        <!-- CSS -->
        <link type="text/css" href="http://mbostock.github.io/d3/style.css" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.4/themes/dot-luv/jquery-ui.css">
        <link rel="stylesheet" type="text/css" href="index.css">
    </head>
    <body>
        <div id = "title">
            <div id="name">
                <span id="t1">Sparkling: </span>
                <span id="t2">Spark Data Web Analyzer</span>
            </div>
        </div>

        <div id="content">
            <div id="radio">
                <input type="radio" id="radio1" name="radio" checked="checked"><label for="radio1">Task Timeline</label>
                <input type="radio" id="radio2" name="radio"><label for="radio2">Executor Timeline</label>
                <input type="radio" id="radio3" name="radio"><label for="radio3">Statistical Analysis</label>
                <input type="radio" id="radio4" name="radio"><label for="radio4">Development Suggestions (Coming Soon)</label>
            </div>

            <form enctype="multipart/form-data" action="" method="post" style="margin: -10px 0 0px 50px">
                <label for="uploadFile">Upload Input File: </label>
                <input id="uploadFile" name="upload_file" type="file" value="<?php if(isset($_POST['upload_file'])) {echo $_POST['upload_file'];} ?>">
                <input type="submit" name="submit" value="Submit">
                <p id="msg1">
                    <?php if(  $_POST['submit'] == "Submit" ){
                        $content=uploadFile();
                        $jsonContent = json_encode($content);
                    } ?>
                </p>
            </form>
            <script type="text/javascript">
                var myjson =
                    <?php
                        if ( isset($_POST['submit']) ){
                            echo $jsonContent;
                        } else{
                            echo '""';
                        }
                    ?>;
                firstFunction( myjson );
            </script>

            <!-- button type="button" onclick="addTask()">Add Task</button -->
            <div id="scaleButton"></div>

            <div id="svgWrapper"></div>
        </div>
    </body>
</html>

