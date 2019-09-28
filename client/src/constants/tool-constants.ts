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

const BRUSH_STYLES = [1, 2, 3, 4, 5];

export { TOOLS_BUTTON_INFO, FILES_BUTTON_INFO, BRUSH_STYLES, Thickness, TraceType, ToolName };
