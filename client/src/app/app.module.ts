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
} from '@angular/material';

// ************************************************
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *************** Services **********************
import { DrawingModalWindowService } from './services/drawing-modal-window/drawing-modal-window.service';
import { ToolsService } from './services/tools/tools.service';
import { WelcomeModalWindowService } from './services/welcome-modal-window/welcome-modal-window.service';
// ************************************************

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawingModalWindowComponent } from './components/drawing-modal-window/drawing-modal-window.component';
import { AttributePanelComponent } from './components/sidebar-tools/attribute-panel/attribute-panel.component';
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
        ColorPickerComponent,
        WelcomeModalWindowComponent,
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
    ],
    entryComponents: [WelcomeModalWindowComponent],
    providers: [ToolsService, DrawingModalWindowService, WelcomeModalWindowService],
    bootstrap: [AppComponent],
})
export class AppModule {}
