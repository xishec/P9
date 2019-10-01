import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorType, DEFAULT_WHITE } from 'src/constants/color-constants';
import { ColorAttributesComponent } from './color-attributes.component';
import { BehaviorSubject } from 'rxjs';

fdescribe('ColorAttributesComponent', () => {
    let component: ColorAttributesComponent;
    let fixture: ComponentFixture<ColorAttributesComponent>;
    let colorToolService: ColorToolService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorAttributesComponent],
        }).overrideComponent(ColorAttributesComponent, {
            set: {
                providers: [
                    {
                        provide: ColorToolService,
                        useValue: {
                            backgroundColor: new BehaviorSubject<string>(DEFAULT_WHITE),
                            primaryColor: new BehaviorSubject<string>(DEFAULT_WHITE),
                            secondaryColor: new BehaviorSubject<string>(DEFAULT_WHITE),
                            selectedColorType: new BehaviorSubject<ColorType | undefined>(undefined),
                            changeSelectedColorType: () => null,
                            changeShowColorPalette: () => null,
                            switchPrimarySecondary: () => null,
                        },
                    },
                ],
            },
        });
        fixture = TestBed.createComponent(ColorAttributesComponent);
        component = fixture.componentInstance;

        colorToolService = fixture.debugElement.injector.get<ColorToolService>(ColorToolService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onClickBackgroundColor should call changeSelectedColorType and changeShowColorPalette when clicked', () => {
        const CHANGE_SELECTED_COLOR_TYPE_SPY = spyOn(colorToolService, 'changeSelectedColorType');
        const CHANGE_SHOW_COLOR_PALETTE_SPY = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickBackgroundColor();

        expect(CHANGE_SELECTED_COLOR_TYPE_SPY).toHaveBeenCalled();
        expect(CHANGE_SHOW_COLOR_PALETTE_SPY).toHaveBeenCalled();
    });

    it('onClickPrimaryColor should call changeSelectedColorType and changeShowColorPalette when clicked', () => {
        const CHANGE_SELECTED_COLOR_TYPE_SPY = spyOn(colorToolService, 'changeSelectedColorType');
        const CHANGE_SHOW_COLOR_PALETTE_SPY = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickPrimaryColor();

        expect(CHANGE_SELECTED_COLOR_TYPE_SPY).toHaveBeenCalled();
        expect(CHANGE_SHOW_COLOR_PALETTE_SPY).toHaveBeenCalled();
    });

    it('onClickSecondaryColor should call changeSelectedColorType and changeShowColorPalette when clicked', () => {
        const CHANGE_SELECTED_COLOR_TYPE_SPY = spyOn(colorToolService, 'changeSelectedColorType');
        const CHANGE_SHOW_COLOR_PALETTE_SPY = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickSecondaryColor();

        expect(CHANGE_SELECTED_COLOR_TYPE_SPY).toHaveBeenCalled();
        expect(CHANGE_SHOW_COLOR_PALETTE_SPY).toHaveBeenCalled();
    });

    it('switchColors should call switchPrimarySecondary when clicked', () => {
        const SPY = spyOn(colorToolService, 'switchPrimarySecondary');

        component.switchColors();

        expect(SPY).toHaveBeenCalled();
    });

    it('getBackgroundColorIcon should return background color with border and transform value when selectedColorType is background-color', () => {
        component.selectedColorType = ColorType.backgroundColor;
        expect(component.getBackgroundColorIcon()).toEqual({
            backgroundColor: '#' + component.backgroundColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getBackgroundColorIcon should return background color when  selectedColorType is undefined', () => {
        component.selectedColorType = undefined;
        expect(component.getBackgroundColorIcon()).toEqual({
            backgroundColor: '#' + component.backgroundColor,
        });
    });

    it('getPrimaryColorIcon should return background color with border and transform value when selectedColorType is primary-color', () => {
        component.selectedColorType = ColorType.primaryColor;
        expect(component.getPrimaryColorIcon()).toEqual({
            backgroundColor: '#' + component.primaryColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getPrimaryColorIcon should return background color when  selectedColorType is undefined', () => {
        component.selectedColorType = undefined;
        expect(component.getPrimaryColorIcon()).toEqual({
            backgroundColor: '#' + component.primaryColor,
        });
    });

    it('getSecondaryColorIcon should return background color with border and transform value when selectedColorType is secondary-color', () => {
        component.selectedColorType = ColorType.secondaryColor;
        expect(component.getSecondaryColorIcon()).toEqual({
            backgroundColor: '#' + component.secondaryColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getSecondaryColorIcon should return background color when  selectedColorType is undefined', () => {
        component.selectedColorType = undefined;
        expect(component.getSecondaryColorIcon()).toEqual({
            backgroundColor: '#' + component.secondaryColor,
        });
    });

    it('should change backgroundColor onInit', async(
        inject([ColorToolService], (colorToolService: ColorToolService) => {
            component.ngOnInit();
            fixture
                .whenStable()
                .then(() => {
                    expect(component.backgroundColor).toBeDefined();
                    colorToolService.backgroundColor.next(DEFAULT_WHITE);
                    return fixture.whenStable();
                })
                .then(() => {
                    expect(component.backgroundColor).toEqual(DEFAULT_WHITE);
                });
        }),
    ));
});
