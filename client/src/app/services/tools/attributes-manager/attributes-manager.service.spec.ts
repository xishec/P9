import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { TRACE_TYPE } from 'src/constants/tool-constants';
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

    it('should changeThickness', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeThickness(3);
        expect(service[`thickness`].value).toEqual(3);
    });

    it('should changeTraceType', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeTraceType(TRACE_TYPE.Full);
        expect(service[`traceType`].value).toEqual(TRACE_TYPE.Full);
    });

    it('should changeStyle', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeStyle(2);
        expect(service[`style`].value).toEqual(2);
    });

    it('should changeNbVertices', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeNbVertices(3);
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
