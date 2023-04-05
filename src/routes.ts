import router from '@curveball/router';

import homeController from './home/controller.js';
import mapDataController from './map-data/controller.js';

export default [
  router('/', homeController),
  router('/map', mapDataController),
];
