import { Controller } from '@curveball/controller';
import { Context } from '@curveball/core';
import { getChunk, getGpsFromPixels } from './service.js';

class MapDataController extends Controller {

  async get(ctx: Context) {

    const x = +ctx.query.x;
    const y = +ctx.query.y;
    const height = +ctx.query.height;
    const width = +ctx.query.width;

    /*
    const map = {
      tiles: range(height, () => range(width, () => chance(3) ? rand(0,200): 0))
    };

    ctx.response.body = JSON.stringify(map);

    */

    const map = (await getChunk([x,y,x+width,y+height]))
      .map(tile => transformTileType(tile));

    const slicedMap = range(height, (): number[] => []);
    for(let x=0; x < width; x++){
      for(let y=0; y < height; y++){
        slicedMap[y].push(map[x*width+y]);
      }
    }

    //let slice = [];
    //while((slice = map.splice(0, width)).length) slicedMap.push(slice);

    ctx.response.body = {
      tiles: slicedMap,
      block: [x, y, x+width, y+height],
      gpsBlock: [...getGpsFromPixels(x,y), ...getGpsFromPixels(x+width, y+height)],
    };

  }

}

const C3S = {
  URBAN: 190,
  BARE: 200,
  WATER: 210,
  SNOWICE: 220,
};

const MICROPOLIS = {
  DIRT: 0,
  WATER1: 3,
  WATER2: 4,
  RESIDENTIAL_R: 244,
};

function transformTileType(inputType: number): number {

  switch(inputType) {
    case C3S.URBAN: return MICROPOLIS.RESIDENTIAL_R;
    case C3S.BARE: return MICROPOLIS.DIRT;
    case C3S.WATER: return MICROPOLIS.WATER1;
    case C3S.SNOWICE: return MICROPOLIS.WATER2;
    default: return inputType;
  }

}

export function range<T>(num: number, valueCb: (idx: number) => T): T[] {

  const r = [];
  for (let i=0; i<num; i++) {
    if (typeof valueCb === 'function') {
      r.push(valueCb(i));
    } else {
      r.push(valueCb);
    }
  }
  return r;

}

export function rand(min: number, max: number): number {

  return Math.floor((Math.random()*(max-min))+min);

}

export function chance(max: number): boolean {

  return rand(0, max)===0;

}

export default new MapDataController();
