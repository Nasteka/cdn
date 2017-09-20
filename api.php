<?php

require __DIR__ . '/vendor/autoload.php';
$env = new Dotenv\Dotenv(__DIR__);
$env->load();

$client_id = getenv('CLIENT_ID');
$client_secret = getenv('CLIENT_SECRET');

header('Content-Type: application/json; charset=UTF-8');

// check main attribute to  work
if (empty($_POST['query'])) {
    header('HTTP/1.1 500 Error');
    die(json_encode(array('message' => "Can't init Api")));
}

// set some basic values
$url = "https://api.github.com/search/repositories";

$p = $_POST['p'];
$query = $_POST['query'];
$langs = $_POST['lang'];

$post = [
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'page' => $p,
    'q' => $query,
];

// prepare lang for final string parameter
$lang_ = '';
foreach ($langs as $lang) {
    $lang_ .= "+language:" . $lang;
}
// prepare main query
array_walk($post, function (&$a, $b) {
    $a = "$b=$a";
});

$get = "?" . implode("&", $post);
$get = $get . $lang_;

// init end exec curl
$ch = curl_init($url . $get);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Searcher app by Nasteka');

$response = curl_exec($ch);

curl_close($ch);

echo $response;
?>