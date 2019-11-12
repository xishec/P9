import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { TraceType } from 'src/constants/tool-constants';
import { AttributesManagerService } from './attributes-manager.service';

describe('AttributesManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        expect(service).toBeTruthy();
    });

    it('should set thickness', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service[`thickness`] = new BehaviorSubject<number>(3);
        expect(service[`thickness`].value).toEqual(3);
    });

    it('should thickness.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.thickness.next(3);
        expect(service[`thickness`].value).toEqual(3);
    });

    it('should traceType.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.traceType.next(TraceType.Full);
        expect(service[`traceType`].value).toEqual(TraceType.Full);
    });

    it('should changeStyle', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeStyle(2);
        expect(service[`style`].value).toEqual(2);
    });

    it('should nbVertices.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.nbVertices.next(3);
        expect(service[`nbVertices`].value).toEqual(3);
    });

    it('should changeScaling', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeScaling(3);
        expect(service[`scaling`].value).toEqual(3);
    });

    it('should changeAngle', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeAngle(3);
        expect(service[`angle`].value).toEqual(3);
    });

    it('should changeStampType', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeStampType('1');
        expect(service[`stampType`].value).toEqual('1');
    });
});
