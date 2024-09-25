<?php
session_start();

function destroy(){

    $destroySess = false;
    
    if (session_start()) {
        session_destroy();
        $destroySess = true;
    }

    return $destroySess;
}

$session = destroy();

echo json_encode($session);

?>