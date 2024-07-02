# Lab 7: Yatzy Game AJAX

Using PHP, Slim and jQuery, the students will implement an JSON API
to allow AJAX calls from your Yatzy game.

## Learning Objectives

* Experience writing PHP
* Experience with jQuery for AJAX calls
* Experience with RESTful APIs using Slim Framework
* Migrating Yatzy game features to the JSON RESTful API

## Resources

* [Sublime Text IDE](https://www.sublimetext.com)
* [Visual Studio](https://code.visualstudio.com)
* [PHP](https://www.php.net) (`php --version`)
* [PHPUnit](https://phpunit.de) (`phpunit --version`)
* [PHP Frameworks](https://www.hostinger.com/tutorials/best-php-framework)
* [Composer](https://getcomposer.org)
* [jQuery](https://jquery.com)
* [AlpineJS](https://alpinejs.dev)
* [Slim Framework](https://www.slimframework.com)
* [Install Slim](https://www.slimframework.com/docs/v4/start/installation.html)
* [Laravel](https://laravel.com)
* [Phalcon](https://phalcon.io/en-us)

## Tasks

This is an individual lab in your `yatzy`
repository from previous labs.


### 1. Set Up Your Project

Create a `public/api.php` file with an _hello world_ api endpoint

```php
<?php
require_once('_config.php');
header("Content-Type: application/json");
echo json_encode(["version" => "0.9"]);
```

You should see the reply at `http://localhost:4000/api.php`

Commit these changes and push to [GitHub](https://github.com/).


### 2. Create a Button onclick Event

Update your `public/index.php` to have a button roll a die and record the result.

```php
<?php
require_once('_config.php');
?>

<div id="output">--</div>
<button id="version">Version</button>

<script>
const output = document.getElementById("output");
const version = document.getElementById("version");
version.onclick = function(e) {
  output.innerHTML = "Look up version clicked";
}
</script>
```

Commit these changes and push to [GitHub](https://github.com/).

### 2. Hook up button with AJAX Call

Update the `version.onclick` to make an AJAX call.

```javascript
version.onclick = function(e) {

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        output.innerHTML = xmlhttp.responseText;
      }
    }
  };

  xmlhttp.open("GET", "/api.php", true);
  xmlhttp.send();
}
```

Observe the version being populated on the server.

Now, without refreshing the browser, change the version on
the server (e.g. `echo json_encode(["version" => "1.0"]);`)
and click the button again.

What did you observe?

Commit these changes and push to [GitHub](https://github.com/).

### 3. Create a die roll API endpoint

Implement a die rolling API endpoint.

```
/api.php?action=roll
```

A sample implemenation is below

```php
<?php
require_once('_config.php');

use Yatzy\Dice;

switch ($_GET["action"] ?? "version") {
case "roll":
    $d = new Dice();
    $data = ["value" => $d->roll()];
    break;
case "version":
default:
    $data = ["version" => "1.0"];
}

header("Content-Type: application/json");
echo json_encode($data);
```

You should see the reply at `http://localhost:4000/api.php?action=roll`

Commit these changes and push to [GitHub](https://github.com/).

### 4. Roll a die with AJAX

Integrate the API call into `public/index.php`

```html
<?php
require_once('_config.php');
?>

<div id="die1">--</div>
<button id="roll">Roll</button>

<script>
const die1 = document.getElementById("die1");
const roll = document.getElementById("roll");
roll.onclick = function(e) {

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        die1.innerHTML = xmlhttp.responseText;
      }
    }
  };

  xmlhttp.open("GET", "/api.php?action=roll", true);
  xmlhttp.send();
}
</script>
```

You should now able to roll the die.

Commit these changes and push to [GitHub](https://github.com/).

### 5. Integrate JQuery (or other libraies)

Using a library like [jQuery](https://jquery.com) (or other tools like [AlpineJS](https://alpinejs.dev)) can help simplify your code.

```html
<?php
require_once('_config.php');
?>

<html>
  <head>
    <script type="text/javascript" src="/assets/jquery-3.6.0.min.js"></script>
  </head>
  <body>

    <div id="die1">--</div>
    <button id="roll">Roll</button>

    <script>
      const die1 = document.getElementById("die1");
      const roll = document.getElementById("roll");
      roll.onclick = async function() {
        let answer = $.ajax({
          type: "GET",
          url: "api.php?action=roll"
        }).then(function(data) {
          die1.innerHTML = data.value;
        });
      };
    </script>

  </body>
</html>
```

Commit these changes and push to [GitHub](https://github.com/).

### 6. Migrate to Slim framework

API endpoints like `api.php?action=roll` are not considered RESTful.
Using a framework like [Slim](https://www.slimframework.com) can
simplify the url routing.

It is suggested to use [composer](https://getcomposer.org) to [install Slim](https://www.slimframework.com/docs/v4/start/installation.html)

Slim is not required for the lab or assignments.  You are free to
use PHP directly (it will be a bit cumbersome), or other frameworks
like [Laravel](https://laravel.com) or [Phalcon](https://phalcon.io/en-us)

[Install Slim](https://www.slimframework.com/docs/v4/start/installation.html) from the root of your project (this will download the code into the `vendor` directory).

```bash
composer require slim/slim:"4.*"
composer require slim/psr7
```

Update `_config.php` to include the `vendor/autoload.php` file.

```php
$GLOBALS["vendorDir"] = resolve_path("vendor");
require_once $GLOBALS["vendorDir"] . "/autoload.php";
```

Move the `html` from `/public/index.php` into `/app/views/index.html`.

Update `/public/index.php` to initiate the Slim framework.

```php
<?php
require_once('_config.php');

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, $args) {
    $view = file_get_contents("{$GLOBALS["appDir"]}/views/index.html");
    $response->getBody()->write($view);
    return $response;
});

$app->run();
```

Commit these changes and push to [GitHub](https://github.com/).


### 7. RESTful API calls using Slim

We can now implement our RESTful API.

Create two new routes in `public/index.php`

```php
$app->get('/api/version', function (Request $request, Response $response, $args) {
    // fill me in
});

$app->get('/api/roll', function (Request $request, Response $response, $args) {
    // fill me in
});
```

Migrate the `/public/api.php` into the routes above.  Consider
using a helper function like

```php
function jsonReply(Response $response, $data)
{
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
}
```

Does your application work as expected?  Why?

Don't forget to update the API route from `api.php?action=roll` to `/api/roll`.
Your application should continue be behave as expected.

Commit these changes and push to [GitHub](https://github.com/).