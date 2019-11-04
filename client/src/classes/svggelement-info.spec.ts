import { TestBed } from '@angular/core/testing';

import { SVGGElementInfo } from './svggelement-info';

describe('SVGGElementInfo', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created with valid parameters', () => {
        const stackTargetInfo = new SVGGElementInfo('ffffff', '1');
        expect(stackTargetInfo.borderColor).toEqual('ffffff');
        expect(stackTargetInfo.borderWidth).toEqual('1');
    });

    it('should be created with one parameter (first one)', () => {
        const stackTargetInfo = new SVGGElementInfo('ffffff');
        expect(stackTargetInfo.borderColor).toEqual('ffffff');
    });

    it('should be created with one parameter (second one)', () => {
        const stackTargetInfo = new SVGGElementInfo(undefined, '1');
        expect(stackTargetInfo.borderWidth).toEqual('1');
    });
});
