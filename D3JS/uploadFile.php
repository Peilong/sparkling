<?php
/**
 * Author: Peilong Li
 * Date: 02/17/14
 * Purpose: Upload file to web server
 */
function uploadFile(){
    $content = '';

    // Upload file
    $upload_file = $_FILES['upload_file']['tmp_name'];  //Temp file name when file is uploaded
    $upload_file_name = $_FILES['upload_file']['name']; //File's original name on client
    $type = $_FILES['upload_file']['type'];  //MIME type of this file, need support from browser. e.g. "image/gif"。
    $upload_file_size = filesize ( $upload_file ); //Uploaded file size (in Byte).

    if( !$upload_file ){
        echo "Please choose a file to upload!";
    }
    else {
        $file_size_max = 2*1024*1024;// Limit the max file size to 2M (bytes)
        //SITE_ROOT is an environment variable, which is /User/pli/IdeaProjects/Sites in my case.
        $store_dir = SITE_ROOT."/GanttChart/data/";// Directory where file is uploaded
        $accept_overwrite = 1;//Override the file with same name? 1-Yes. 0-No.

        // Check the file size
        if ($upload_file_size > $file_size_max) {
            echo "Sorry，the upper limit of file size is 2MB";
            exit;
        }

        // Check name conflicts
        if (file_exists($store_dir . $upload_file_name) && !$accept_overwrite) {
            Echo "Name conflicts with existing files";
            exit;
        }

        // Save file to a directory.
        // USAGE: move_uploaded_file (fileName, destination)
        if ( !move_uploaded_file($upload_file,$store_dir.$upload_file_name) ) {
            echo "Fail to copy file to default directory";
            exit;
        }

        $Erroe=$_FILES['upload_file']['error'];
        switch($Erroe){
            case 0:
                Echo $upload_file_name." is successfully uploaded"; break;
            case 1:
                Echo "File size exceeds the value of php.ini upload_max_filesize"; break;
            case 2:
                Echo "File size exceeds the value of HTML MAX_FILE_SIZE"; break;
            case 3:
                Echo "Only part of the file is uploaded!";break;
            case 4:
                Echo "No file has been uploaded";break;
        }

        // Read the content from a successfully uploaded file
        switch ($type) {
            case 'application/msword':
                //$content = shell_exec( '/usr/local/bin/antiword -w 0'.$store_dir.$upload_file_name );
                $content = shell_exec( '/usr/local/bin/catdoc -s utf-8'.$store_dir.$upload_file_name );
                break;
            case 'application/pdf':
                $content = pdf2text($store_dir.$upload_file_name);
                break;
            default:
                $content = file_get_contents($store_dir.$upload_file_name);
                break;
        }
    }
    return $content;
}

?>