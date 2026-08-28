const geoStatus = document.getElementById('geo-status');
const geoButton = document.getElementById('geo-button');

if (geoButton) {
  geoButton.addEventListener('click', getLocation);
}

function getLocation() {
  if (!navigator.geolocation) {
    geoStatus.textContent = 'Geolocation is not supported by this browser.';
    return;
  }

  geoStatus.textContent = 'Loading your location...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      geoStatus.innerHTML = `Latitude: ${latitude.toFixed(4)}<br>Longitude: ${longitude.toFixed(4)}`;
    },
    () => {
      geoStatus.textContent = 'Unable to access your location. Please allow location access.';
    }
  );
}
