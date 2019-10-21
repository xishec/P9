import { SidebarButtonInfo } from '../classes/SidebarButtonInfo';

const NO_STAMP = '';

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
    Grid = 'Grille',
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
    [4, 'Quadrilatère'],
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

enum GridSize {
    Min = 5,
    Default = 10,
    Max = 200,
}

enum GridOpacity {
    Min = 0.2,
    Max = 1,
}

const GRID_SIZE_INCREMENT = 5;
const GRID_SIZE_DECREMENT = 5;

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
    { iconName: 'fas fa-border-all', tooltipName: ToolName.Grid, shortcut: '' },
];

const FILES_BUTTON_INFO: SidebarButtonInfo[] = [
    { iconName: 'fas fa-plus', tooltipName: ToolName.NewDrawing, shortcut: '(Ctrl-O)' },
    { iconName: 'far fa-save', tooltipName: ToolName.Save, shortcut: '(Ctrl-S)' },
    { iconName: 'fas fa-folder-open', tooltipName: ToolName.ArtGallery, shortcut: '(Ctrl-G)' },
    { iconName: 'fas fa-file-export', tooltipName: ToolName.Export, shortcut: '(Ctrl-E)' },
];

const BRUSH_STYLES = [1, 2, 3, 4, 5];

const PolygonRadiusCorrection: Map<number, number> = new Map([
    [3, 0.13],
    [4, 0.33],
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

enum StampScaling {
    Min = 0.1,
    Default = 1.0,
    Max = 10.0,
}

enum StampAngleOrientation {
    Min = -360,
    Default = 0,
    Max = 360,
}

const STAMP_TYPES = [
    '',
    '/assets/stamps/iconmonstr-smiley-14.svg',
    '/assets/stamps/iconmonstr-cat-7.svg',
    '/assets/stamps/iconmonstr-coin-3.svg',
    '/assets/stamps/iconmonstr-home-8.svg',
    '/assets/stamps/iconmonstr-glasses-12.svg',
];

const STAMP_NAMES = ['Aucun', 'Smiley', 'Chat', 'Argent', 'Maison', 'Hipster'];

const STAMPS_MAP: Map<number, string> = new Map([
    [0, NO_STAMP],
    [1, '/assets/stamps/iconmonstr-smiley-14.svg'],
    [2, '/assets/stamps/iconmonstr-cat-7.svg'],
    [3, '/assets/stamps/iconmonstr-coin-3.svg'],
    [4, '/assets/stamps/iconmonstr-home-8.svg'],
    [5, '/assets/stamps/iconmonstr-glasses-12.svg'],
]);

const BASE64_STAMPS_MAP: Map<string, string> = new Map();
BASE64_STAMPS_MAP.set('/assets/stamps/iconmonstr-smiley-14.svg', "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmM1LjUxNCAwIDEwIDQuNDg2IDEwIDEwcy00LjQ4NiAxMC0xMCAxMC0xMC00LjQ4Ni0xMC0xMCA0LjQ4Ni0xMCAxMC0xMHptMC0yYy02LjYyNyAwLTEyIDUuMzczLTEyIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyLTUuMzczLTEyLTEyLTEyem0tMy41IDhjLS44MjggMC0xLjUuNjcxLTEuNSAxLjVzLjY3MiAxLjUgMS41IDEuNSAxLjUtLjY3MSAxLjUtMS41LS42NzItMS41LTEuNS0xLjV6bTcgMGMtLjgyOCAwLTEuNS42NzEtMS41IDEuNXMuNjcyIDEuNSAxLjUgMS41IDEuNS0uNjcxIDEuNS0xLjUtLjY3Mi0xLjUtMS41LTEuNXptLTMuNDk5IDRjLTEuNjU4IDAtMy4wMDEgMS41NjctMy4wMDEgMy41MDEgMCAxLjkzMiAxLjM0MyAzLjQ5OSAzLjAwMSAzLjQ5OSAxLjY1NiAwIDIuOTk5LTEuNTY3IDIuOTk5LTMuNDk5IDAtMS45MzQtMS4zNDMtMy41MDEtMi45OTktMy41MDF6Ii8+PC9zdmc+");
BASE64_STAMPS_MAP.set('/assets/stamps/iconmonstr-cat-7.svg', "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMS45NTQgMTFjMy4zMyAwIDcuMDU3IDYuMTIzIDcuNjMyIDguNzE2LjU3NSAyLjU5NC0uOTk2IDQuNzI5LTMuNDg0IDQuMTEyLTEuMDkyLS4yNzEtMy4yNTItMS4zMDctNC4xMDItMS4yOTEtLjkyNS4wMTYtMi4zNzkuODM2LTMuNTg3IDEuMjUyLTIuNjU3LjkxNi00LjcxNy0xLjI4My00LjAxLTQuMDczLjc3NC0zLjA1MSA0LjQ4LTguNzE2IDcuNTUxLTguNzE2em0xMC43OTMtNC4zOWMxLjE4OC41MzkgMS42MjkgMi44Mi44OTQgNS4yNy0uNzA0IDIuMzQxLTIuMzMgMy44MDYtNC41NTYgMi43OTYtMS45MzEtLjg3Ny0yLjE1OC0zLjE3OC0uODk0LTUuMjcgMS4yNzQtMi4xMDcgMy4zNjctMy4zMzYgNC41NTYtMi43OTZ6bS0yMS45NjguNzA2Yy0xLjA0NC43MjktMS4wNiAyLjk5Ni4wODIgNS4yMTUgMS4wOTIgMi4xMiAyLjkxMyAzLjIzNiA0Ljg2OCAxLjg3IDEuNjk2LTEuMTg1IDEuNTA0LTMuNDMzLS4wODItNS4yMTUtMS41OTYtMS43OTMtMy44MjQtMi41OTktNC44NjgtMS44N3ptMTUuNjQzLTcuMjkyYzEuMzIzLjI1MSAyLjMyMSAyLjQyOCAyLjE4MiA1LjA2Mi0uMTM0IDIuNTE3LTEuNDA1IDQuMzgyLTMuODgyIDMuOTEyLTIuMTQ5LS40MDctMi45MzgtMi42NTctMi4xODEtNS4wNjEuNzYxLTIuNDIxIDIuNTU5LTQuMTY0IDMuODgxLTMuOTEzem0tMTAuMjk1LjA1OGMtMS4yNjguNDUxLTEuOTIgMi43NTYtMS4zNzcgNS4zMzcuNTE5IDIuNDY3IDIuMDYyIDQuMTE0IDQuNDM3IDMuMjY5IDIuMDYtLjczMiAyLjQ5NC0zLjA3NyAxLjM3Ny01LjMzNi0xLjEyNS0yLjI3Ni0zLjE2OS0zLjcyMS00LjQzNy0zLjI3eiIvPjwvc3ZnPg==");
BASE64_STAMPS_MAP.set('/assets/stamps/iconmonstr-coin-3.svg', "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmM1LjUxNCAwIDEwIDQuNDg2IDEwIDEwcy00LjQ4NiAxMC0xMCAxMC0xMC00LjQ4Ni0xMC0xMCA0LjQ4Ni0xMCAxMC0xMHptMC0yYy02LjYyNyAwLTEyIDUuMzczLTEyIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyLTUuMzczLTEyLTEyLTEyem0wIDNjLTQuOTcxIDAtOSA0LjAyOS05IDlzNC4wMjkgOSA5IDkgOS00LjAyOSA5LTktNC4wMjktOS05LTl6bTEgMTMuOTQ3djEuMDUzaC0xdi0uOTk4Yy0xLjAzNS0uMDE4LTIuMTA2LS4yNjUtMy0uNzI3bC40NTUtMS42NDRjLjk1Ni4zNzEgMi4yMjkuNzY1IDMuMjI1LjU0IDEuMTQ5LS4yNiAxLjM4NS0xLjQ0Mi4xMTQtMi4wMTEtLjkzMS0uNDM0LTMuNzc4LS44MDUtMy43NzgtMy4yNDMgMC0xLjM2MyAxLjAzOS0yLjU4MyAyLjk4NC0yLjg1di0xLjA2N2gxdjEuMDE4Yy43MjUuMDE5IDEuNTM1LjE0NSAyLjQ0Mi40MmwtLjM2MiAxLjY0OGMtLjc2OC0uMjctMS42MTYtLjUxNS0yLjQ0Mi0uNDY1LTEuNDg5LjA4Ny0xLjYyIDEuMzc2LS41ODEgMS45MTYgMS43MTEuODA0IDMuOTQzIDEuNDAxIDMuOTQzIDMuNTQ2LjAwMiAxLjcxOC0xLjM0NCAyLjYzMi0zIDIuODY0eiIvPjwvc3ZnPg==");
BASE64_STAMPS_MAP.set('/assets/stamps/iconmonstr-home-8.svg', "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjAgNy4wOTNsLTMtM3YtMi4wOTNoM3Y1LjA5M3ptNCA1LjkwN2gtM3YxMGgtMTh2LTEwaC0zbDEyLTEyIDEyIDEyem0tMTAgMmgtNHY2aDR2LTZ6Ii8+PC9zdmc+");
BASE64_STAMPS_MAP.set('/assets/stamps/iconmonstr-glasses-12.svg', "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTcuOTQ0IDVjLTEuMTM4IDAtMi4zNzYuMTI5LTMuMzk0LjQ5MS0yLjI4My44MjgtMi43OTIuODM4LTUuMTAzIDAtMS4wMTUtLjM2Mi0yLjI1Ni0uNDkxLTMuMzkyLS40OTEtMS45NzEgMC00LjE3LjM4Ny02LjA1NS44Nzh2MS43ODljLjg0Ny4yNTUgMS4wNjguNjI3IDEuMjAzIDEuNDkzLjM4MSAyLjQ0MyAxLjI1NSA0Ljg0IDUuMDY4IDQuODQgMy4wMzcgMCA0LjA1MS0yLjI1OSA0LjcyMi00LjM0NS4zNDEtMS4wNiAxLjY2My0xLjA4NyAyLjAwOS0uMDE1LjY3MyAyLjA4OSAxLjY4MiA0LjM2IDQuNzI1IDQuMzYgMy44MTQgMCA0LjY4OS0yLjM5NyA1LjA2OS00Ljg0MS4xMzUtLjg2Ni4zNTYtMS4yMzcgMS4yMDQtMS40OTJ2LTEuNzg5Yy0xLjg4Ny0uNDkxLTQuMDg1LS44NzgtNi4wNTYtLjg3OHptLTcuNjgyIDMuODE0Yy0uNTE4IDIuMTc0LTEuMzYgNC4xODYtMy45OTEgNC4xODYtMy4zMDEgMC0zLjk3NC0xLjkwMy00LjI3NS00Ljk3My0uMDcyLS43NDcuMDkyLTEuMDQuMjIxLTEuMTk1Ljk0Ny0xLjEzNCA1Ljk1Mi0xLjA4OCA3LjYxMS0uMDkyLjQ3NS4yODUuNzgzLjYwMS40MzQgMi4wNzR6bTExLjc0LS43ODdjLS4zMDEgMy4wNy0uOTc1IDQuOTczLTQuMjc1IDQuOTczLTIuNjI5IDAtMy40NzItMi4wMTItMy45ODktNC4xODYtLjM1MS0xLjQ3My0uMDQyLTEuNzg5LjQzNC0yLjA3NCAxLjY2NS0xIDYuNjY3LTEuMDM4IDcuNjExLjA5Mi4xMjkuMTU2LjI5My40NDkuMjE5IDEuMTk1em0tNC44MzgtMS4xMjFjMS41MzktLjIzNCAzLjMxOC0uMDMgMy43OTEuNTM3LjEwNC4xMjQuMjM0LjM1OC4xNzYuOTU2LS4wMzEuMzE2LS4wNjcuNjE2LS4xMTIuOS0uNDEtMS40ODctMS40NTctMi4yODMtMy44NTUtMi4zOTN6bS0xNC4xODQgMi4zOTNjLS4wNDUtLjI4NC0uMDgyLS41ODQtLjExMy0uOS0uMDU4LS41OTguMDczLS44MzIuMTc3LS45NTYuNDc0LS41NjcgMi4yNTMtLjc3MSAzLjc5Mi0uNTM3LTIuMzk4LjExLTMuNDQ1LjkwNi0zLjg1NiAyLjM5M3ptMTYuMDIgNy43NjRjLTEuMTUgMi44NjktNi4wMzEgMi4xNjYtNyAuMzY5LS45NyAxLjc5Ny01Ljg1IDIuNS03LS4zNjkuNTc4LjUwNiAxLjU2NS42NjkgMi4zMTguNTU5IDIuMjItLjMyNSAyLjA0Mi0yLjQyMyAzLjU5NC0yLjQyMy40MjUgMCAuODEuMTc3IDEuMDg4LjQ2NC4yNzgtLjI4Ny42NjItLjQ2NCAxLjA4Ny0uNDY0IDEuNTUyIDAgMS4zNzUgMi4wOTkgMy41OTQgMi40MjMuNzUzLjExIDEuNzQtLjA1MyAyLjMxOS0uNTU5eiIvPjwvc3ZnPg==");

enum LineStrokeType {
    Continuous = 1,
    Dotted_line = 2,
    Dotted_circle = 3,
}

enum LineJointType {
    Curvy = 1,
    Straight = 2,
    Circle = 3,
}

const ToolNameShortcuts : Map<string , string> = new Map([
    ['c', ToolName.Pencil],
    ['w', ToolName.Brush],
    ['p', ToolName.Quill],
    ['y', ToolName.Pen],
    ['a', ToolName.SprayCan],
    ['1', ToolName.Rectangle],
    ['2', ToolName.Ellipsis],
    ['3', ToolName.Polygon],
    ['l', ToolName.Line],
    ['t', ToolName.Text],
    ['r', ToolName.ColorApplicator],
    ['b', ToolName.Fill],
    ['e', ToolName.Eraser],
    ['i', ToolName.Dropper],
    ['s', ToolName.Selection],
])

const ToolNameControlShortcuts : Map<string, string> = new Map([
    ['o', ToolName.NewDrawing],
    ['s', ToolName.Save],
    ['g', ToolName.ArtGallery],
    ['e', ToolName.Export],
])

export {
    ToolNameShortcuts,
    ToolNameControlShortcuts,
    TOOLS_BUTTON_INFO,
    FILES_BUTTON_INFO,
    BRUSH_STYLES,
    Thickness,
    TraceType,
    ToolName,
    PolygonFormType,
    PolygonSides,
    PolygonRadiusCorrection,
    PolygonOffsetAngles,
    StampScaling,
    StampAngleOrientation,
    STAMP_TYPES,
    STAMPS_MAP,
    NO_STAMP,
    BASE64_STAMPS_MAP,
    STAMP_NAMES,
    LineStrokeType,
    LineJointType,
    GridSize,
    GridOpacity,
    GRID_SIZE_INCREMENT,
    GRID_SIZE_DECREMENT,
};
