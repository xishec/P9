import { ToolName } from 'src/constants/tool-constants';

export class StackTargetInfo {
    targetPosition: number;
    toolName: ToolName;

    constructor(targetPosition?: number, toolName?: ToolName) {
        if (targetPosition) this.targetPosition = targetPosition;
        if (toolName) this.toolName = toolName;
    }
}
