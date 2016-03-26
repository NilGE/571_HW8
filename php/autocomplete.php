<?php 
	$url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$_GET[ "term" ];
	$result = file_get_contents($url);
	echo $result;
?>
