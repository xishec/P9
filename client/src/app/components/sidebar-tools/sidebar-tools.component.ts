import { AfterViewInit, Component, OnInit } from '@angular/core';

import {
    FILES_BUTTON_INFO,
    ToolName,
    TOOLS_BUTTON_INFO,
    TRACING_BUTTON_INFO,
    SHAPE_BUTTON_INFO,
} from 'src/constants/tool-constants';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent implements OnInit, AfterViewInit {
    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly TRACING_BUTTON_INFO = TRACING_BUTTON_INFO;
    readonly SHAPE_BUTTON_INFO = SHAPE_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    currentToolName: ToolName;
    currentTracingTool: ToolName;
    showTracingTools = false;
    currentShapeTool: ToolName;
    showShapeTools = false;

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((currentToolName) => {
            this.currentToolName = currentToolName;
        });
        this.currentTracingTool = ToolName.Pencil;
        this.currentShapeTool = ToolName.Rectangle;
    }

    ngAfterViewInit(): void {
        this.toolSelectorService.changeTool(ToolName.Selection);
    }

    onChangeTool(i: number): void {
        this.showTracingTools = false;
        let tooltipName: ToolName;
        if (i === 1) {
            tooltipName = this.currentTracingTool;
        } else if (i === 2) {
            tooltipName = this.currentShapeTool;
        } else {
            tooltipName = this.TOOLS_BUTTON_INFO[i].tooltipName as ToolName;
        }
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeFileTool(tooltipName: ToolName): void {
        this.showTracingTools = false;
        this.showShapeTools = false;
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeTracingTool(tooltipName: ToolName): void {
        this.showTracingTools = false;
        this.currentTracingTool = tooltipName;
        this.currentToolName = ToolName.TracingTool;
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeShapeTool(tooltipName: ToolName): void {
        this.showShapeTools = false;
        this.currentShapeTool = tooltipName;
        this.currentToolName = ToolName.ShapeTool;
        this.toolSelectorService.changeTool(tooltipName);
    }

    onRightClick(i: number): void {
        if (i === 1) {
            this.showTracingTools = true;
            this.showShapeTools = false;
        } else if (i === 2) {
            this.showShapeTools = true;
            this.showTracingTools = false;
        }
    }

    onClickAttributePanel(): void {
        this.showShapeTools = false;
        this.showTracingTools = false;
    }

    getChecked(i: number): boolean {
        let tooltipName: ToolName = this.TOOLS_BUTTON_INFO[i].tooltipName as ToolName;
        if (i === 1) {
            return this.currentToolName === this.currentTracingTool;
        } else if (i === 2) {
            return this.currentToolName === this.currentShapeTool;
        } else {
            return this.currentToolName === tooltipName;
        }
    }

    getTracingToolClass(): string {
        switch (this.currentTracingTool) {
            case ToolName.Pencil:
                return 'fas fa-pencil-alt';

            case ToolName.Brush:
                return 'fas fa-paint-brush';

            case ToolName.Pen:
                return 'fas fa-pen-nib';

            case ToolName.Quill:
                return 'fas fa-pen-alt';

            case ToolName.SprayCan:
                return 'fas fa-spray-can';

            default:
                return 'fas fa-pencil-alt';
        }
    }

    getShapeToolClass(): string {
        switch (this.currentShapeTool) {
            case ToolName.Rectangle:
                return 'far fa-square';

            case ToolName.Ellipsis:
                return 'far fa-circle';

            case ToolName.Polygon:
                return 'fas fa-draw-polygon';

            default:
                return 'far fa-square';
        }
    }
}
