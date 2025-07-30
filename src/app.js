import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';

async function loadGoogleMapsAPI(apiKey) {
  return new Promise(resolve => {
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    script.async = true;
    window.initMap = resolve;
    document.head.appendChild(script);
  });
}

async function runApp() {
  await loadGoogleMapsAPI(process.env.GOOGLE_MAPS_API_KEY);

  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.07108, lng: 121.5598 },
    mapId: process.env.MAP_ID,
    tilt: 45,
    zoom: 13,
  });

  const hexagonLayer = new HexagonLayer({
    id: 'hexagon-layer',
    data: './stations.json',
    gpuAggregation: true,
    extruded: true,
    colorRange: [
      [239, 243, 255],
      [198, 219, 239],
      [158, 202, 225],
      [107, 174, 214],
      [49, 130, 189],
      [8, 81, 156]
    ],
    getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)],
    getColorWeight: d => parseInt(d.capacity),
    getElevationWeight: d => parseInt(d.capacity),
    elevationScale: 4,
    radius: 150,
    pickable: true,
    autoHighlight: true,
  });

  const googleMapsOverlay = new GoogleMapsOverlay({
    layers: [hexagonLayer]
  });
  googleMapsOverlay.setMap(map);

  // map.addListener('idle', () => {
  //   googleMapsOverlay.setProps({ layers: [hexagonLayer] });
  // });

  function setMap(center, zoom) {
    map.setCenter(center);
    map.setZoom(zoom);
    googleMapsOverlay.setProps({ layers: [hexagonLayer] });
  }
}

runApp();