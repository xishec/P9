import { Color } from '../../classes/Color';
import { SidebarButtonInfo } from '../../classes/SidebarButtonInfo';

const SIDEBAR_WIDTH = 360;
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
const COLOR_SELECTION_SHIFT = 17;

const BRUSH_STYLES = [1, 2, 3, 4, 5];

const TOOLS_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-mouse-pointer', tooltipName: 'Sélection' },
    { iconName: 'fas fa-pencil-alt', tooltipName: 'Crayon' },
    { iconName: 'fas fa-paint-brush', tooltipName: 'Pinceau' },
    { iconName: 'fas fa-pen-nib', tooltipName: 'Plume' },
    { iconName: 'fas fa-pen-alt', tooltipName: 'Stylo' },
    { iconName: 'fas fa-spray-can', tooltipName: 'Aérosol' },
    { iconName: 'fas fa-slash', tooltipName: 'Ligne' },
    { iconName: 'far fa-square', tooltipName: 'Carré' },
    { iconName: 'fas fa-draw-polygon', tooltipName: 'Polygone' },
    { iconName: 'far fa-circle', tooltipName: 'Ellipse' },
    { iconName: 'fas fa-fill-drip', tooltipName: 'Applicateur de couleur' },
    { iconName: 'fas fa-eye-dropper', tooltipName: 'Sélecteur de couleur' },
    { iconName: 'fas fa-eraser', tooltipName: 'Efface' },
    { iconName: 'fas fa-font', tooltipName: 'Zone de texte' },
];

const FILES_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-plus', tooltipName: 'Nouveau dessin' },
    { iconName: 'far fa-save', tooltipName: 'Sauvegarder' },
    { iconName: 'fas fa-folder-open', tooltipName: 'Gallerie de dessin' },
    { iconName: 'fas fa-file-export', tooltipName: 'Exporter' },
];

const SVG_NS = 'http://www.w3.org/2000/svg';

enum Keys {
    Shift = 'Shift',
}

enum Mouse {
    LeftButton = 0,
    MouseWheel = 1,
    RightButton = 2,
}

const MIN_THICKNESS = 1;
const DEFAULT_THICKNESS = 5;
const MAX_THICKNESS = 100;

export {
    COLOR_SELECTION_SHIFT,
    SIDEBAR_WIDTH,
    COLORS,
    DEFAULT_COLOR,
    TOOLS_BUTTON_INFO,
    FILES_BUTTON_INFO,
    SVG_NS,
    Keys,
    Mouse,
    MIN_THICKNESS,
    DEFAULT_THICKNESS,
    MAX_THICKNESS,
    BRUSH_STYLES,
};
