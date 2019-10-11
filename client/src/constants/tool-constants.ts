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

enum StampScaling {
    Min = 1,
    Default = 1,
    Max = 10,
}

export { TOOLS_BUTTON_INFO, FILES_BUTTON_INFO, BRUSH_STYLES, Thickness, TraceType, ToolName, StampScaling };
