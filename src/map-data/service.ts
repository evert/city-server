import { fromFile, GeoTIFF, GeoTIFFImage } from 'geotiff';

type Box = [number, number, number, number];

export async function getChunk(box: Box): Promise<number[]> {

  const image = await getTiffImage();
  const rasters = await image.readRasters({
    window: box,
  });
  return Array.from(rasters[0] as Uint8Array);

}



let tiff: GeoTIFF|null = null;

export async function getTiff() {

  if (tiff) return tiff;
  tiff = await fromFile('data/world.tif');
  return tiff;

}

let image: GeoTIFFImage|null = null;

let [sx, sy] = [0,0];
let [gx, gy] = [0,0];

export async function getTiffImage() {

  if (image) return image;
  const tiff = await getTiff();
  image = await tiff.getImage(); // by default, the first image is reado.
  const { ModelPixelScale: s, ModelTiepoint: t } = image.fileDirectory;
  [sx, sy] = s;
  sy = -sy;
  [,,, gx, gy] = t;
  return image;
}



// const gpsToPixel = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];
export function getGpsFromPixels(x:number, y:number) {

  const pixelToGPS: Matrix = [gx, sx, 0, gy, 0, sy];
  return transform(x, y, pixelToGPS, false);

}

export function getPixelsFromGps(x:number, y:number) {

  const gpsToPixel:Matrix = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];
  return transform(x, y, gpsToPixel, true);

}



type Matrix = [number, number, number, number, number, number];

export function transform(a: number, b:number, M: Matrix, roundToInt = false): [number, number] {
  const round = (v:number) => (roundToInt ? v | 0 : v);
  return [
    round(M[0] + M[1] * a + M[2] * b),
    round(M[3] + M[4] * a + M[5] * b),
  ];
}
