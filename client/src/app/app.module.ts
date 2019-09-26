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
import { ToolSelectorService } from './services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from './services/welcome-modal-window/welcome-modal-window.service';
// ************************************************

import { AttributePanelComponent } from '@attribute-panel/attribute-panel.component';
import { BrushAttributesComponent } from '@attribute-panel/brush-attributes/brush-attributes.component';
import { PencilAttributesComponent } from '@attribute-panel/pencil-attributes/pencil-attributes.component';
import { RectangleAttributesComponent } from '@attribute-panel/rectangle-attributes/rectangle-attributes.component';
import { ColorPickerComponent } from './components/color-tool/color-picker/color-picker.component';
import { ColorQueueComponent } from './components/color-tool/color-queue/color-queue.component';
import { ColorToolComponent } from './components/color-tool/color-tool.component';
import { DrawingModalWindowComponent } from './components/drawing-modal-window/drawing-modal-window.component';
import { SidebarToolsComponent } from './components/sidebar-tools/sidebar-tools.component';
import { WelcomeModalWindowComponent } from './components/welcome-modal-window/welcome-modal-window.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributePanelComponent,
        WorkZoneComponent,
        SidebarToolsComponent,
        DrawingModalWindowComponent,
        ColorToolComponent,
        ColorPickerComponent,
        WelcomeModalWindowComponent,
        ColorQueueComponent,
        PencilAttributesComponent,
        RectangleAttributesComponent,
        BrushAttributesComponent,
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
    providers: [ToolSelectorService, DrawingModalWindowService, WelcomeModalWindowService, ColorToolComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
