<?php

function console_log( $data ){
    echo '<script>';
    echo 'console.log('. json_encode( $data ) .')';
    echo '</script>';
}

    // gets entire POST body
    $param = file_get_contents('php://input');
    $data = json_decode($param,true);
    // write the data out to the file
    if ($data{"mode"} == "form") {
        
        if (mkdir('./'.$data{"filename"}, 0777)){
            chmod($data{"filename"}, 0777);

            echo 'フォルダを作成しました。';
          }else{
            echo 'フォルダの作成が失敗しました。';
          }

          $formData = $data{"filename"}."\t".$data{"date"}."\t".$data{"gender"}."\t".$data{"age"}."\n";
          file_put_contents("log.dat", $formData, FILE_APPEND | LOCK_EX);
      }
    else {
        $post_data = $_POST;
        $audio_data =file_get_contents($_FILES['blob']['tmp_name']);
        console_log($_FILES['blob']['tmp_name']);
        console_log("./".$post_data["filename"]."/".$post_data["filename"]."-".$post_data["num"].".wav");
        $fp = fopen("./".$post_data["filename"]."/".$post_data["filename"]."-".$post_data["num"].".wav", "wb");
        fwrite($fp,$audio_data );
        fclose($fp);
    }



?>