enum COLOR_TYPE {
    BackgroundColor = 'background-color',
    PrimaryColor = 'primary-color',
    SecondaryColor = 'secondary-color',
}

const DEFAULT_WHITE = 'ffffffff';
const DEFAULT_TRANSPARENT = 'ffffff00';
const DEFAULT_GRAY_0 = 'bbbbbbff';
const DEFAULT_GRAY_1 = '888888ff';
const DEFAULT_RED = 'ff0000ff';

const MAX_RGB_NUMBER = 255;
const MIN_RGB_NUMBER = 0;
const MAX_NUMBER_OF_LAST_COLORS = 10;

const RGBA_ARRAY_LENGTH = 4;

export {
    RGBA_ARRAY_LENGTH,
    DEFAULT_TRANSPARENT,
    DEFAULT_GRAY_0,
    DEFAULT_GRAY_1,
    DEFAULT_WHITE,
    COLOR_TYPE,
    MAX_RGB_NUMBER,
    MIN_RGB_NUMBER,
    MAX_NUMBER_OF_LAST_COLORS,
    DEFAULT_RED,
};
