import { SidebarButtonInfo } from '../classes/SidebarButtonInfo';

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
    Stamp = 'Étampe',
    Other = 'Autre',
    NewDrawing = 'Nouveau dessin',
    Save = 'Sauvegarder',
    ArtGallery = 'Gallerie de dessin',
    Export = 'Exporter',
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

const PolygonFormType: Map<number, string> = new Map([
    [3, 'Triangle'],
    [4, 'Qudrilatère'],
    [5, 'Pentagone'],
    [6, 'Hexagone'],
    [7, 'Heptagone'],
    [8, 'Octogone'],
    [9, 'Nonagone'],
    [10, 'Décagone'],
    [11, 'Hendécagone'],
    [12, 'Dodécagone'],
]);

enum PolygonSides {
    Min = 3,
    Default = 3,
    Max = 12,
}

const TOOLS_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-mouse-pointer', tooltipName: ToolName.Selection, shortcut: '(S)' },
    { iconName: 'fas fa-pencil-alt', tooltipName: ToolName.Pencil, shortcut: '(C)' },
    { iconName: 'fas fa-paint-brush', tooltipName: ToolName.Brush, shortcut: '(W)' },
    { iconName: 'fas fa-pen-nib', tooltipName: ToolName.Quill, shortcut: '(P)' },
    { iconName: 'fas fa-pen-alt', tooltipName: ToolName.Pen, shortcut: '(Y)' },
    { iconName: 'fas fa-spray-can', tooltipName: ToolName.SprayCan, shortcut: '(A)' },
    { iconName: 'far fa-square', tooltipName: ToolName.Rectangle, shortcut: '(1)' },
    { iconName: 'far fa-circle', tooltipName: ToolName.Ellipsis, shortcut: '(2)' },
    { iconName: 'fas fa-draw-polygon', tooltipName: ToolName.Polygon, shortcut: '(3)' },
    { iconName: 'fas fa-slash', tooltipName: ToolName.Line, shortcut: '(L)' },
    { iconName: 'fas fa-font', tooltipName: ToolName.Text, shortcut: '(T)' },
    { iconName: 'fas fa-fill', tooltipName: ToolName.ColorApplicator, shortcut: '(R)' },
    { iconName: 'fas fa-fill-drip', tooltipName: ToolName.Fill, shortcut: '(B)' },
    { iconName: 'fas fa-eraser', tooltipName: ToolName.Eraser, shortcut: '(E)' },
    { iconName: 'fas fa-eye-dropper', tooltipName: ToolName.Dropper, shortcut: '(I)' },
    { iconName: 'fas fa-stamp', tooltipName: ToolName.Stamp, shortcut: '' },
    { iconName: 'fas fa-ellipsis-v', tooltipName: ToolName.Other, shortcut: '' },
];

const FILES_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-plus', tooltipName: ToolName.NewDrawing, shortcut: '(Ctrl-O)' },
    { iconName: 'far fa-save', tooltipName: ToolName.Save, shortcut: '(Ctrl-S)' },
    { iconName: 'fas fa-folder-open', tooltipName: ToolName.ArtGallery, shortcut: '(Ctrl-G)' },
    { iconName: 'fas fa-file-export', tooltipName: ToolName.Export, shortcut: '(Ctrl-E)' },
];

const BRUSH_STYLES = [1, 2, 3, 4, 5];

const MaxPolygonCalculationAngles: Map<number, number> = new Map([
    [3, 0.15],
    [4, 0.38],
    [5, 0.05],
    [6, 0.025],
    [7, 0.035],
    [8, 0.08],
    [9, 0.025],
    [10, 0.015],
    [11, 0.02],
    [12, 0.04],
]);

const PolygonOffsetAngles: Map<number, number> = new Map([
    [3, 3 * (360 / 3 / 4) * (Math.PI / 180)],
    [4, Math.PI / 4],
    [5, (360 / 5 / 4) * (Math.PI / 180)],
    [6, 0],
    [7, 3 * (360 / 7 / 4) * (Math.PI / 180)],
    [8, (360 / 8 / 2) * (Math.PI / 180)],
    [9, (360 / 9 / 4) * (Math.PI / 180)],
    [10, 0],
    [11, 3 * (360 / 11 / 4) * (Math.PI / 180)],
    [12, (360 / 12 / 2) * (Math.PI / 180)],
]);

export {
    TOOLS_BUTTON_INFO,
    FILES_BUTTON_INFO,
    BRUSH_STYLES,
    Thickness,
    TraceType,
    ToolName,
    PolygonFormType,
    PolygonSides,
    MaxPolygonCalculationAngles,
    PolygonOffsetAngles,
};
