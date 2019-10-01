import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributePanelComponent } from './attribute-panel.component';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToolName } from 'src/constants/tool-constants';

describe('AttributePanelComponent', () => {
    let component: AttributePanelComponent;
    let fixture: ComponentFixture<AttributePanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributePanelComponent],
            providers: [
                AttributePanelComponent,
                {
                    provide: ToolSelectorService,
                    useValue: {
                        currentToolName: new BehaviorSubject<ToolName>(ToolName.ArtGallery),
                    },
                },
                {
                    provide: ColorToolService,
                    useValue: {
                        showColorPalette: new BehaviorSubject<boolean>(false),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributePanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
