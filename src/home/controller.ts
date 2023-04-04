import Controller from '@curveball/controller';
import { Context } from '@curveball/core';

class HomeController extends Controller {

  get(ctx: Context) {

    ctx.response.type = 'application/json';
    ctx.response.body = {
      _links: {
        'map-data': {
          href: '/map{?x,y,height,width}',
          templated: true,
          title: 'Download map data',
        }
      },
      title: 'Hello World!'
    };

  }

}

export default new HomeController();
