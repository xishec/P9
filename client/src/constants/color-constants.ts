enum ColorType {
    backgroundColor = 'background-color',
    primaryColor = 'primary-color',
    secondaryColor = 'secondary-color',
}

const DEFAULT_WHITE = 'ffffffff';
const DEFAULT_TRANSPARENT = 'ffffff00';
const DEFAULT_GRAY_0 = 'bbbbbbff';
const DEFAULT_GRAY_1 = '888888ff';
const COLORS: Color[] = [
    { hex: 'ffffff' },
    { hex: 'bbbbbb' },
    { hex: '888888' },
    { hex: '000000' },
    { hex: 'a970eb' },
    { hex: 'eb70e9' },
    { hex: 'eb70a7' },
    { hex: 'eb7070' },
    { hex: 'fec771' },
    { hex: 'e6e56c' },
    { hex: '64e291' },
    { hex: '07e4f0' },
    { hex: '077bf0' },
    { hex: '5057de' },
];

export { DEFAULT_TRANSPARENT, DEFAULT_GRAY_0, DEFAULT_GRAY_1, DEFAULT_WHITE, ColorType };
const DEFAULT_COLOR = 'ffffff';
const MAX_RGB_NUMBER = 255;
const MIN_RGB_NUMBER = 0;
const MAX_NUMBER_OF_LAST_COLORS = 10;

export { COLORS, DEFAULT_COLOR, ColorType, MAX_RGB_NUMBER, MIN_RGB_NUMBER, MAX_NUMBER_OF_LAST_COLORS };
