import { TestBed } from '@angular/core/testing';

import { StackTargetInfo } from './StackTargetInfo';
import { ToolName } from 'src/constants/tool-constants';

describe('AttributesManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created with valid parameters', () => {
        let stackTargetInfo = new StackTargetInfo(11, ToolName.Ellipsis);
        expect(stackTargetInfo.targetPosition).toEqual(11);
        expect(stackTargetInfo.toolName).toEqual(ToolName.Ellipsis);
    });

    it('should be created with one parameter (first one)', () => {
        let stackTargetInfo = new StackTargetInfo(11);
        expect(stackTargetInfo.targetPosition).toEqual(11);
    });

    it('should be created with one parameter (second one)', () => {
        let stackTargetInfo = new StackTargetInfo(undefined, ToolName.Ellipsis);
        expect(stackTargetInfo.toolName).toEqual(ToolName.Ellipsis);
    });
});
