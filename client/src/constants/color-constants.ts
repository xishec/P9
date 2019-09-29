import { Color } from '../classes/Color';

enum ColorType {
    backgroundColor = 'background-color',
    primaryColor = 'primary-color',
    secondaryColor = 'secondary-color',
}

const COLORS: Color[] = [
    { hex: 'ffffffff' },
    { hex: 'bbbbbbff' },
    { hex: '888888ff' },
    { hex: '000000ff' },
    { hex: 'a970ebff' },
    { hex: 'eb70e9ff' },
    { hex: 'eb70a7ff' },
    { hex: 'eb7070ff' },
    { hex: 'fec771ff' },
    { hex: 'e6e56cff' },
    { hex: '64e291ff' },
    { hex: '07e4f0ff' },
    { hex: '077bf0ff' },
    { hex: '5057deff' },
];

const DEFAULT_COLOR = 'ffffffff';

export { COLORS, DEFAULT_COLOR, ColorType };
