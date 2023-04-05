import router from '@curveball/router';

//import homeController from './home/controller.js';
import mapDataController from './map-data/controller/map-data.js';
import gpsToTileController from './map-data/controller/gps-to-tile.js';

export default [
//  router('/', homeController),
  router('/map', mapDataController),
  router('/gps-to-tile', gpsToTileController),
];
