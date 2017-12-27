<!DOCTYPE html>
<html lang="en" ng-app="cimmytSearchApp">


<head>
    <base href="/cimmyt/">
    <meta name="fragment" content="!" />
	<link rel="shortcut icon" href="img/favicon.ico">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,700" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" href="css/jquery.mCustomScrollbar.min.css" type="text/css"/>
    <link rel="stylesheet" href="css/loaders.min.css" type="text/css"/>
    <link rel="stylesheet" type="text/css" href="css/rzslider.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CIMMYT Search</title>
</head>

<body>
<div ng-controller="mainController" ng-init="initParams()" class=" main">
	   <div ng-view></div>
</div>
    <script src="js/underscore-min.js"></script>
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/angular.min.js"></script>
    <script src="js/angular-route.js"></script>
    <script src="js/angular-ui-switch.min.js"></script>
    <script src="js/main.js"></script>
    <script src="js/angucomplete.js"></script>
    <script src="js/ngMeta.min.js"></script>
    <script src="js/rzslider.min.js"></script>
    <script src="js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="js/scrollbars.min.js"></script>
    <script src="js/select.js"></script>
</body>
</html>
