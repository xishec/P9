import { AfterViewInit, Component, OnInit } from '@angular/core';

import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { SidebarButtonInfo } from 'src/classes/SidebarButtonInfo';
import {
    FILES_BUTTON_INFO,
    SHAPE_BUTTON_INFO,
    SHAPE_TOOL_POSITION,
    TOOL_NAME,
    TOOLS_BUTTON_INFO,
    TRACING_BUTTON_INFO,
    TRACING_TOOL_POSITION,
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
    readonly TRACING_TOOL_POSITION = TRACING_TOOL_POSITION;
    readonly SHAPE_TOOL_POSITION = SHAPE_TOOL_POSITION;

    currentToolName: TOOL_NAME;
    currentTracingTool: TOOL_NAME;
    showTracingTools = false;
    currentShapeTool: TOOL_NAME;
    showShapeTools = false;

    constructor(private toolSelectorService: ToolSelectorService, private undoRedoerService: UndoRedoerService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((currentToolName) => {
            this.currentToolName = currentToolName;
            this.verifyToolChange();
        });
        this.currentTracingTool = TOOL_NAME.Pencil;
        this.currentShapeTool = TOOL_NAME.Rectangle;
    }

    ngAfterViewInit(): void {
        this.toolSelectorService.changeTool(TOOL_NAME.Selection);
    }

    verifyToolChange(): void {
        this.showTracingTools = false;
        this.showShapeTools = false;

        if (
            this.TRACING_BUTTON_INFO.filter((el) => {
                return el.tooltipName === this.currentToolName;
            }).length
        ) {
            this.currentTracingTool = this.currentToolName;
        }
        if (
            this.SHAPE_BUTTON_INFO.filter((el) => {
                return el.tooltipName === this.currentToolName;
            }).length
        ) {
            this.currentShapeTool = this.currentToolName;
        }
    }

    onChangeTool(i: number): void {
        this.showTracingTools = false;
        let tooltipName: TOOL_NAME;
        if (i === TRACING_TOOL_POSITION) {
            tooltipName = this.currentTracingTool;
        } else if (i === SHAPE_TOOL_POSITION) {
            tooltipName = this.currentShapeTool;
        } else {
            tooltipName = this.TOOLS_BUTTON_INFO[i].tooltipName as TOOL_NAME;
        }
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeFileTool(tooltipName: TOOL_NAME): void {
        this.showTracingTools = false;
        this.showShapeTools = false;
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeTracingTool(tooltipName: TOOL_NAME): void {
        this.showTracingTools = false;
        this.currentTracingTool = tooltipName;
        this.currentToolName = TOOL_NAME.TracingTool;
        this.toolSelectorService.changeTool(tooltipName);
    }
    onChangeShapeTool(tooltipName: TOOL_NAME): void {
        this.showShapeTools = false;
        this.currentShapeTool = tooltipName;
        this.currentToolName = TOOL_NAME.ShapeTool;
        this.toolSelectorService.changeTool(tooltipName);
    }

    onRightClick(i: number): void {
        if (i === TRACING_TOOL_POSITION) {
            this.showTracingTools = true;
            this.showShapeTools = false;
        } else if (i === SHAPE_TOOL_POSITION) {
            this.showShapeTools = true;
            this.showTracingTools = false;
        }
    }

    onClickAttributePanel(): void {
        this.showShapeTools = false;
        this.showTracingTools = false;
    }

    getChecked(i: number): boolean {
        const tooltipName: TOOL_NAME = this.TOOLS_BUTTON_INFO[i].tooltipName as TOOL_NAME;
        if (i === TRACING_TOOL_POSITION) {
            return this.currentToolName === this.currentTracingTool;
        } else if (i === SHAPE_TOOL_POSITION) {
            return this.currentToolName === this.currentShapeTool;
        } else {
            return this.currentToolName === tooltipName;
        }
    }

    getTracingToolClass(): string {
        let iconClass = TRACING_BUTTON_INFO[0].iconName;
        TRACING_BUTTON_INFO.forEach((el: SidebarButtonInfo) => {
            if (el.tooltipName === this.currentTracingTool) {
                iconClass = el.iconName;
            }
        });
        return iconClass;
    }

    getShapeToolClass(): string {
        let iconClass = SHAPE_BUTTON_INFO[0].iconName;
        SHAPE_BUTTON_INFO.forEach((el: SidebarButtonInfo) => {
            if (el.tooltipName === this.currentShapeTool) {
                iconClass = el.iconName;
            }
        });
        return iconClass;
    }

    checkIfCantUndoRedo(toolName: TOOL_NAME): boolean {
        if (toolName === TOOL_NAME.Undo) {
            return this.undoRedoerService.undos.length <= 1;
        } else if (toolName === TOOL_NAME.Redo) {
            return this.undoRedoerService.redos.length === 0;
        }
        return false;
    }
}
