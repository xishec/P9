import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app/app.component';

// *********** Angular Material ******************
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
} from '@angular/material';
// ************************************************
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *************** Services **********************
import { DrawingModalWindowService } from './services/drawing-modal-window/drawing-modal-window.service';
import { ColorToolService } from './services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from './services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from './services/welcome-modal-window/welcome-modal-window.service';
// ************************************************

import { AttributePanelComponent } from '@attribute-panel/attribute-panel.component';
import { BrushAttributesComponent } from '@attribute-panel/brush-attributes/brush-attributes.component';
import { ColorApplicatorAttributesComponent } from '@attribute-panel/color-applicator-attributes/color-applicator-attributes.component';
import { ColorAttributesComponent } from '@attribute-panel/color-attributes/color-attributes.component';
import { PencilAttributesComponent } from '@attribute-panel/pencil-attributes/pencil-attributes.component';
import { RectangleAttributesComponent } from '@attribute-panel/rectangle-attributes/rectangle-attributes.component';
import { ColorNumericValuesComponent } from './components/color-palette/color-numeric-values/color-numeric-values.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-palette/color-picker/color-picker.component';
import { ColorQueueComponent } from './components/color-palette/color-queue/color-queue.component';
import { DrawingModalWindowComponent } from './components/drawing-modal-window/drawing-modal-window.component';
import { DropperAttributesComponent } from './components/sidebar-tools/attribute-panel/dropper-attributes/dropper-attributes.component';
import { LineAttributesComponent } from './components/sidebar-tools/attribute-panel/line-attributes/line-attributes.component';
import { StampAttributesComponent } from './components/sidebar-tools/attribute-panel/stamp-attributes/stamp-attributes.component';
import { SidebarToolsComponent } from './components/sidebar-tools/sidebar-tools.component';
import { WelcomeModalWindowComponent } from './components/welcome-modal-window/welcome-modal-window.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';
import { DropperAttributesComponent } from './components/sidebar-tools/attribute-panel/dropper-attributes/dropper-attributes.component';
import { EllipsisAttributesComponent } from './components/sidebar-tools/attribute-panel/ellipsis-attributes/ellipsis-attributes.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributePanelComponent,
        WorkZoneComponent,
        SidebarToolsComponent,
        DrawingModalWindowComponent,
        ColorPaletteComponent,
        ColorPickerComponent,
        WelcomeModalWindowComponent,
        ColorQueueComponent,
        PencilAttributesComponent,
        RectangleAttributesComponent,
        BrushAttributesComponent,
        ColorAttributesComponent,
        ColorApplicatorAttributesComponent,
        ColorNumericValuesComponent,
        LineAttributesComponent,
        StampAttributesComponent,
        DropperAttributesComponent,
        EllipsisAttributesComponent,
    ],
    imports: [
        MatSliderModule,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonToggleModule,
        MatButtonModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatTooltipModule,
        MatSliderModule,
        MatSelectModule,
        MatFormFieldModule,
    ],
    entryComponents: [WelcomeModalWindowComponent, DrawingModalWindowComponent],
    providers: [ToolSelectorService, DrawingModalWindowService, WelcomeModalWindowService, ColorToolService],
    bootstrap: [AppComponent],
})
export class AppModule {}
