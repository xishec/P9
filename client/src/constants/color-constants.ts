import { Color } from '../classes/Color';

enum ColorType {
    backgroundColor = 'background-color',
    primaryColor = 'primary-color',
    secondaryColor = 'secondary-color',
}

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

const DEFAULT_COLOR = 'ffffff';
const MAX_RGB_NUMBER = 255;
const MIN_RGB_NUMBER = 0;
const MAX_NUMBER_OF_LAST_COLORS = 10;

export { COLORS, DEFAULT_COLOR, ColorType, MAX_RGB_NUMBER, MIN_RGB_NUMBER, MAX_NUMBER_OF_LAST_COLORS };
