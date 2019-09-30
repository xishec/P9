import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ToolName } from '../../../constants/tool-constants';
import { SidebarToolsComponent } from './sidebar-tools.component';

describe('SidebarToolsComponent', () => {
    let component: SidebarToolsComponent;
    let fixture: ComponentFixture<SidebarToolsComponent>;
    let toolSelectorService: ToolSelectorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarToolsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ToolSelectorService,
                    useValue: { changeTool: () => null },
                },
            ],
        });
        fixture = TestBed.createComponent(SidebarToolsComponent);
        component = fixture.componentInstance;

        toolSelectorService = fixture.debugElement.injector.get(ToolSelectorService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onChangeTool should call function changeTool when a tool is selected', () => {
        const spy = spyOn(toolSelectorService, 'changeTool');
        component.onChangeTool(ToolName.Brush);
        expect(spy).toHaveBeenCalled();
    });
});
