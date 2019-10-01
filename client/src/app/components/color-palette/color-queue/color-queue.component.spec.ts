import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorQueueComponent } from './color-queue.component';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

describe('ColorQueueComponent', () => {
    let component: ColorQueueComponent;
    let fixture: ComponentFixture<ColorQueueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorQueueComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorQueueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should getColorIcon', () => {
        expect(component.getColorIcon(DEFAULT_WHITE).backgroundColor).toEqual('#' + DEFAULT_WHITE);
    });

    it('should onClickColorButton emit to be call', () => {
        const SPY = spyOn(component.clickedColorButton, 'emit');
        component.onClickColorButton(DEFAULT_WHITE);
        expect(SPY).toHaveBeenCalled();
    });
});
