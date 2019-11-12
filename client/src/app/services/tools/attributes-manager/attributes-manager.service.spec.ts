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

    it('should thickness.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.thickness.next(3);
        expect(service[`thickness`].value).toEqual(3);
    });

    it('should traceType.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeTraceType(TRACE_TYPE.Full);
        expect(service[`traceType`].value).toEqual(TRACE_TYPE.Full);
    });

    it('should style.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.style.next(2);
        expect(service[`style`].value).toEqual(2);
    });

    it('should nbVertices.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.nbVertices.next(3);
        expect(service[`nbVertices`].value).toEqual(3);
    });

    it('should scaling.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.scaling.next(3);
        expect(service[`scaling`].value).toEqual(3);
    });

    it('should angle.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.angle.next(3);
        expect(service[`angle`].value).toEqual(3);
    });

    it('should stampType.next', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.stampType.next('1');
        expect(service[`stampType`].value).toEqual('1');
    });
});
