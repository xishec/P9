import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { OFFSET_STEP } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';
import { ClipboardService } from './clipboard.service';

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
                        listen: () => null,
                        setStyle: () => null,
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
                        saveStateAndDuplicateOffset: () => null,
                        saveStateFromPaste: () => null,
                        saveCurrentState: () => null,
                        currentDuplicateOffset: {
                            subscribe: () => null,
                        },
                        currentPasteOffset: {
                            subscribe: () => null,
                        },
                        currentClipping: {
                            subscribe: () => null,
                        },
                    },
                },
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

        spyOnAppendChild = spyOn(service[`renderer`], 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service[`renderer`], 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should assign values to renderer, drawStack, selection and elementref when calling initializeService', () => {
        const mockService = injector.get(ClipboardService) as ClipboardService;

        mockService.initializeService(elementRefMock, rendererMock, drawStackMock, selection);

        expect(mockService[`renderer`]).toBeTruthy();
        expect(mockService[`drawStack`]).toBeTruthy();
        expect(mockService[`selection`]).toBeTruthy();
        expect(mockService[`elementRef`]).toBeTruthy();
    });

    it('should add selection to duplicationBuffer and set firstDuplication to true if calling restartDuplication', () => {
        const spyOnClear = spyOn(service[`duplicationBuffer`], 'clear');
        const spyOnAdd = spyOn(service[`duplicationBuffer`], 'add');
        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());
        service.restartDuplication();

        expect(spyOnClear).toHaveBeenCalled();
        expect(spyOnAdd).toHaveBeenCalled();
        expect(service[`firstDuplication`]).toBeTruthy();
    });

    it('should clone the selection to workzone and update the selection when calling clone', () => {
        const elementsToClone: Set<SVGGElement> = new Set<SVGGElement>();
        const elementToClone = {
            cloneNode: (bool: boolean) => {
                return TestHelpers.createMockSVGGElement();
            },
        };
        elementsToClone.add((elementToClone as unknown) as SVGGElement);

        const spyOnPush = spyOn(drawStackMock, 'push');
        const spyOnUpdateSelection = spyOn<any>(service, 'updateSelection');
        const spyOnTranslate = spyOn(manipulator, 'translateElement');
        const spyOnUpdateOrigins = spyOn(manipulator, 'updateOrigins').and.callFake(() => null);

        service[`clone`](elementsToClone, 0);

        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(spyOnPush).toHaveBeenCalled();
        expect(spyOnUpdateSelection).toHaveBeenCalled();
        expect(spyOnTranslate).toHaveBeenCalled();
        expect(spyOnUpdateOrigins).toHaveBeenCalled();
    });

    it('should emptySelection and add new elements to selection when calling updateSelection', () => {
        const newElements: Set<SVGGElement> = new Set<SVGGElement>();
        newElements.add(TestHelpers.createMockSVGGElement());

        const spyOnEmptySelection = spyOn(service[`selection`], 'emptySelection');
        const spyOnAddToSelection = spyOn(service[`selection`], 'addToSelection');

        service[`updateSelection`](newElements);

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

        service[`selection`].selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        spyOn(service[`selection`].selectionBox, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        service[`fetchSelectionBounds`]();

        expect(service[`clippingsBound`]).toEqual((mockDOMRect as unknown) as DOMRect);
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
        service[`clippingsBound`] = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service[`elementRef`].nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        const res = service[`isInBounds`]();

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
        service[`clippingsBound`] = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service[`elementRef`].nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect,
        );

        const res = service[`isInBounds`]();

        expect(res).toBeFalsy();
    });

    it('should reset the pasteOffsetValue if not in bounds when calling handlePasteOutOfBounds', () => {
        const spyOnIsInBounds = spyOn<any>(service, 'isInBounds').and.callFake(() => {
            return false;
        });
        const spyOnFetchSelectionBounds = spyOn<any>(service, 'fetchSelectionBounds');
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
        service[`selection`].selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service[`increasePasteOffsetValue`]();
        service[`handlePasteOutOfBounds`]();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service[`pasteOffsetValue`]).toEqual(0);
    });

    it('should not do anything if in bounds when calling handlePasteOutOfBounds', () => {
        const spyOnIsInBounds = spyOn<any>(service, 'isInBounds').and.callFake(() => {
            return true;
        });
        const spyOnFetchSelectionBounds = spyOn<any>(service, 'fetchSelectionBounds');
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
        service[`selection`].selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service[`increasePasteOffsetValue`]();
        service[`handlePasteOutOfBounds`]();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service[`pasteOffsetValue`]).toEqual(OFFSET_STEP);
    });

    it('should reset the duplicateOffsetValue if not in bounds when calling handleDuplicateOutOfBounds', () => {
        const spyOnIsInBounds = spyOn<any>(service, 'isInBounds').and.callFake(() => {
            return false;
        });
        const spyOnFetchSelectionBounds = spyOn<any>(service, 'fetchSelectionBounds');
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
        service[`selection`].selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service[`increaseDuplicateOffsetValue`]();
        service[`handleDuplicateOutOfBounds`]();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service[`duplicateOffsetValue`]).toEqual(0);
    });

    it('should not do anything if in bounds when calling handleDuplicateOutOfBounds', () => {
        const spyOnIsInBounds = spyOn<any>(service, 'isInBounds').and.callFake(() => {
            return true;
        });
        const spyOnFetchSelectionBounds = spyOn<any>(service, 'fetchSelectionBounds');
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
        service[`selection`].selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service[`increaseDuplicateOffsetValue`]();
        service[`handleDuplicateOutOfBounds`]();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service[`duplicateOffsetValue`]).toEqual(OFFSET_STEP);
    });

    it('should increase the pasteOffsetValue of OFFSET_STEP when calling increasePasteOffsetValue', () => {
        service[`increasePasteOffsetValue`]();

        expect(service[`pasteOffsetValue`]).toEqual(OFFSET_STEP);
    });

    it('should increase the duplicateOffsetValue of OFFSET_STEP when calling increaseDuplicateOffsetValue', () => {
        service[`increaseDuplicateOffsetValue`]();

        expect(service[`duplicateOffsetValue`]).toEqual(OFFSET_STEP);
    });

    it('should not do anything when no items are selected on duplicate', () => {
        const spyOnHandleDuplicateOutOfBounds = spyOn<any>(service, 'handleDuplicateOutOfBounds').and.callFake(
            () => true,
        );
        const spyOnIncreaseDuplicateOffsetValue = spyOn<any>(service, 'increaseDuplicateOffsetValue').and.callFake(
            () => null,
        );
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake(() => null);
        const spyOnSaveState = spyOn<any>(service, 'saveStateFromDuplicate').and.callFake(() => null);

        service.duplicate();

        expect(spyOnHandleDuplicateOutOfBounds).not.toHaveBeenCalled();
        expect(spyOnIncreaseDuplicateOffsetValue).not.toHaveBeenCalled();
        expect(spyOnClone).not.toHaveBeenCalled();
        expect(spyOnSaveState).not.toHaveBeenCalled();
    });

    it('should remove cut elements from workzone, clear the selection and add them to a cleared clippings when calling cut', () => {
        const spyOnFetch = spyOn<any>(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service[`clippings`], 'clear');
        const spyOnAddClippings = spyOn(service[`clippings`], 'add');
        const spyOnClearDuplicationBuffer = spyOn(service[`duplicationBuffer`], 'clear');
        const spyOnDeleteDrawStack = spyOn(service[`drawStack`], 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service[`selection`], 'emptySelection');

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());

        service.cut();

        expect(service[`firstDuplication`]).toBeTruthy();
        expect(service[`pasteOffsetValue`]).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });

    it('should add copied elements to a cleared clippings', () => {
        const spyOnFetch = spyOn<any>(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service[`clippings`], 'clear');
        const spyOnAddClippings = spyOn(service[`clippings`], 'add');
        const spyOnClearDuplicationBuffer = spyOn(service[`duplicationBuffer`], 'clear');

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());

        service.copy();

        expect(service[`firstDuplication`]).toBeTruthy();
        expect(service[`pasteOffsetValue`]).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
    });

    it('should call clone and handleDuplicateOutOfBounds when calling duplicate', () => {
        const spyOnIncreaseDuplicateOffsetValue = spyOn<any>(service, 'increaseDuplicateOffsetValue').and.callFake(
            () => null,
        );
        const spyOnSaveState = spyOn<any>(service, 'saveStateFromDuplicate').and.callFake(() => null);
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn<any>(service, 'handleDuplicateOutOfBounds').and.callFake(() => null);

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(spyOnIncreaseDuplicateOffsetValue).toHaveBeenCalled();
        expect(spyOnSaveState).toHaveBeenCalled();
    });

    it('should replace duplicationBuffer for selection and only increase duplicateOffsetValue once when first calling duplicate', () => {
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn<any>(service, 'handleDuplicateOutOfBounds').and.callFake(() => null);
        const spyOnClearDuplicationBuffer = spyOn(service[`duplicationBuffer`], 'clear');
        const spyOnAddDuplicationBuffer = spyOn(service[`duplicationBuffer`], 'add');

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnAddDuplicationBuffer).toHaveBeenCalled();
        expect(service[`firstDuplication`]).toBeFalsy();
        expect(service[`duplicateOffsetValue`]).toEqual(OFFSET_STEP);
    });

    it('should call clone and handleOutOfBounds when calling paste', () => {
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn<any>(service, 'handlePasteOutOfBounds').and.callFake(() => null);
        service[`clippings`].add(TestHelpers.createMockSVGElement());

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());

        service.paste();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(service[`firstDuplication`]).toBeTruthy();
    });

    it('should remove selection from workzone, clear the selection and clear duplicationBuffer when calling delete', () => {
        const spyOnClearDuplicationBuffer = spyOn(service[`duplicationBuffer`], 'clear');
        const spyOnDeleteDrawStack = spyOn(service[`drawStack`], 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service[`selection`], 'emptySelection');

        service[`selection`].selectedElements.add(TestHelpers.createMockSVGGElement());

        service.delete();

        expect(service[`firstDuplication`]).toBeTruthy();
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });

    it('should notify true when clippings is empty', () => {
        const spy = spyOn(service.isClippingsEmpty, 'next');

        service[`notifyClippingsState`]();

        expect(spy).toHaveBeenCalledWith(true);
    });

    it('should notify false when clippings is not empty', () => {
        const spy = spyOn(service.isClippingsEmpty, 'next');

        spyOnProperty(service[`clippings`], 'size', 'get').and.returnValue(10);
        service[`notifyClippingsState`]();

        expect(spy).toHaveBeenCalledWith(false);
    });

    it('should return if clippings is empty on paste', () => {
        spyOnProperty(service[`clippings`], 'size', 'get').and.returnValue(0);
        const spyOnIncreasePasteOffsetValue = spyOn<any>(service, 'increasePasteOffsetValue').and.callFake(() => null);
        const spyOnSaveState = spyOn<any>(service, 'saveStateFromDuplicate').and.callFake(() => null);
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn<any>(service, 'handleDuplicateOutOfBounds').and.callFake(() => null);

        service.paste();

        expect(spyOnClone).not.toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).not.toHaveBeenCalled();
        expect(spyOnIncreasePasteOffsetValue).not.toHaveBeenCalled();
        expect(spyOnSaveState).not.toHaveBeenCalled();
    });

    it('should not increase offset on initial cut on paste', () => {
        service[`clippings`].add(TestHelpers.createMockSVGGElement());
        service[`isFromInitialCut`] = true;
        const spyOnIncreasePasteOffsetValue = spyOn<any>(service, 'increasePasteOffsetValue').and.callFake(() => null);
        const spyOnSaveState = spyOn<any>(service, 'saveStateFromPaste').and.callFake(() => null);
        const spyOnClone = spyOn<any>(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn<any>(service, 'handlePasteOutOfBounds').and.callFake(() => null);

        service.paste();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(spyOnIncreasePasteOffsetValue).not.toHaveBeenCalled();
        expect(spyOnSaveState).toHaveBeenCalled();
    });

    it('should return false is clippings are different size on compareClippings', () => {
        const mockClippings1: Set<SVGGElement> = new Set<SVGGElement>();
        mockClippings1.add(TestHelpers.createMockSVGGElement());

        const mockClippings2: Set<SVGGElement> = new Set<SVGGElement>();

        const res = service[`compareClipings`](mockClippings1, mockClippings2);

        expect(res).toBeFalsy();
    });

    it('should return false is clippings are different on compareClippings', () => {
        const mockClippings1: Set<SVGGElement> = new Set<SVGGElement>();
        mockClippings1.add(TestHelpers.createMockSVGGElement());

        const mockClippings2: Set<SVGGElement> = new Set<SVGGElement>();
        mockClippings2.add(TestHelpers.createMockSVGGElement());

        const res = service[`compareClipings`](mockClippings1, mockClippings2);

        expect(res).toBeFalsy();
    });

    it('should return true is clippings are equal on compareClippings', () => {
        const sameElement = TestHelpers.createMockSVGGElement();
        const mockClippings1: Set<SVGGElement> = new Set<SVGGElement>();
        mockClippings1.add(sameElement);

        const mockClippings2: Set<SVGGElement> = new Set<SVGGElement>();
        mockClippings2.add(sameElement);

        const res = service[`compareClipings`](mockClippings1, mockClippings2);

        expect(res).toBeTruthy();
    });

    it('should return if selection is empty on delete', () => {
        spyOnProperty(service[`selection`].selectedElements, 'size', 'get').and.returnValue(0);
        const spyOnClear = spyOn(service[`duplicationBuffer`], 'clear').and.callFake(() => null);
        const spyOnDelete = spyOn(service[`drawStack`], 'delete').and.callFake(() => null);
        const spyOnSelection = spyOn(service[`selection`], 'emptySelection').and.callFake(() => null);

        service.delete();

        expect(spyOnClear).not.toHaveBeenCalled();
        expect(spyOnDelete).not.toHaveBeenCalled();
        expect(spyOnSelection).not.toHaveBeenCalled();
    });
});
