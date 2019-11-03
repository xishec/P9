import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { SidebarToolsComponent } from './sidebar-tools.component';
import { SHAPE_TOOL_POSITION } from 'src/constants/tool-constants';

describe('SidebarToolsComponent', () => {
    let component: SidebarToolsComponent;
    let fixture: ComponentFixture<SidebarToolsComponent>;
    let toolSelectorService: ToolSelectorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarToolsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [],
        }).overrideComponent(SidebarToolsComponent, {
            set: {
                providers: [
                    {
                        provide: ToolSelectorService,
                        useValue: {
                            changeTool: () => null,
                            currentToolName: {
                                subscribe: () => null,
                            },
                        },
                    },
                ],
            },
        });
        fixture = TestBed.createComponent(SidebarToolsComponent);
        component = fixture.componentInstance;

        toolSelectorService = fixture.debugElement.injector.get(ToolSelectorService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onChangeTool should call function changeTool when a tool is selected', () => {
        const SPY = spyOn(toolSelectorService, 'changeTool');

        component.onChangeTool(SHAPE_TOOL_POSITION);

        expect(SPY).toHaveBeenCalled();
    });

    it('ngAfterViewInit should call function changeTool', () => {
        const SPY = spyOn(toolSelectorService, 'changeTool');
        component.ngAfterViewInit();
        expect(SPY).toHaveBeenCalled();
    });
});
