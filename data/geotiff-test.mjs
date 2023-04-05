import { fromFile } from 'geotiff';

const lerp = (a, b, t) => (1 - t) * a + t * b;

function transform(a, b, M, roundToInt = false) {
  const round = (v) => (roundToInt ? v | 0 : v);
  return [
    round(M[0] + M[1] * a + M[2] * b),
    round(M[3] + M[4] * a + M[5] * b),
  ];
}

const tiff = await fromFile('./C3S-LC-L4-LCCS-Map-300m-P1Y-2020-v2.1.1.tif');
const image = await tiff.getImage(); // by default, the first image is read.

console.info('Image bounding box: ' + JSON.stringify(image.getBoundingBox()));
console.info('Image file directory: ' + JSON.stringify(image.fileDirectory));

// Construct the WGS-84 forward and inverse affine matrices:
const { ModelPixelScale: s, ModelTiepoint: t } = image.fileDirectory;
let [sx, sy, sz] = s;
let [px, py, k, gx, gy, gz] = t;
sy = -sy; // WGS-84 tiles have a "flipped" y component

const pixelToGPS = [gx, sx, 0, gy, 0, sy];
console.info(`pixel to GPS transform matrix:`, pixelToGPS);

const gpsToPixel = [-gx / sx, 1 / sx, 0, -gy / sy, 0, 1 / sy];
console.info(`GPS to pixel transform matrix:`, gpsToPixel);

// Convert a GPS coordinate to a pixel coordinate in our tile:
const [gx1, gy1, gx2, gy2] = image.getBoundingBox();
const lat = lerp(gy1, gy2, Math.random());
const long = lerp(gx1, gx2, Math.random());


console.info(`Looking up GPS coordinate (${lat.toFixed(6)},${long.toFixed(6)})`);

//const [x, y] = transform(long, lat, gpsToPixel, true);
//console.info(`Corresponding tile pixel coordinate: [${x}][${y}]`);

const [x, y] = transform(-79.394554,43.630390,  gpsToPixel, true);


167.22222222224997, -45.8333333333442
console.info(`Corresponding tile pixel coordinate: [${x*32}][${y*32}]`);

console.info('GPS of yacht club: [' + transform(-79.35535008613182, 43.643273293998135, gpsToPixel,true).map(i => i*32).join(',') + ']');

// And as each pixel in the tile covers a geographic area, not a single
// GPS coordinate, get the area that this pixel covers:
const gpsBBox = [transform(x, y, pixelToGPS), transform(x + 1, y + 1, pixelToGPS)];
console.info(`Pixel covers the following GPS area:`, gpsBBox);


// Finally, retrieve the elevation associated with this pixel's geographic area:
const rasters = await image.readRasters({
  window: [x-10, y-10, x+10, y+10]
});
const { width, [0]: raster } = rasters;
console.info(rasters);
