import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material';
import {
    createKeyBoardEvent,
    createMockSVGElement,
    createMockSVGTextElement,
    createMockSVGTSpanElement,
    createMouseEvent,
} from 'src/classes/test-helpers.spec';
import { Keys } from 'src/constants/constants';
import { FONT_ALIGN, HTMLAttribute, TEXT_CURSOR } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { TextToolService } from './text-tool.service';

describe('TextToolService', () => {
    let injector: TestBed;
    let service: TextToolService;
    let attServ: AttributesManagerService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;
    let enterKeyboardEvent: KeyboardEvent;
    let backspaceKeyboardEvent: KeyboardEvent;

    let spyOnsetAttribute: jasmine.Spy;
    let spyOnsetProperty: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TextToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                        insertBefore: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        push: () => null,
                        currentStackTarget: {
                            subscribe: () => null,
                        },
                        getElementByPosition: () => {
                            const mockSVGGElement = {
                                getAttribute: () => null,
                            };
                            return (mockSVGGElement as unknown) as SVGGElement;
                        },
                        removeElementByPosition: () => null,
                        getDrawStackLength: () => 1,
                        drawStack: () => {
                            const mockdrawStack = {
                                getAttribute: () => null,
                            };
                            return (mockdrawStack as unknown) as SVGGElement[];
                        },
                        renderer: () => {
                            const mockrenderer = {};
                            return (mockrenderer as unknown) as Renderer2;
                        },
                        changeTargetElement: () => null,
                        delete: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 1;
                                const boundtop = 1;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
                {
                    provide: AttributesManagerService,
                    useValue: {
                        isWritingState: { next: () => null },
                    },
                },
                {
                    provide: MatSnackBar,
                    useValue: {
                        open: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(TextToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        attServ = injector.get<AttributesManagerService>(AttributesManagerService as Type<AttributesManagerService>);

        service.attributesManagerService = attServ;

        service.textBox = createMockSVGTextElement();
        leftMouseEvent = createMouseEvent(10, 10, 0);
        rightMouseEvent = createMouseEvent(10, 10, 2);
        enterKeyboardEvent = createKeyBoardEvent(Keys.Enter);
        backspaceKeyboardEvent = createKeyBoardEvent(Keys.Backspace);

        spyOnsetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnsetProperty = spyOn(service.renderer, 'setProperty');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(attServ).toBeDefined();
    });

    it('getXPos should return a number that is smaller than the original number', () => {
        expect(service.getXPos(2)).toBeLessThan(2);
    });

    it('getYPos should return a number that is smaller than the original number', () => {
        expect(service.getYPos(2)).toBeLessThan(2);
    });

    it('updateStyle with fill should change the fontColor of fontInfo', () => {
        service.updateStyle(HTMLAttribute.fill, '#' + 'ffffff');

        expect(service.fontInfo.fontColor).toEqual('#ffffff');
    });

    it('updateStyle with font_family should change the fontType', () => {
        service.updateStyle(HTMLAttribute.font_family, 'Times');

        expect(service.fontInfo.fontFamily).toEqual('Times');
    });

    it('updateStyle with font_size should change the fontSize', () => {
        service.updateStyle(HTMLAttribute.font_size, '15');

        expect(service.fontInfo.fontSize).toEqual('15');
    });

    it('updateStyle should call updatePreviewBox if isWriting is true', () => {
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.isWriting = true;

        service.updateStyle(HTMLAttribute.font_family, 'Times');

        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });

    it('updateAlign middle should change the textBoxXPosition to bBoxAnchorLeft + bBoxWidth / 2', () => {
        service.isWriting = true;
        service.bBoxAnchorLeft = 2;
        service.bBoxWidth = 2;

        service.updateAlign(FONT_ALIGN.Middle);

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft + service.bBoxWidth / 2);
        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('updateAlign start should change the textBoxXPosition to bBoxAnchorLeft', () => {
        service.isWriting = true;
        service.bBoxAnchorLeft = 2;

        service.updateAlign(FONT_ALIGN.Start);

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft);
        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('updateAlign end should change the textBoxXPosition to bBoxAnchorLeft + bBoxWidth', () => {
        service.isWriting = true;
        service.bBoxAnchorLeft = 2;
        service.bBoxWidth = 2;

        service.updateAlign(FONT_ALIGN.End);

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft + service.bBoxWidth);
        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('updateItalic should change the fontStyle', () => {
        service.updateItalic(true);

        expect(service.fontInfo.fontStyle).toEqual('italic');
    });

    it('updateItalic should change the fontStyle and call updatePreviewBox if isWriting is true', () => {
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.isWriting = true;

        service.updateItalic(false);

        expect(service.fontInfo.fontStyle).toEqual('normal');
        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });

    it('updateBold should change the fontStyle', () => {
        service.updateBold(true);

        expect(service.fontInfo.fontWeight).toEqual('bold');
    });

    it('updateBold should change the fontStyle and call updatePreviewBox if isWriting is true', () => {
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.isWriting = true;

        service.updateBold(false);

        expect(service.fontInfo.fontWeight).toEqual('normal');
        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });

    it('ifClickInTextBox return false if not clicked in textBox', () => {
        expect(service.ifClickInTextBox(1, 1)).toEqual(false);
    });

    it('onMouseMove should return undefined if onMouseMove is not implemented', () => {
        expect(service.onMouseMove(leftMouseEvent)).toBeUndefined();
    });

    it('updatePreviewBox should call setAttribute', () => {
        service.updatePreviewBox();

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('initPreviewRect should call setAttribute', () => {
        service.initPreviewRect();

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('createTextBox should call setAttribute', () => {
        service.fontInfo.fontSize = '12';
        service.createTextBox(3, 3);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('createNewLine should call setAttribute', () => {
        service.textBoxXPosition = 1;

        service.createNewLine();

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('createNewLine should call setAttribute and setProperty if tspanStack.length is not zero', () => {
        service.tspans.push(createMockSVGTSpanElement());
        service.textBoxXPosition = 1;

        service.createNewLine();

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOnsetProperty).toHaveBeenCalled();
    });

    it('removeLine should call removeChild', () => {
        const spyOnremoveChild = spyOn(service.renderer, 'removeChild');
        const spyOnfindLinePosition = spyOn(service.textCursor, 'findLinePosition').and.returnValue(1);
        service.tspans.push(createMockSVGTSpanElement());
        service.tspans.push(createMockSVGTSpanElement());
        service.currentLine = createMockSVGTSpanElement();

        service.removeLine();

        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOnfindLinePosition).toHaveBeenCalled();
    });

    it('erase should call removeLine', () => {
        const spyOnremoveLine = spyOn(service, 'removeLine');
        service.text = 'test';
        service.currentLine = createMockSVGTSpanElement();

        service.erase();

        expect(spyOnremoveLine).toHaveBeenCalled();
    });

    it('erase should change text', () => {
        service.text = 'test';

        service.erase();

        expect('test').not.toEqual(service.text);
    });

    it('onMouseDown should call updatePreviewBox if isWriting is false and left button is clicked', () => {
        service.isWriting = false;
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.fontInfo.fontSize = '10';
        spyOn(service, 'createTextBox').withArgs(9, 9);

        service.onMouseDown(leftMouseEvent);

        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });

    it('onMouseDown should call cleanUp ifClickInTextBox is false ', () => {
        service.isWriting = true;
        const spyOnuifClickInTextBox = spyOn(service, 'ifClickInTextBox').and.returnValue(false);
        const spyOncleanUp = spyOn(service, 'cleanUp');

        service.onMouseDown(rightMouseEvent);

        expect(spyOnuifClickInTextBox).toHaveBeenCalled();
        expect(spyOncleanUp).toHaveBeenCalled();
    });

    it('onMouseUp should return undefined if onMouseUp is not implemented', () => {
        expect(service.onMouseUp(rightMouseEvent)).toBeUndefined();
    });

    it('onMouseEnter should return undefined if onMouseEnter is not implemented', () => {
        expect(service.onMouseEnter(leftMouseEvent)).toBeUndefined();
    });

    it('onMouseLeave should return undefined if onMouseLeave is not implemented', () => {
        expect(service.onMouseLeave(leftMouseEvent)).toBeUndefined();
    });

    it('onKeyUp should return undefined if onKeyUp is not implemented', () => {
        expect(service.onKeyUp(enterKeyboardEvent)).toBeUndefined();
    });

    it('onKeyDown should call createNewLine if key is enter', () => {
        service.isWriting = true;
        service.textBoxXPosition = 2;

        service.onKeyDown(enterKeyboardEvent);

        expect(spyOnsetProperty).toHaveBeenCalled();
    });

    it('onKeyDown should stop execution if isWriting is false', () => {
        service.isWriting = false;

        service.onKeyDown(backspaceKeyboardEvent);

        expect(spyOnsetProperty).toHaveBeenCalledTimes(0);
    });

    it('moveCursor should call swapToAnotherLine if isAtStartOfLine is true', () => {
        const spyOnisAtStartOfLine = spyOn(service.textCursor, 'isAtStartOfLine').and.returnValue(true);
        const spyOnswapToAnotherLine = spyOn(service.textCursor, 'swapToAnotherLine');

        service.moveCursor(Keys.ArrowLeft);

        expect(spyOnisAtStartOfLine).toHaveBeenCalled();
        expect(spyOnswapToAnotherLine).toHaveBeenCalled();
    });

    it('moveCursor should call swapInCurrentLine if isAtStartOfLine is false', () => {
        const spyOnisAtStartOfLine = spyOn(service.textCursor, 'isAtStartOfLine').and.returnValue(false);
        const spyOnswapInCurrentLine = spyOn(service.textCursor, 'swapInCurrentLine');

        service.moveCursor(Keys.ArrowLeft);

        expect(spyOnisAtStartOfLine).toHaveBeenCalled();
        expect(spyOnswapInCurrentLine).toHaveBeenCalled();
    });

    it('moveCursor should call swapToAnotherLine if isAtEndOfLine is true and if key is not ArrowLeft', () => {
        const spyOnisAtEndOfLine = spyOn(service.textCursor, 'isAtEndOfLine').and.returnValue(true);
        const spyOnswapToAnotherLine = spyOn(service.textCursor, 'swapToAnotherLine');

        service.moveCursor(Keys.ArrowRight);

        expect(spyOnisAtEndOfLine).toHaveBeenCalled();
        expect(spyOnswapToAnotherLine).toHaveBeenCalled();
    });

    it('moveCursor should call swapInCurrentLine if isAtEndOfLine is false and if key is not ArrowLeft', () => {
        const spyOnisAtEndOfLine = spyOn(service.textCursor, 'isAtEndOfLine').and.returnValue(false);
        const spyOnswapInCurrentLine = spyOn(service.textCursor, 'swapInCurrentLine');

        service.moveCursor(Keys.ArrowRight);

        expect(spyOnisAtEndOfLine).toHaveBeenCalled();
        expect(spyOnswapInCurrentLine).toHaveBeenCalled();
    });

    it('addText should stop execution if the length of the key is longer than 1', () => {
        service.text = 'test';

        service.addText(Keys.Enter);

        expect(service.text).toEqual('test');
    });

    it('addText should change text if the length of the key is equal to 1', () => {
        service.text = 'test';

        service.addText(Keys.a);

        expect(service.text.length).toBeGreaterThan('test'.length);
    });

    it('openSnackBar should call open on snackBar', () => {
        const spyOnopen = spyOn(service.snackBar, 'open');

        service.openSnackBar();

        expect(spyOnopen).toHaveBeenCalled();
    });

    it('cleanUp should not "cleanup" if gWrap and tspan are defined', () => {
        service.text = 'test';

        service.cleanUp();

        expect(service.text).toEqual('test');
    });

    it('cleanUp should call removeChild on gWrap twice if the last char is the cursor', () => {
        service.text = TEXT_CURSOR;
        service.tspans.push(createMockSVGTSpanElement());
        service.gWrap = createMockSVGElement();
        const spyOnremoveChild = spyOn(service.renderer, 'removeChild');

        service.cleanUp();

        expect(service.text).toEqual('');
        expect(spyOnremoveChild).toHaveBeenCalledTimes(2);
    });

    it('cleanUp should call removeChild on gWrap once if the last char is the cursor', () => {
        service.text = 'test';
        service.tspans.push(createMockSVGTSpanElement());
        service.gWrap = createMockSVGElement();
        const spyOnremoveChild = spyOn(service.renderer, 'removeChild');

        service.cleanUp();

        expect(service.text).toEqual('');
        expect(spyOnremoveChild).toHaveBeenCalledTimes(1);
    });
});
