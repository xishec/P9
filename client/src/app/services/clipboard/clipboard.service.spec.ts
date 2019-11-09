import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { OFFSET_STEP } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { ClipboardService } from './clipboard.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';

describe('ClipboardService', () => {
    let injector: TestBed;
    let service: ClipboardService;
    let selection: Selection;
    let manipulator: ManipulatorService;

    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;
    let elementRefMock: ElementRef<SVGElement>;

    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ManipulatorService,
                Selection,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => null,
                        },
                    },
                },
                {
                    provide: UndoRedoerService,
                    useValue: {
                        saveCurrentState: () => null,
                    }
                }
            ],
        });

        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        selection = new Selection(rendererMock, elementRefMock);
        manipulator = injector.get(ManipulatorService);
        manipulator.initializeService(rendererMock);
        service = injector.get(ClipboardService);
        service.initializeService(elementRefMock, rendererMock, drawStackMock, selection);

        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();

        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should assign values to renderer, drawStack, selection and elementref when calling initializeService', () => {
        const mockService = injector.get(ClipboardService) as ClipboardService;

        mockService.initializeService(elementRefMock, rendererMock, drawStackMock, selection);

        expect(mockService.renderer).toBeTruthy();
        expect(mockService.drawStack).toBeTruthy();
        expect(mockService.selection).toBeTruthy();
        expect(mockService.elementRef).toBeTruthy();
    });

    it('should add selection to duplicationBuffer and set firstDuplication to true if calling restartDuplication', () => {
        const spyOnClear = spyOn(service.duplicationBuffer, 'clear');
        const spyOnAdd = spyOn(service.duplicationBuffer, 'add');
        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.restartDuplication();

        expect(spyOnClear).toHaveBeenCalled();
        expect(spyOnAdd).toHaveBeenCalled();
        expect(service.firstDuplication).toBeTruthy();
    });

    it('should increase the offset, clone the selection to workzone and update the selection when calling clone', () => {
        const elementsToClone: Set<SVGGElement> = new Set<SVGGElement>();
        const elementToClone = {
            cloneNode: (bool: boolean) => {
                return TestHelpers.createMockSVGGElement();
            },
        };
        elementsToClone.add((elementToClone as unknown) as SVGGElement);

        const spyOnPush = spyOn(drawStackMock, 'push');
        const spyOnUpdateSelection = spyOn(service, 'updateSelection');
        const spyOnManipulator = spyOn(manipulator, 'offsetSingle');

        service.clone(elementsToClone, 0);

        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(spyOnPush).toHaveBeenCalled();
        expect(spyOnUpdateSelection).toHaveBeenCalled();
        expect(spyOnManipulator).toHaveBeenCalled();
    });

    it('should emptySelection and add new elements to selection when calling updateSelection', () => {
        const newElements: Set<SVGGElement> = new Set<SVGGElement>();
        newElements.add(TestHelpers.createMockSVGGElement());

        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');
        const spyOnAddToSelection = spyOn(service.selection, 'addToSelection');

        service.updateSelection(newElements);

        expect(spyOnEmptySelection).toHaveBeenCalled();
        expect(spyOnAddToSelection).toHaveBeenCalled();
    });

    it('should update clippingsBound with the selection bounds when calling fetchSelectionBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };

        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        spyOn(service.selection.selectionBox, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        service.fetchSelectionBounds();

        expect(service.clippingsBound).toEqual((mockDOMRect as unknown) as DOMRect);
    });

    it('should return true if clippingsBound is inside the workzone when calling isInBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        };

        const mockClippingsBound = {
            x: 10,
            y: 10,
            width: 10,
            height: 10,
        };
        service.clippingsBound = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service.elementRef.nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        const res = service.isInBounds();

        expect(res).toBeTruthy();
    });

    it('should return false if clippingsBound is inside the workzone when calling isInBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        };

        const mockClippingsBound = {
            x: 410,
            y: 410,
            width: 10,
            height: 10,
        };
        service.clippingsBound = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service.elementRef.nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        const res = service.isInBounds();

        expect(res).toBeFalsy();
    });

    it('should reset the pasteOffsetValue if not in bounds when calling handlePasteOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return false;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increasePasteOffsetValue();
        service.handlePasteOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.pasteOffsetValue).toEqual(0);
    });

    it('should not do anything if in bounds when calling handlePasteOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return true;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 20,
            height: 20,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increasePasteOffsetValue();
        service.handlePasteOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.pasteOffsetValue).toEqual(OFFSET_STEP);
    });

    it('should reset the duplicateOffsetValue if not in bounds when calling handleDuplicateOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return false;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 20,
            height: 20,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increaseDuplicateOffsetValue();
        service.handleDuplicateOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.duplicateOffsetValue).toEqual(0);
    });

    it('should not do anything if in bounds when calling handleDuplicateOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return true;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 20,
            height: 20,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increaseDuplicateOffsetValue();
        service.handleDuplicateOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.duplicateOffsetValue).toEqual(OFFSET_STEP);
    });

    it('should increase the pasteOffsetValue of OFFSET_STEP when calling increasePasteOffsetValue', () => {
        service.increasePasteOffsetValue();

        expect(service.pasteOffsetValue).toEqual(OFFSET_STEP);
    });

    it('should decrease the pasteOffsetValue by OFFSET_STEP and not let it under 0 when calling decreasePasteOffsetValue', () => {
        service.decreasePasteOffsetValue();

        expect(service.pasteOffsetValue).toEqual(0);
    });

    it('should decrease the pasteOffsetValue by OFFSET_STEP and when calling decreasePasteOffsetValue', () => {
        service.increasePasteOffsetValue();
        service.decreasePasteOffsetValue();

        expect(service.pasteOffsetValue).toEqual(0);
    });

    it('should increase the duplicateOffsetValue of OFFSET_STEP when calling increaseDuplicateOffsetValue', () => {
        service.increaseDuplicateOffsetValue();

        expect(service.duplicateOffsetValue).toEqual(OFFSET_STEP);
    });

    it('should decrease the duplicateOffsetValue by OFFSET_STEP and not let it under 0 when calling decreaseDuplicateOffsetValue', () => {
        service.decreaseDuplicateOffsetValue();

        expect(service.duplicateOffsetValue).toEqual(0);
    });

    it('should decrease the duplicateOffsetValue by OFFSET_STEP and when calling decreaseDuplicateOffsetValue', () => {
        service.increaseDuplicateOffsetValue();
        service.decreaseDuplicateOffsetValue();

        expect(service.duplicateOffsetValue).toEqual(0);
    });

    it('should remove cut elements from workzone, clear the selection and add them to a cleared clippings when calling cut', () => {
        const spyOnFetch = spyOn(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service.clippings, 'clear');
        const spyOnAddClippings = spyOn(service.clippings, 'add');
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnDeleteDrawStack = spyOn(service.drawStack, 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.cut();
        jasmine.clock().tick(1);

        expect(service.firstDuplication).toBeTruthy();
        expect(service.pasteOffsetValue).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });

    it('should add copied elements to a cleared clippings', () => {
        const spyOnFetch = spyOn(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service.clippings, 'clear');
        const spyOnAddClippings = spyOn(service.clippings, 'add');
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.copy();

        expect(service.firstDuplication).toBeTruthy();
        expect(service.pasteOffsetValue).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
    });

    it('should call clone and handleDuplicateOutOfBounds when calling duplicate', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handleDuplicateOutOfBounds').and.callFake(() => null);

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
    });

    it('should replace duplicationBuffer for selection and only increase duplicateOffsetValue once when first calling duplicate', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handleDuplicateOutOfBounds').and.callFake(() => null);
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnAddDuplicationBuffer = spyOn(service.duplicationBuffer, 'add');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnAddDuplicationBuffer).toHaveBeenCalled();
        expect(service.firstDuplication).toBeFalsy();
        expect(service.duplicateOffsetValue).toEqual(OFFSET_STEP);
    });

    it('should call clone and handleOutOfBounds when calling paste', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handlePasteOutOfBounds').and.callFake(() => null);
        service.clippings.add(TestHelpers.createMockSVGElement());

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.paste();
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);
        jasmine.clock().tick(1);

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(service.firstDuplication).toBeTruthy();
    });

    it('should remove selection from workzone, clear the selection and clear duplicationBuffer when calling delete', () => {
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnDeleteDrawStack = spyOn(service.drawStack, 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.delete();
        jasmine.clock().tick(1);

        expect(service.firstDuplication).toBeTruthy();
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });
});
