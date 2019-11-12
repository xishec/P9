import { TestBed } from '@angular/core/testing';

import { ToolName } from 'src/constants/tool-constants';
import { StackTargetInfo } from './StackTargetInfo';

describe('AttributesManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created with valid parameters', () => {
        const stackTargetInfo = new StackTargetInfo(11, ToolName.Ellipsis);
        expect(stackTargetInfo.targetPosition).toEqual(11);
        expect(stackTargetInfo.toolName).toEqual(ToolName.Ellipsis);
    });

    it('should be created with one parameter (first one)', () => {
        const stackTargetInfo = new StackTargetInfo(11);
        expect(stackTargetInfo.targetPosition).toEqual(11);
    });

    it('should be created with one parameter (second one)', () => {
        const stackTargetInfo = new StackTargetInfo(undefined, ToolName.Ellipsis);
        expect(stackTargetInfo.toolName).toEqual(ToolName.Ellipsis);
    });
});
