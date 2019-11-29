import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
    BRUSH_STYLE,
    ERASER_SIZE,
    FONT_ALIGN,
    FONT_SIZE,
    LINE_JOINT_TYPE,
    LINE_STROKE_TYPE,
    ROTATION_ANGLE,
    SPRAY_DIAMETER,
    SPRAY_INTERVAL,
    STAMP_SCALING,
    STAMP_TYPES,
    THICKNESS,
    TRACE_TYPE,
} from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    thickness: BehaviorSubject<number> = new BehaviorSubject(THICKNESS.Default);
    minThickness: BehaviorSubject<number> = new BehaviorSubject(1);
    traceType: BehaviorSubject<string> = new BehaviorSubject(TRACE_TYPE.Outline);
    style: BehaviorSubject<BRUSH_STYLE> = new BehaviorSubject(BRUSH_STYLE.type1);
    nbVertices: BehaviorSubject<number> = new BehaviorSubject(3);
    lineStrokeType: BehaviorSubject<LINE_STROKE_TYPE> = new BehaviorSubject(LINE_STROKE_TYPE.Continuous);
    lineJointType: BehaviorSubject<LINE_JOINT_TYPE> = new BehaviorSubject(LINE_JOINT_TYPE.Curvy);
    circleJointDiameter: BehaviorSubject<number> = new BehaviorSubject(THICKNESS.Default);
    scaling: BehaviorSubject<number> = new BehaviorSubject(STAMP_SCALING.Default);
    angle: BehaviorSubject<number> = new BehaviorSubject(ROTATION_ANGLE.Default);
    stampType: BehaviorSubject<string> = new BehaviorSubject(STAMP_TYPES[0]);
    eraserSize: BehaviorSubject<number> = new BehaviorSubject(ERASER_SIZE.Default);
    sprayDiameter: BehaviorSubject<number> = new BehaviorSubject(SPRAY_DIAMETER.Default);
    sprayInterval: BehaviorSubject<number> = new BehaviorSubject(SPRAY_INTERVAL.Default);

    boldState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    italicState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    font: BehaviorSubject<string> = new BehaviorSubject('Times New Roman, serif');
    fontSize: BehaviorSubject<number> = new BehaviorSubject(FONT_SIZE.Default);
    fontAlign: BehaviorSubject<FONT_ALIGN> = new BehaviorSubject(FONT_ALIGN.Start);
    isWritingState: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
