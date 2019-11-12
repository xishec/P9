import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
    BRUSH_STYLE,
    EraserSize,
    FONT_ALIGN,
    FontSize,
    LineJointType,
    LineStrokeType,
    STAMP_TYPES,
    StampAngleOrientation,
    StampScaling,
    Thickness,
    TraceType,
} from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    thickness: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    minThickness: BehaviorSubject<number> = new BehaviorSubject(Thickness.Min);
    traceType: BehaviorSubject<string> = new BehaviorSubject(TraceType.Outline);
    style: BehaviorSubject<BRUSH_STYLE> = new BehaviorSubject(BRUSH_STYLE.type1);
    nbVertices: BehaviorSubject<number> = new BehaviorSubject(3);
    lineStrokeType: BehaviorSubject<LineStrokeType> = new BehaviorSubject(LineStrokeType.Continuous);
    lineJointType: BehaviorSubject<LineJointType> = new BehaviorSubject(LineJointType.Curvy);
    circleJointDiameter: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    scaling: BehaviorSubject<number> = new BehaviorSubject(StampScaling.Default);
    angle: BehaviorSubject<number> = new BehaviorSubject(StampAngleOrientation.Default);
    stampType: BehaviorSubject<string> = new BehaviorSubject(STAMP_TYPES[0]);
    eraserSize: BehaviorSubject<number> = new BehaviorSubject(EraserSize.Default);
    boldState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    italicState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    font: BehaviorSubject<string> = new BehaviorSubject('Times New Roman, serif');
    fontSize: BehaviorSubject<number> = new BehaviorSubject(FontSize.Default);
    fontAlign: BehaviorSubject<FONT_ALIGN> = new BehaviorSubject(FONT_ALIGN.Start);
    isWritingState: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
