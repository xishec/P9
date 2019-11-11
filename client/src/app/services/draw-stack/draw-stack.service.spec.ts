import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { ToolName } from 'src/constants/tool-constants';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';
import { DrawStackService } from './draw-stack.service';

const NB_PUSH = 3;

describe('DrawStackService', () => {
    let injector: TestBed;
    let service: DrawStackService;

    const mockSVGGElement: any = {
        getAttribute: () => null,
        children: {
            length: 0,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Renderer2,
                    useValue: {
                        listen: () => null,
                        setAttribute: () => null,
                    },
                },
                {
                    provide: UndoRedoerService,
                    useValue : {
                        saveCurrentState: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(DrawStackService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when getElementByPosition then returns element in drawStack at position', () => {
        service[`drawStack`].push(mockSVGGElement);

        const returnedElement: any = service.getElementByPosition(0);

        expect(returnedElement).toEqual(mockSVGGElement);
    });

    it(`when getDrawStackLenght after ${NB_PUSH} push then should return lenght of ${NB_PUSH}`, () => {
        for (let i = 0; i < NB_PUSH; i++) {
            service[`drawStack`].push(mockSVGGElement);
        }

        const nbElements = service.getDrawStackLength();

        expect(nbElements).toBe(NB_PUSH);
    });

    it('when push SVGGElement drawStack should contain the element', () => {
        service.drawStack = new Array();

        service.push(mockSVGGElement);

        expect(service[`drawStack`]).toContain(mockSVGGElement);
    });

    it('when pop return the last element and drawStack does not contain element', () => {
        service[`drawStack`].push(mockSVGGElement);

        const popElement = service.pop();

        expect(popElement).toEqual(mockSVGGElement);
        expect(service[`drawStack`]).not.toContain(mockSVGGElement);
    });

    it('when pop return the last element and idStack.length is not zero', () => {
        service[`drawStack`].push(mockSVGGElement);
        service.makeTargetable(mockSVGGElement);

        const popElement = service.pop();

        expect(popElement).toEqual(mockSVGGElement);
        expect(service.idStack.length).toBeGreaterThan(0);
    });

    it('when reset then drawStack is empty and length zero', () => {
        for (let i = 0; i < NB_PUSH; i++) {
            service[`drawStack`].push(mockSVGGElement);
        }

        service.reset();

        expect(service[`drawStack`].length).toBe(0);
        expect(service[`drawStack`]).not.toContain(mockSVGGElement);
    });

    it('should getDrawStackLength', () => {
        service[`stackTarget`].next = () => null;
        const SPY = spyOn(service[`stackTarget`], 'next');
        const stackTarget = new StackTargetInfo(1, ToolName.ArtGallery);
        service.changeTargetElement(stackTarget);
        expect(SPY).toHaveBeenCalledWith(stackTarget);
    });

    it('delete should call resolveDrawStackOrdering and splice of drawStack and idStack', () => {
        service.push(mockSVGGElement);
        const spyOnResolveDrawStack = spyOn(service, 'resolveDrawStackOrdering');
        const spyOnspliceDrawStack = spyOn(service.drawStack, 'splice');
        const spyOnspliceIdStack = spyOn(service.idStack, 'splice');

        service.delete(mockSVGGElement);

        expect(service.drawStack[0]).toEqual(mockSVGGElement);
        expect(spyOnResolveDrawStack).toHaveBeenCalled();
        expect(spyOnspliceDrawStack).toHaveBeenCalled();
        expect(spyOnspliceIdStack).toHaveBeenCalled();
    });

    it('delete should call setAttribute if there are elements to resolve', () => {
        service.push(mockSVGGElement);
        service.push(mockSVGGElement);
        const spyOnsetAttribute = spyOn(service.renderer, 'setAttribute');

        service.resolveDrawStackOrdering(0);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('delete should not call setAttribute if there are not elements to resolve', () => {
        service.drawStack.length = 2;
        const spyOnsetAttribute = spyOn(service.renderer, 'setAttribute');

        service.resolveDrawStackOrdering(2);

        expect(spyOnsetAttribute).toHaveBeenCalledTimes(0);
    });

    it('setElementByPosition should set the correct element to the correct position', () => {
        service.setElementByPosition(0, mockSVGGElement);

        expect(service.drawStack[0]).toEqual(mockSVGGElement);
    });
});
