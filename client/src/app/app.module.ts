import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// *********** Material Angular ******************
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// ************************************************

// *************** Services **********************
import { DrawingModalWindow } from './services/drawing-modal-window/drawing-modal-window.service';
import { ToolsService } from './services/tootls/tools.service';
// ************************************************

import { DrawingModalWindowComponent } from './components/app/drawing-modal-window/drawing-modal-window.component';
import { AttributePanelComponent } from './components/app/sidebar-tools/attribute-panel/attribute-panel.component';
import { SidebarToolsComponent } from './components/app/sidebar-tools/sidebar-tools.component';
import { WorkZoneComponent } from './components/app/work-zone/work-zone.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributePanelComponent,
        WorkZoneComponent,
        SidebarToolsComponent,
        DrawingModalWindowComponent,
    ],
    imports: [
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
    ],
    providers: [ToolsService, DrawingModalWindow],
    bootstrap: [AppComponent],
})
export class AppModule {}
