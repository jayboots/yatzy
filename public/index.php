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