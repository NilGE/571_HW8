<?php 
	$accountKey = '0PVcjEaIk/ah+ez2Y5EsVW4a1Y/7x/oiM6Au275yrGU';
	$context = stream_context_create(array(
	    'http' => array(
	    	'request_fulluri' => true,
	        'header'  => "Authorization: Basic " . base64_encode($accountKey.":".$accountKey)
	    )
	));
	$request = "https://api.datamarket.azure.com/Bing/Search/v1/News?Query=".urlencode('\''.$_GET["symbol"].'\'')."&\$format=json";
	$data = file_get_contents($request, 0, $context);
	echo $data;
	// echo 1;
?>