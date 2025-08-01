import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';

const googleMapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;

loadJSAPI();

function runApp() {
  const map = initMap();
  const layerOptions = {
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
  };
  const hexagonLayer = new HexagonLayer(layerOptions);
  const googleMapsOverlay = new GoogleMapsOverlay({
    controller: true,
    getTooltip: ({object}) => {
      if (!object || !object.points || object.points.length === 0) return null;
      const name = object.points[0].source.name;
      const address = object.points[0].source.address;
      return `場所名稱：${name} \n 場所地址：${address} \n 飲水台數：${object.elevationValue}`;
    },
    layers: [hexagonLayer]
  });
  googleMapsOverlay.setMap(map);
}

function loadJSAPI() {
  const googleMapsAPIURI = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&callback=runApp&loading=async`;
  const script = document.createElement('script');

  script.src = googleMapsAPIURI;
  script.defer = true;
  script.async = true;

  window.runApp = runApp;
  document.head.appendChild(script);
}

function initMap() {
  const mapOptions = {
    center: { lat: 25.07108, lng: 121.5598 },
    mapId: process.env.MAP_ID,
    tilt: 45,
    zoom: 13,
  };

  const mapDiv = document.getElementById('map');
  return new google.maps.Map(mapDiv, mapOptions);
}
