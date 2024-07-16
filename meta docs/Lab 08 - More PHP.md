# Lab 8: Assignment with PHP/HTML/CSS/JavaScript

Continue working on your PHP version of
the Yatzy game.

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

### 1. Model Your Leaderboard

How are you going to store your leaderboard?

Update your game model to keep track of a leaderboard.

Note: You DO NOT need to persist the leaderboard between
sessions.

Commit these changes and push to [GitHub](https://github.com/).

### 2. Add Leaderboard API

Expose your leaderboard via a PHP API (aka JSON data) 
so that the client (aka the browser) can make requests


Commit these changes and push to [GitHub](https://github.com/).

### 3. Design the UI of your Leaderboard

In HTML / CSS design the look and feel of your leaderboard.
Refer to your design system for inspiration. Update the design
system based on any new re-usable components (e.g. tabular data).

Commit these changes and push to [GitHub](https://github.com/).

### 4. Integrate UI to Leaderboard API

Update your game to call the leaderboard API to _correctly_
display the leaderboard based on the stored results.

How should you handle the UI when the leaderboard is empty?
What about pagination (or will you limit it to the top N records).

Commit these changes and push to [GitHub](https://github.com/).