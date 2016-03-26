<?php 
	if(isset($_GET["symbol"]) && $_GET["symbol"] != null && $_GET["symbol"] != "") {
		$url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$_GET["symbol"];
		$content = file_get_contents($url);
		$content = utf8_encode($content); 
		echo $content;
	}
?>
