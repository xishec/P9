import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorToolComponent } from './color-tool.component';
//import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('ColorToolComponent', () => {
    let component: ColorToolComponent;
    let fixture: ComponentFixture<ColorToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ColorToolComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let colortool: ColorToolComponent;
    let colorToolService: ColorToolService = new ColorToolService();
    let formBuilder: FormBuilder = new FormBuilder();
    colortool = new ColorToolComponent(formBuilder, colorToolService);

    it('should return true when "clicked" on the color wheel button', () => {
        colortool.onClickColorWheel();
        expect(colortool.displayColorWheel).toBeTruthy();
    });
});
