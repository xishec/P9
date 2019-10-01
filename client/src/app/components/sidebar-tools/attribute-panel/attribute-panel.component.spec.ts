import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AttributePanelComponent } from './attribute-panel.component';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
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
                    provide: MatDialog,
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
        inject([ToolSelectorService], (toolSelectorService: ToolSelectorService) => {
            component[`toolSelectorService`] = toolSelectorService;
        });
        inject([ColorToolService], (colorToolService: ColorToolService) => {
            component[`colorToolService`] = colorToolService;
        });
        expect(component).toBeTruthy();
    });

    it('should onInit', async(
        inject([ToolSelectorService], (toolSelectorService: ToolSelectorService) => {
            const toolName = ToolName.Brush;
            component.ngOnInit();
            fixture
                .whenStable()
                .then(() => {
                    expect(component.currentToolName).toBeDefined();
                    toolSelectorService.changeCurrentToolName(toolName);
                    return fixture.whenStable();
                })
                .then(() => {
                    expect(component.currentToolName).toEqual(ToolName.Brush);
                });
        }),
    ));
});
