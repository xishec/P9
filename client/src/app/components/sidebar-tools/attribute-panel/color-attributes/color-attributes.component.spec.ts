import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorAttributesComponent } from './color-attributes.component';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorType } from 'src/constants/color-constants';

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
        let changeSelectedColorTypeSpy = spyOn(colorToolService, 'changeSelectedColorType');
        let changeShowColorPaletteSpy = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickBackgroundColor();

        expect(changeSelectedColorTypeSpy).toHaveBeenCalled();
        expect(changeShowColorPaletteSpy).toHaveBeenCalled();
    });

    it('onClickPrimaryColor should call changeSelectedColorType and changeShowColorPalette when clicked', () => {
        let changeSelectedColorTypeSpy = spyOn(colorToolService, 'changeSelectedColorType');
        let changeShowColorPaletteSpy = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickPrimaryColor();

        expect(changeSelectedColorTypeSpy).toHaveBeenCalled();
        expect(changeShowColorPaletteSpy).toHaveBeenCalled();
    });

    it('onClickSecondaryColor should call changeSelectedColorType and changeShowColorPalette when clicked', () => {
        let changeSelectedColorTypeSpy = spyOn(colorToolService, 'changeSelectedColorType');
        let changeShowColorPaletteSpy = spyOn(colorToolService, 'changeShowColorPalette');

        component.onClickSecondaryColor();

        expect(changeSelectedColorTypeSpy).toHaveBeenCalled();
        expect(changeShowColorPaletteSpy).toHaveBeenCalled();
    });

    it('switchColors should call switchPrimarySecondary when clicked', () => {
        let spy = spyOn(colorToolService, 'switchPrimarySecondary');

        component.switchColors();

        expect(spy).toHaveBeenCalled();
    });

    it('getBackgroundColorIcon should return background color with border and transform value when selectedColorType is background-color ', () => {
        component.selectedColorType = ColorType.backgroundColor;
        expect(component.getBackgroundColorIcon()).toEqual({
            backgroundColor: '#' + component.backgroundColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getBackgroundColorIcon should return background color when  selectedColorType is undefined ', () => {
        component.selectedColorType = undefined;
        expect(component.getBackgroundColorIcon()).toEqual({
            backgroundColor: '#' + component.backgroundColor,
        });
    });

    it('getPrimaryColorIcon should return background color with border and transform value when selectedColorType is primary-color ', () => {
        component.selectedColorType = ColorType.primaryColor;
        expect(component.getPrimaryColorIcon()).toEqual({
            backgroundColor: '#' + component.primaryColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getPrimaryColorIcon should return background color when  selectedColorType is undefined ', () => {
        component.selectedColorType = undefined;
        expect(component.getPrimaryColorIcon()).toEqual({
            backgroundColor: '#' + component.primaryColor,
        });
    });

    it('getSecondaryColorIcon should return background color with border and transform value when selectedColorType is secondary-color  ', () => {
        component.selectedColorType = ColorType.secondaryColor;
        expect(component.getSecondaryColorIcon()).toEqual({
            backgroundColor: '#' + component.secondaryColor,
            border: 'solid 1px black',
            transform: 'scale(1.3)',
        });
    });

    it('getSecondaryColorIcon should return background color when  selectedColorType is undefined ', () => {
        component.selectedColorType = undefined;
        expect(component.getSecondaryColorIcon()).toEqual({
            backgroundColor: '#' + component.secondaryColor,
        });
    });
});
