#!/usr/bin/env node
function greeting() {
    var newname = document.getElementById("name").value;

    document.getElementById("greeting").innerHTML = `Hello ${newname}!`;
}