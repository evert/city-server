import { Controller } from '@curveball/controller';
import { Context } from '@curveball/core';
import { getPixelsFromGps } from './../service.js';

class GpsToTileController extends Controller {

  async get(ctx: Context) {

    const lat = +ctx.query.lat;
    const lng = +ctx.query.lng;

    const result = getPixelsFromGps(lng, lat);
    ctx.response.body = {
      x: result[0],
      y: result[1]
    };

  }

}

export default new GpsToTileController();
