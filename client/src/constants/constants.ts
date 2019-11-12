import { Predicate } from 'src/classes/Predicate';

enum KEYS {
    Shift = 'Shift',
    Control = 'Control',
    Alt = 'Alt',
    Digit1 = '1',
    Digit2 = '2',
    Digit3 = '3',
    a = 'a',
    b = 'b',
    c = 'c',
    e = 'e',
    g = 'g',
    i = 'i',
    l = 'l',
    o = 'o',
    p = 'p',
    r = 'r',
    s = 's',
    t = 't',
    w = 'w',
    y = 'y',
    Escape = 'Escape',
    Backspace = 'Backspace',
    Enter = 'Enter',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    Space = ' ',
    SmallerThan = '<',
    GreaterThan = '>',
}

enum MOUSE {
    LeftButton = 0,
    MouseWheel = 1,
    RightButton = 2,
}

const SIDEBAR_WIDTH = 360;

const ELEMENTS_BEFORE_LAST_CIRCLE = 1;

const MAX_DRAWING_LENGTH = 5;

const SVG_NS = 'http://www.w3.org/2000/svg';

const PREDICATE: Predicate = new Predicate();

const GIFS = ['/assets/gifs/love.gif', '/assets/gifs/money.gif', '/assets/gifs/rolling.gif'];

const MAX_NB_LABELS = 6;

export {
    MAX_NB_LABELS,
    GIFS,
    MAX_DRAWING_LENGTH,
    SIDEBAR_WIDTH,
    SVG_NS,
    Keys,
    Mouse,
    predicate,
    ELEMENTS_BEFORE_LAST_CIRCLE,
};
