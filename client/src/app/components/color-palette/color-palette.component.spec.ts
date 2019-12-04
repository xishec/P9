import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { COLOR_TYPE, DEFAULT_WHITE } from 'src/constants/color-constants';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorToolService: ColorToolService;

    const testColor = '23fe45';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [],
        })
            .overrideComponent(ColorPaletteComponent, {
                set: {
                    providers: [
                        {
                            provide: ColorToolService,
                            useValue: {
                                changeColorOnFocus: () => null,
                                addColorToQueue: () => null,
                                changeShowColorPalette: () => null,
                                changeSelectedColorType: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;

        colorToolService = fixture.debugElement.injector.get(ColorToolService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update preview color when a color in queue is clicked', () => {
        component.onClickColorQueueButton(testColor);
        expect(component.previewColor).toEqual(testColor);
    });

    it('should call Color Tool Service changeColorOnFocus function when submit button is pressed', () => {
        const SPY = spyOn(colorToolService, 'changeColorOnFocus');
        component.onSubmit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Color Tool Service addColorToQueue function when submit button is pressed', () => {
        const SPY = spyOn(colorToolService, 'addColorToQueue');
        component.onSubmit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Color Tool Service changeShowColorPalette function when submit button is pressed', () => {
        const SPY = spyOn(colorToolService, 'changeShowColorPalette');
        component.onSubmit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Color Tool Service changeSelectedColorType function when submit button is pressed', () => {
        const SPY = spyOn(colorToolService, 'changeSelectedColorType');
        component.onSubmit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Color Tool Service changShowColorPalette function when cancel button is pressed', () => {
        const SPY = spyOn(colorToolService, 'changeShowColorPalette');
        component.onCancel();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Color Tool Service changeSelectedColorType function when cancel button is pressed', () => {
        const SPY = spyOn(colorToolService, 'changeSelectedColorType');
        component.onCancel();
        expect(SPY).toHaveBeenCalled();
    });

    it('should return Icon Style with the right preview color when getUserColorIcon funtion is called', () => {
        component.previewColor = testColor;
        const iconStyle = component.getUserColorIcon();
        expect(iconStyle).toEqual({ backgroundColor: '#' + testColor });
    });
});

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
    }));

    it('should change previewColor onInit', async(
        inject([ColorToolService], (colorToolService: ColorToolService) => {
            component.ngOnInit();
            fixture
                .whenStable()
                .then(() => {
                    expect(component.previewColor).toBeDefined();
                    colorToolService.previewColor.next(DEFAULT_WHITE);
                    return fixture.whenStable();
                })
                .then(() => {
                    expect(component.previewColor).toEqual(DEFAULT_WHITE);
                });
        }),
    ));

    it('should change selectedColorType onInit', async(
        inject([ColorToolService], (colorToolService: ColorToolService) => {
            component.ngOnInit();
            fixture
                .whenStable()
                .then(() => {
                    expect(component.selectedColorType).toBeDefined();
                    colorToolService.selectedColorType.next(COLOR_TYPE.BackgroundColor);
                    return fixture.whenStable();
                })
                .then(() => {
                    expect(component.selectedColorType).toEqual(COLOR_TYPE.BackgroundColor);
                });
        }),
    ));
});
