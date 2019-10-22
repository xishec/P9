import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';
import { createMockSVGGElementWithAttribute, createMouseEvent, createMockSVGGElement, createMockSVGCircle } from 'src/classes/test-helpers';
import { Mouse } from 'src/constants/constants';
//import { MockRect } from 'src/classes/test-helpers';

fdescribe('SelectionToolService', () => {
    //const mockDrawRect: MockRect = new MockRect();
    const MOCK_LEFT_CLICK = createMouseEvent(0,0,Mouse.LeftButton);
    const MOCK_RIGHT_CLICK = createMouseEvent(0,0,Mouse.RightButton);

    let injector: TestBed;
    let service: SelectionToolService;
    // let positiveMouseEvent: MouseEvent;
    // let negativeMouseEvent: MouseEvent;
    // let onAltKeyDown: KeyboardEvent;
    // let onOtherKeyDown: KeyboardEvent;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;
    // let spyOnDrawStackPush: jasmine.Spy;
    // let spyOnPreventDefault: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SelectionToolService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
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
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(SelectionToolService);

        // positiveMouseEvent = createMouseEvent(10, 10, 0);
        // negativeMouseEvent = createMouseEvent(-10, -10, 0);

        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        // onOtherKeyDown = createKeyBoardEvent(Keys.Shift);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
        // spyOnDrawStackPush = spyOn(service.drawStack, 'push').and.returnValue();
        // spyOnPreventDefault = spyOn(onAltKeyDown, 'preventDefault').and.returnValue();

        // spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
        //     return mockDrawRect.width;
        // });
        // spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
        //     return mockDrawRect.height;
        // });

        let mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        spyOn(service, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the function removeFullSelectionBox and set isTheCurrentTool to false', () => {
        let spyOnRemoveFullSelectionBox: jasmine.Spy = spyOn(service, 'removeFullSelectionBox');
        service.isTheCurrentTool = true;

        service.cleanUp();

        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
        expect(service.isTheCurrentTool).toBeFalsy();
    });

    it('should call renderer.setAttribute for each control point', () => {
        const nbPoints = 8;
        const nbCallPerPoint = 3;
        
        service.initControlPoints();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(nbPoints*nbCallPerPoint);
    });

    it('should call renderer.setAttribute to set the attributes of selection box', () => {
        service.initSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute to set the attributes of selectionRectangle even if deltaX/Y is negative', () => {
        service.currentMouseX = 5;
        service.initialMouseX = 10;
        service.currentMouseY = 5;
        service.initialMouseY = 10;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute to set the attributes of selectionRectangle when deltaX/Y is positive', () => {
        service.currentMouseX = 10;
        service.initialMouseX = 5;
        service.currentMouseY = 10;
        service.initialMouseY = 5;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = createMockSVGGElementWithAttribute(''    );
        
        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(10);
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = createMockSVGGElementWithAttribute('');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('mousIsInSelectionBox should return true if mouseX is in selection box', () => {
        service.currentMouseX = 160;
        service.currentMouseY = 520;

        let res = service.mouseIsInSelectionBox();

        expect(res).toBeTruthy();
    });

    it('mousIsInSelectionBox should return false if mouseX not in selection box', () => {
        service.currentMouseX = 1600;
        service.currentMouseY = 5200;

        let res = service.mouseIsInSelectionBox();

        expect(res).toBeFalsy();
    });

    it('mouseIsInControlPoint should return true if mouseX and mouseY in one of controlPoint', () => {
        service.controlPoints = new Array();
        const mockControlPoint = {
            cx : {
                baseVal : {
                    value : 10,
                }
            },
            cy : {
                baseVal : {
                    value : 10,
                }
            },
            r : {
                baseVal : {
                    value: 5,
                }
            }
        }
        service.controlPoints.push(mockControlPoint as SVGCircleElement);
        service.currentMouseX = 11;
        service.currentMouseY = 11;

        const res = service.mouseIsInControlPoint();

        expect(res).toBeTruthy();
    });

    it('mouseIsInControlPoint should return true if mouseX and mouseY in one of controlPoint', () => {
        service.controlPoints = new Array();
        const mockControlPoint = {
            cx : {
                baseVal : {
                    value : 10,
                }
            },
            cy : {
                baseVal : {
                    value : 10,
                }
            },
            r : {
                baseVal : {
                    value: 5,
                }
            }
        }
        service.controlPoints.push(mockControlPoint as SVGCircleElement);
        service.currentMouseX = 100;
        service.currentMouseY = 100;

        const res = service.mouseIsInControlPoint();

        expect(res).toBeFalsy();
    });

    it('isInSelection should return true if elBottom >= boxTop && boxBottom >= elTop && elRight >= boxLeft && boxRight >= elLeft', () => {
        const mockSelectionBox = {
            x : 500,
            y : 500,
            width : 50,
            height : 50,
        } as DOMRect;

        const mockElementBox = {
            x : 500,
            y : 500,
            width : 50,
            height : 50,
        } as DOMRect;

        const res = service.isInSelection(mockSelectionBox, mockElementBox);

        expect(res).toBeTruthy();
    });

    it('isInSelection should return false if elBottom < boxTop ', () => {
        const mockSelectionBox = {
            x : 500,
            y : 10,
            width : 50,
            height : 50,
        } as DOMRect;

        const mockElementBox = {
            x : 500,
            y : 500,
            width : 50,
            height : 50,
        } as DOMRect;

        const res = service.isInSelection(mockSelectionBox, mockElementBox);

        expect(res).toBeFalsy();
    });

    it('singlySelect should call clearSelection if hasSelected', () => {
        spyOn(service, 'hasSelected').and.returnValue(true);
        spyOn(service, 'computeSelectionBox').and.returnValue();
        const spy = spyOn(service, 'clearSelection');

        service.singlySelect(1);

        expect(spy).toHaveBeenCalled();
        
    });

    it('singlySelect should call computeSelectionBox and set isOnTarget to false even if !hasSelected', () => {
        spyOn(service, 'hasSelected').and.returnValue(false);
        const spy = spyOn(service, 'computeSelectionBox').and.returnValue();

        service.singlySelect(1);

        expect(spy).toHaveBeenCalled();
        expect(service.isOnTarget).toBeFalsy();
        
    });

    it('startSelection should set isSelecting to true', () => {
        service.isSelecting = false;

        service.startSelection();

        expect(service.isSelecting).toBeTruthy();
    });

    it('clearSelection should call selection.clear', () => {
        const spy = spyOn(service.selection, 'clear');

        service.clearSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('applySelectionInvert should call selection.delete if this.selection has el that is in invertSelection', () => {
        const el = createMockSVGGElement();
        service.invertSelection = new Set<SVGGElement>();
        service.invertSelection.add(el);

        service.selection = new Set<SVGGElement>();
        service.selection.add(el);

        const spy = spyOn(service.selection, 'delete');

        service.applySelectionInvert();

        expect(spy).toHaveBeenCalled();
    });

    it('applySelectionInvert should not call selection.delete if this.selection does not have el that is in invertSelection', () => {
        const el = createMockSVGGElement();
        service.invertSelection = new Set<SVGGElement>();
        service.invertSelection.add(el);

        const spy = spyOn(service.selection, 'delete');

        service.applySelectionInvert();

        expect(spy).not.toHaveBeenCalled();
    });

    it('singlyInvertSelect should not call selection delete if drawStack.drawStack[]', () => {
        service.drawStack.drawStack = new Array();
        const spy = spyOn(service.selection, 'delete');

        service.singlyInvertSelect(10);

        expect(spy).not.toHaveBeenCalled();
    });

    it('checkSelection should call selection.add if this.isInSelection && isLeftMouseDown', () => {
        service.drawStack.drawStack = new Array();
        const mockSVGElement = createMockSVGGElement();
        service.drawStack.drawStack.push(mockSVGElement);

        spyOn(service, 'getStrokeWidth').and.returnValue(5);
        spyOn(service, 'isInSelection').and.returnValue(true);
        service.isLeftMouseDown = true;

        const spy = spyOn(service.selection, 'add');

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('checkSelection should call invertSelection.add if this.isInSelection && isRightMouseDown', () => {
        service.drawStack.drawStack = new Array();
        const mockSVGElement = createMockSVGGElement();
        service.drawStack.drawStack.push(mockSVGElement);

        spyOn(service, 'getStrokeWidth').and.returnValue(5);
        spyOn(service, 'isInSelection').and.returnValue(true);
        service.isRightMouseDown = true;

        const spy = spyOn(service.invertSelection, 'add');

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('checkSelection should call selection.delete if !this.isInSelection && isLeftMouseDown', () => {
        service.drawStack.drawStack = new Array();
        const mockSVGElement = createMockSVGGElement();
        service.drawStack.drawStack.push(mockSVGElement);

        spyOn(service, 'getStrokeWidth').and.returnValue(5);
        spyOn(service, 'isInSelection').and.returnValue(false);
        service.isLeftMouseDown = true;

        const spy = spyOn(service.selection, 'delete');

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('checkSelection should call invertSelection.delete if !this.isInSelection && isRightMouseDown', () => {
        const mockSVGElement = createMockSVGGElement();
        service.drawStack.drawStack = new Array();
        service.drawStack.drawStack.push(mockSVGElement);

        spyOn(service, 'getStrokeWidth').and.returnValue(5);
        spyOn(service, 'isInSelection').and.returnValue(false);
        service.isRightMouseDown = true;

        const spy = spyOn(service.invertSelection, 'delete');

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('computeSelectionBox should call removeFullSelectionBox is !this.hasSelected', () => {
        const spy = spyOn(service, 'removeFullSelectionBox');
        spyOn(service, 'hasSelected').and.returnValue(false);

        service.computeSelectionBox();

        expect(spy).toHaveBeenCalled();
    });

    it('computeSelectionBox should call renderer.setAttribute 4 times is this.hasSelected', () => {
        spyOn(service, 'hasSelected').and.returnValue(true);
        spyOn(service, 'findLeftMostCoord').and.returnValue(10);
        spyOn(service, 'findRightMostCoord').and.returnValue(100);
        spyOn(service, 'findTopMostCoord').and.returnValue(100);
        spyOn(service, 'findBottomMostCoord').and.returnValue(10);
        spyOn(service, 'computeControlPoints').and.returnValue();

        service.computeSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(4);
    });

    it('computeControlPoints should call setAttribute 16 times : 8 selectionCorner * 2 attributes', () => {
        let mockSVGRectElement = {
            x : { baseVal : {value : 10, } },
            y : { baseVal : { value : 10, } },
            width : { baseVal : { value : 10, } },
            height : { baseVal : { value : 10, } },
        } as SVGRectElement;

        service.selectionBox = mockSVGRectElement; 
        
        service.controlPoints = new Array();
        for (let i = 0; i < 8; i++){
            let mockSVG = createMockSVGCircle();
            service.controlPoints.push(mockSVG);
        }

        service.computeControlPoints();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(16);
    });

    it('hasSelected return true if this.selection.size > 0', () => {
        service.selection = new Set();
        const mockSVGElement = createMockSVGGElement();
        service.selection.add(mockSVGElement);

        const res = service.hasSelected();

        expect(res).toBeTruthy();
    });

    it('appendControlPoints should call renderer.appendChild for each points (8)', () => {
        service.appendControlPoints();

        expect(spyOnAppendChild).toHaveBeenCalledTimes(8);
    });

    it('removeControlPoints should call renderer.removeChild for each ctrlPt', () => {
        const mockCtrlPnt = createMockSVGCircle();
        service.controlPoints = new Array();
        service.controlPoints.push(mockCtrlPnt);

        service.removeControlPoints();

        expect(spyOnRemoveChild).toHaveBeenCalledTimes(1);
    });

    it('appendFullSelectionBox should call appendControlPoints if !selectionBoxIsAppended', () => {
        service.selectionBoxIsAppended = false;
        const spy = spyOn(service, 'appendControlPoints');

        service.appendFullSelectionBox();

        expect(spy).toHaveBeenCalled();
    });

    it('removeFullSelectionBox should call removeControlPoints if selectionBoxIsAppended', () => {
        service.selectionBoxIsAppended = true;
        const spy = spyOn(service, 'removeControlPoints');

        service.removeFullSelectionBox();

        expect(spy).toHaveBeenCalled();
    });

    it('translateSelection should call createSVGTransform if transformList.numberOfItems === 0', () => {
        
        const mockSVGTransform = {
            type : 0,
            setTranslate: () => null,
            matrix: {
                e : 0,
                f : 0,
            }
            
        } as (unknown) as SVGTransform;

        const mockSVGTranformList = {
            numberOfItems : 0,
            getItem : () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown) as SVGTransformList;
        
        const mockSVGGelement = {
            transform : {
                baseVal : mockSVGTranformList,
            }
        } as (unknown) as SVGGElement;

        service.selection = new Set();
        service.selection.add(mockSVGGelement);

        const mockTranslate = {
            setTranslate : () => null,
        } as (unknown) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform : () => mockTranslate,
        } as SVGSVGElement

        spyOn(service.renderer, 'createElement').and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        service.translateSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('translateSelection should not call createSVGTransform if transformList.numberOfItems > 0 && getItem().type === SVGTransform.SVG_TRANSFORM_TRANSLATE ', () => {
        
        const mockSVGTransform = {
            type : SVGTransform.SVG_TRANSFORM_TRANSLATE,
            setTranslate: () => null,
            matrix: {
                e : 0,
                f : 0,
            }
            
        } as (unknown) as SVGTransform;

        const mockSVGTranformList = {
            numberOfItems : 5,
            getItem : () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown) as SVGTransformList;
        
        const mockSVGGelement = {
            transform : {
                baseVal : mockSVGTranformList,
            }
        } as (unknown) as SVGGElement;

        service.selection = new Set();
        service.selection.add(mockSVGGelement);

        const mockTranslate = {
            setTranslate : () => null,
        } as (unknown) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform : () => mockTranslate,
        } as SVGSVGElement

        spyOn(service.renderer, 'createElement').and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        service.translateSelection();

        expect(spy).toHaveBeenCalled();
    });

    // HANDLERS AND MOUSE EVENTS

    it('handleLeftMouseDrag should call checkSelection if this.isSelecting', () => {
        service.isSelecting = true;
        const spy = spyOn(service, 'checkSelection');

        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should call translateSelection if !this.isSelecting and !mouseInControlPoint', () => {
        service.isSelecting = false;
        spyOn(service, 'mouseIsInControlPoint').and.returnValue(false);
        const spy = spyOn(service, 'translateSelection');
        
        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
    });

    it('handleRightMouseDrag should call checkSelection if this.isSelecting', () => {
        const spy = spyOn(service, 'checkSelection');
        service.isSelecting = true;

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleLeftMouseDrag if isLeftMouseDown', () => {
        const spy = spyOn(service, 'handleLeftMouseDrag');
        service.isLeftMouseDown = true;

        service.onMouseMove(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleRightMouseDrag if isRightMouseDown', () => {
        const spy = spyOn(service, 'handleRightMouseDrag');
        service.isRightMouseDown = true;

        service.onMouseMove(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('handleLeftMouseDown should call singlySelect if isOnTarget and !selection.has()', () => {
        service.isOnTarget = true;
        spyOn(service.selection, 'has').and.returnValue(false);
        const spy = spyOn(service, 'singlySelect');

        service.handleLeftMouseDown();

        expect(spy).toHaveBeenCalled();
    });

    it('handleLeftMouseDown should call clearSelection if !isOnTarget and selection.has() and !mouseIsInControlPoint && !mouseIsInSelectionBox', () => {
        service.isOnTarget = false;
        spyOn(service.selection, 'has').and.returnValue(true);
        spyOn(service, 'mouseIsInControlPoint').and.returnValue(false);
        spyOn(service, 'mouseIsInSelectionBox').and.returnValue(false);
        spyOn(service, 'startSelection').and.returnValue();

        const spy = spyOn(service, 'clearSelection').and.returnValue();

        service.handleLeftMouseDown();

        expect(spy).toHaveBeenCalled();
    });

    it('handleRightMouse', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });
});
