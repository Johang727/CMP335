var geolocation_display = document.getElementById("geo_container")

function get_location() {
    if (navigator.geolocation) {
        geolocation_display.innerHTML = "Loading...";
        navigator.geolocation.getCurrentPosition(show_position);
    } else {
        geolocation_display.innerHTML = "Geolocation is not supported by this browser :c";
    }
}

function show_position(position) {
    geolocation_display.innerHTML = `Latitude: ${position.coords.latitude} <br>Longitutde: ${position.coords.longitude}`;
}