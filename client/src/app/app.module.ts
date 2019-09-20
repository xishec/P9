import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// *********** Angular Material ******************
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
} from '@angular/material';

// ************************************************
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *************** Services **********************
import { DrawingModalWindowService } from './services/drawing-modal-window/drawing-modal-window.service';
import { ToolsService } from './services/tools/tools.service';
// ************************************************

import { ColorPickerComponent } from './components/drawing-modal-window/color-picker/color-picker.component';
import { DrawingModalWindowComponent } from './components/drawing-modal-window/drawing-modal-window.component';
import { AttributePanelComponent } from './components/sidebar-tools/attribute-panel/attribute-panel.component';
import { SidebarToolsComponent } from './components/sidebar-tools/sidebar-tools.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributePanelComponent,
        WorkZoneComponent,
        SidebarToolsComponent,
        DrawingModalWindowComponent,
        ColorPickerComponent,
    ],
    imports: [
        MatSliderModule,
        MatCheckboxModule,
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
    ],
    providers: [ToolsService, DrawingModalWindowService],
    bootstrap: [AppComponent],
})
export class AppModule {}
