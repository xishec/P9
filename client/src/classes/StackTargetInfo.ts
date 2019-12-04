export class StackTargetInfo {
    targetPosition: number;
    toolName: string;

    constructor(targetPosition?: number | undefined, toolName?: string | undefined) {
        if (targetPosition !== undefined) {
            this.targetPosition = targetPosition;
        }
        if (toolName !== undefined) {
            this.toolName = toolName;
        }
    }

    isValid(): boolean {
        return this.targetPosition !== undefined;
    }
}
