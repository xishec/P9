import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorToolComponent } from './color-tool.component';
//import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

fdescribe('ColorToolComponent', () => {
    let component: ColorToolComponent;
    let fixture: ComponentFixture<ColorToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [ColorToolComponent],
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
    colortool = new ColorToolComponent(new FormBuilder());
    it('should change primaryColorOn to true and return true', () => {
        colortool.primaryColorOn = false;
        colortool.chosePrimaryColor();
        expect(colortool.primaryColorOn).toBeTruthy();
    });
});
