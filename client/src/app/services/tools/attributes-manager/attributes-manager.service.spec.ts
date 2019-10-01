import { TestBed } from '@angular/core/testing';

import { AttributesManagerService } from './attributes-manager.service';
import { TraceType } from 'src/constants/tool-constants';
import { BehaviorSubject } from 'rxjs';

fdescribe('AttributesManagerService', () => {
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
        service.changeTraceType(TraceType.Full);
        expect(service[`traceType`].value).toEqual(TraceType.Full);
    });

    it('should changeStyle', () => {
        const service: AttributesManagerService = TestBed.get(AttributesManagerService);
        service.changeStyle(2);
        expect(service[`style`].value).toEqual(2);
    });
});
