import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';

// import { createKeyBoardEvent } from 'src/classes/test-helpers';
// import { Keys } from 'src/constants/constants';
// import { ToolName } from 'src/constants/tool-constants';
import SpyObj = jasmine.SpyObj;
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { IndexService } from '../../services/server/index/index.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    // const MOCK_KEYBOARD_CONTROL = createKeyBoardEvent(Keys.Control);
    // const MOCK_KEYBOARD_1 = createKeyBoardEvent(Keys.Digit1);
    // const MOCK_KEYBOARD_2 = createKeyBoardEvent(Keys.Digit2);
    // const MOCK_KEYBOARD_3 = createKeyBoardEvent(Keys.Digit3);
    // const MOCK_KEYBOARD_A = createKeyBoardEvent(Keys.a);
    // const MOCK_KEYBOARD_B = createKeyBoardEvent(Keys.b);
    // const MOCK_KEYBOARD_C = createKeyBoardEvent(Keys.c);
    // const MOCK_KEYBOARD_E = createKeyBoardEvent(Keys.e);
    // const MOCK_KEYBOARD_G = createKeyBoardEvent(Keys.g);
    // const MOCK_KEYBOARD_I = createKeyBoardEvent(Keys.i);
    // const MOCK_KEYBOARD_L = createKeyBoardEvent(Keys.l);
    // const MOCK_KEYBOARD_O = createKeyBoardEvent(Keys.o);
    // const MOCK_KEYBOARD_P = createKeyBoardEvent(Keys.p);
    // const MOCK_KEYBOARD_R = createKeyBoardEvent(Keys.r);
    // const MOCK_KEYBOARD_S = createKeyBoardEvent(Keys.s);
    // const MOCK_KEYBOARD_T = createKeyBoardEvent(Keys.t);
    // const MOCK_KEYBOARD_W = createKeyBoardEvent(Keys.w);
    // const MOCK_KEYBOARD_Y = createKeyBoardEvent(Keys.y);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
                {
                    provide: IndexService,
                    useValue: {
                        basicGet: () => new Observable(),
                        pipe: () => new Observable(),
                        subscribe: () => null,
                    },
                },
                {
                    provide: WelcomeModalWindowService,
                    useValue: {
                        currentWelcomeModalWindowClosed: {
                            subscribe: () => null,
                        },
                        getValueFromLocalStorage: () => false,
                    },
                },
                {
                    provide: MatDialogRef,
                    useValue: {
                        afterClosed: () => of('result'),
                    },
                },
                {
                    provide: MatDialog,
                    useValue: {
                        open: (one: any, two: any) => MatDialogRef,
                    },
                },
                {
                    provide: ToolSelectorService,
                    useValue: {
                        changeTool: (arg: string) => null,
                    },
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        currentDisplayNewDrawingModalWindow: {
                            subscribe: () => null,
                        },
                    },
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {
                        currentIsOnInput: {
                            subscribe: () => null,
                        },
                    },
                },
                {
                    provide: KeyboardEvent,
                    useValue: {
                        preventDefault: () => null,
                    },
                },
            ],
            imports: [HttpClientModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should openWelcomeModalWindow if displayWelcomeModalWindow is on', () => {
        const SPY = spyOn(app[`dialog`], 'open').and.returnValue({ afterClosed: () => of() } as any);
        app.displayWelcomeModalWindow = true;
        app.openWelcomeModalWindow();
        expect(SPY).toHaveBeenCalled();
    });

    it('should not openWelcomeModalWindow if displayWelcomeModalWindow is off', () => {
        const SPY = spyOn(app[`dialog`], 'open');
        app.displayWelcomeModalWindow = false;
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should allow shortcut when no drawing modal and focus not on input and no welcome window', () => {
        app.displayWelcomeModalWindow = false;
        app.isOnInput = false;
        expect(app.shouldAllowShortcut()).toBe(true);
    });

    it('should not allow shortcut when drawing modal is on or focus on input or welcome window is on', () => {
        app.modalIsDisplayed = true;
        app.isOnInput = false;

        expect(app.shouldAllowShortcut()).toBe(false);
    });

    // it('should call onControlO', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onControlO(MOCK_KEYBOARD_CONTROL);
    //     app.onControlO(MOCK_KEYBOARD_O);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.NewDrawing);
    // });

    // it('should call onControlS', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onControlS(MOCK_KEYBOARD_CONTROL);
    //     app.onControlS(MOCK_KEYBOARD_S);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Save);
    // });

    // it('should call onControlG', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onControlG(MOCK_KEYBOARD_CONTROL);
    //     app.onControlG(MOCK_KEYBOARD_G);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.ArtGallery);
    // });

    // it('should call onControlE', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onControlE(MOCK_KEYBOARD_CONTROL);
    //     app.onControlE(MOCK_KEYBOARD_E);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Export);
    // });

    // it('should call onC', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onC(MOCK_KEYBOARD_C);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Pencil);
    // });

    // it('should call onW', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onW(MOCK_KEYBOARD_W);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Brush);
    // });

    // it('should call onP', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onP(MOCK_KEYBOARD_P);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Quill);
    // });

    // it('should call onY', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onY(MOCK_KEYBOARD_Y);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Pen);
    // });

    // it('should call onA', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onA(MOCK_KEYBOARD_A);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.SprayCan);
    // });

    // it('should call on1', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.on1(MOCK_KEYBOARD_1);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Rectangle);
    // });

    // it('should call on2', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.on2(MOCK_KEYBOARD_2);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Ellipsis);
    // });

    // it('should call on3', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.on3(MOCK_KEYBOARD_3);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Polygon);
    // });

    // it('should call onL', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onL(MOCK_KEYBOARD_L);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Line);
    // });

    // it('should call onT', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onT(MOCK_KEYBOARD_T);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Text);
    // });

    // it('should call onR', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onR(MOCK_KEYBOARD_R);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.ColorApplicator);
    // });

    // it('should call onB', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onB(MOCK_KEYBOARD_B);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Fill);
    // });

    // it('should call onE', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onE(MOCK_KEYBOARD_E);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Eraser);
    // });

    // it('should call onI', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onI(MOCK_KEYBOARD_I);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Dropper);
    // });

    // it('should call onS', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => true;
    //     app.onS(MOCK_KEYBOARD_S);
    //     expect(SPY).toHaveBeenCalledWith(ToolName.Selection);
    // });

    // it('should not call onControlS when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onControlS(MOCK_KEYBOARD_CONTROL);
    //     app.onControlS(MOCK_KEYBOARD_S);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Save);
    // });

    // it('should not call onControlG when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onControlG(MOCK_KEYBOARD_CONTROL);
    //     app.onControlG(MOCK_KEYBOARD_G);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.ArtGallery);
    // });

    // it('should not call onControlE when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onControlE(MOCK_KEYBOARD_CONTROL);
    //     app.onControlE(MOCK_KEYBOARD_E);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Export);
    // });

    // it('should not call onC when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onC(MOCK_KEYBOARD_C);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Pencil);
    // });

    // it('should not call onW when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onW(MOCK_KEYBOARD_W);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Brush);
    // });

    // it('should not call onP when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onP(MOCK_KEYBOARD_P);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Quill);
    // });

    // it('should not call onY when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onY(MOCK_KEYBOARD_Y);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Pen);
    // });

    // it('should not call onA when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onA(MOCK_KEYBOARD_A);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.SprayCan);
    // });

    // it('should not call on1 when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.on1(MOCK_KEYBOARD_1);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Rectangle);
    // });

    // it('should not call on2 when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.on2(MOCK_KEYBOARD_2);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Ellipsis);
    // });

    // it('should not call on3 when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.on3(MOCK_KEYBOARD_3);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Polygon);
    // });

    // it('should not call onL when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onL(MOCK_KEYBOARD_L);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Line);
    // });

    // it('should not call onT when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onT(MOCK_KEYBOARD_T);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Text);
    // });

    // it('should not call onR when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onR(MOCK_KEYBOARD_R);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.ColorApplicator);
    // });

    // it('should not call onB when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onB(MOCK_KEYBOARD_B);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Fill);
    // });

    // it('should not call onE when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onE(MOCK_KEYBOARD_E);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Eraser);
    // });

    // it('should not call onI when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onI(MOCK_KEYBOARD_I);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Dropper);
    // });

    // it('should not call onS when not allowed', () => {
    //     const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
    //     app.shouldAllowShortcut = () => false;
    //     app.onS(MOCK_KEYBOARD_S);
    //     expect(SPY).not.toHaveBeenCalledWith(ToolName.Selection);
    // });
});
