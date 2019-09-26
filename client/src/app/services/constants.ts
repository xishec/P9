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

enum ToolName {
    Selection = 'Sélection',
    Pencil = 'Crayon',
    Brush = 'Pinceau',
    Quill = 'Plume',
    Pen = 'Stylo',
    SprayCan = 'Aérosol',
    Line = 'Ligne',
    Rectangle = 'Rectangle',
    Polygon = 'Polygone',
    Ellipsis = 'Ellipse',
    ColorApplicator = 'Applicateur de couleur',
    Fill = 'Sceau de peinture',
    Dropper = 'Sélecteur de couleur',
    Eraser = 'Efface',
    Text = 'Zone de texte',
    NewDrawing = 'Nouveau dessin',
    Save = 'Sauvegarder',
    ArtGallery = 'Gallerie de dessin',
    Export = 'Exporter',
}

const BRUSH_STYLES = [1, 2, 3, 4, 5];

const TOOLS_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-mouse-pointer', tooltipName: ToolName.Selection },
    { iconName: 'fas fa-pencil-alt', tooltipName: ToolName.Pencil },
    { iconName: 'fas fa-paint-brush', tooltipName: ToolName.Brush },
    { iconName: 'fas fa-pen-nib', tooltipName: ToolName.Quill },
    { iconName: 'fas fa-pen-alt', tooltipName: ToolName.Pen },
    { iconName: 'fas fa-spray-can', tooltipName: ToolName.SprayCan },
    { iconName: 'fas fa-slash', tooltipName: ToolName.Line },
    { iconName: 'far fa-square', tooltipName: ToolName.Rectangle },
    { iconName: 'fas fa-draw-polygon', tooltipName: ToolName.Polygon },
    { iconName: 'far fa-circle', tooltipName: ToolName.Ellipsis },
    { iconName: 'fas fa-fill', tooltipName: ToolName.ColorApplicator },
    { iconName: 'fas fa-fill-drip', tooltipName: ToolName.Fill },
    { iconName: 'fas fa-eye-dropper', tooltipName: ToolName.Dropper },
    { iconName: 'fas fa-eraser', tooltipName: ToolName.Eraser },
    { iconName: 'fas fa-font', tooltipName: ToolName.Text },
];

const FILES_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-plus', tooltipName: ToolName.NewDrawing },
    { iconName: 'far fa-save', tooltipName: ToolName.Save },
    { iconName: 'fas fa-folder-open', tooltipName: ToolName.ArtGallery },
    { iconName: 'fas fa-file-export', tooltipName: ToolName.Export },
];

const SVG_NS = 'http://www.w3.org/2000/svg';

enum Keys {
    Shift = 'Shift',
}

enum ColorType {
    backgroundColor = 'background-color',
    primaryColor = 'primary-color',
    secondaryColor = 'secondary-color',
}

enum Mouse {
    LeftButton = 0,
    MouseWheel = 1,
    RightButton = 2,
}

enum Thickness {
    Min = 1,
    Default = 5,
    Max = 100,
}

enum TraceType {
    Outline = 'Contour',
    Full = 'Plein',
    Both = 'Plein avec contour',
}

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
    ColorType,
    Thickness,
    TraceType,
    ToolName,
    BRUSH_STYLES,
};
