import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material';
import {
    createKeyBoardEvent,
    createMockSVGTextElement,
    createMockSVGTSpanElement,
    createMouseEvent,
} from 'src/classes/test-helpers.spec';
import { Keys } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { TextToolService } from './text-tool.service';

fdescribe('TextToolService', () => {
    let injector: TestBed;
    let service: TextToolService;
    let attServ: AttributesManagerService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;
    let enterKeyboardEvent: KeyboardEvent;
    let backspaceKeyboardEvent: KeyboardEvent;
    //  let arrowRightKeyboardEvent: KeyboardEvent;
    //   let arrowLeftKeyboardEvent: KeyboardEvent;

    let spyOnsetAttribute: jasmine.Spy;

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
                        changeIsWriting: () => null,
                        changeIsOnInput: () => null,
                        isWriting: false,
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
        //  arrowRightKeyboardEvent = createKeyBoardEvent(Keys.ArrowRight);
        //   arrowLeftKeyboardEvent = createKeyBoardEvent(Keys.ArrowLeft);

        spyOnsetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
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

        expect(service.fontInfo.fontType).toEqual('Times');
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

        service.updateAlign('middle');

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft + service.bBoxWidth / 2);
        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('updateAlign start should change the textBoxXPosition to bBoxAnchorLeft', () => {
        service.isWriting = true;
        service.bBoxAnchorLeft = 2;

        service.updateAlign('start');

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft);
        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('updateAlign end should change the textBoxXPosition to bBoxAnchorLeft + bBoxWidth', () => {
        service.isWriting = true;
        service.bBoxAnchorLeft = 2;
        service.bBoxWidth = 2;

        service.updateAlign('end');

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
        const spyOnsetProperty = spyOn(service.renderer, 'setProperty');

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

    // no idea how to make it work
    it('erase should call removeLine', () => {
        const spyOnremoveLine = spyOn(service, 'removeLine');
        service.text = 'test';
        // service.tspanStack.push(createMockSVGTSpanElement());
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

    // it('onKeyDown should call createNewLine if key is enter', () => {
    //     const spyOncreateNewLine = spyOn(service, 'createNewLine').and.returnValue();
    //     service.isWriting = true;

    //     service.onKeyDown(enterKeyboardEvent);

    //     expect(spyOncreateNewLine).toHaveBeenCalled();
    // });

    // it('onKeyDown should call erase if key is Backspace', () => {
    //     const spyOnerase = spyOn(service, 'erase').and.returnValue();
    //     service.isWriting = true;

    //     service.onKeyDown(backspaceKeyboardEvent);

    //     expect(spyOnerase).toHaveBeenCalled();
    // });

    it('onKeyDown should stop execution if isWriting is false', () => {
        service.isWriting = false;
        const spyOnsetProperty = spyOn(service.renderer, 'setProperty').and.returnValue();

        service.onKeyDown(backspaceKeyboardEvent);

        expect(spyOnsetProperty).toHaveBeenCalledTimes(0);
    });

    // it('onKeyDown should call moveCursor if key is ArrowLeft', () => {
    //     const spyOnmoveCursor = spyOn(service, 'moveCursor').and.returnValue();
    //     service.isWriting = true;

    //     service.onKeyDown(arrowLeftKeyboardEvent);

    //     expect(spyOnmoveCursor).toHaveBeenCalled();
    // });

    // it('onKeyDown should call moveCursorRight if key is ArrowRight', () => {
    //     const spyOnmoveCursor = spyOn(service, 'moveCursor').and.returnValue();
    //     service.isWriting = true;

    //     service.onKeyDown(arrowRightKeyboardEvent);

    //     expect(spyOnmoveCursor).toHaveBeenCalled();
    // });

    // TO DO case event.key === ' '

    it('openSnackBar should call open on snackBar', () => {
        const spyOnopen = spyOn(service.snackBar, 'open');

        service.openSnackBar();

        expect(spyOnopen).toHaveBeenCalled();
    });
});
