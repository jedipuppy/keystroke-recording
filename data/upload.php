<?php

function console_log( $data ){
    echo '<script>';
    echo 'console.log('. json_encode( $data ) .')';
    echo '</script>';
}

    // gets entire POST body
    $data = json_decode(file_get_contents('php://input'), true);
    // write the data out to the file
    $fp = fopen($data{"filename"}, "wb");
    console_log( "uploaded" );
    fwrite($fp, $data{"blob"});
    fclose($fp);

?>