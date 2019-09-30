import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { WorkZoneComponent } from './work-zone.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

fdescribe('WorkZoneComponent', () => {
    let component: WorkZoneComponent;
    let fixture: ComponentFixture<WorkZoneComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WorkZoneComponent],
            providers: [
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo: new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE)),
                        currentDisplayNewDrawingModalWindow: new BehaviorSubject<boolean>(false).asObservable(),
                    },
                },
                {
                    provide: Renderer2,
                },
                {
                    provide: DrawStackService,
                },
                {
                    provide: ToolSelectorService,
                    useValue: {
                        currentToolName: new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE)),
                        initTools: () => null,
                    },
                },
                {
                    provide: ColorToolService,
                    useValue: {
                        backgroundColor: new BehaviorSubject<string>(DEFAULT_WHITE),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkZoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
