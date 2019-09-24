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
    MatInputModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
} from '@angular/material';
// ************************************************
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *************** Services **********************
import { DrawingModalWindowService } from './services/drawing-modal-window/drawing-modal-window.service';
import { ToolsService } from './services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from './services/welcome-modal-window/welcome-modal-window.service';
// ************************************************

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawingModalWindowComponent } from './components/drawing-modal-window/drawing-modal-window.component';
import { AttributePanelComponent } from './components/sidebar-tools/attribute-panel/attribute-panel.component';
import { SidebarToolsComponent } from './components/sidebar-tools/sidebar-tools.component';
import { WelcomeModalWindowComponent } from './components/welcome-modal-window/welcome-modal-window.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';
import { PencilAttributesComponent } from './components/sidebar-tools/attribute-panel/pencil-attributes/pencil-attributes.component';
import { RectangleAttributesComponent } from './components/sidebar-tools/attribute-panel/rectangle-attributes/rectangle-attributes.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributePanelComponent,
        WorkZoneComponent,
        SidebarToolsComponent,
        DrawingModalWindowComponent,
        ColorPickerComponent,
        WelcomeModalWindowComponent,
        PencilAttributesComponent,
        RectangleAttributesComponent,
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
    entryComponents: [WelcomeModalWindowComponent],
    providers: [ToolsService, DrawingModalWindowService, WelcomeModalWindowService],
    bootstrap: [AppComponent],
})
export class AppModule {}
