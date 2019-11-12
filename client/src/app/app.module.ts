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
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';
// ************************************************
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *************** Services **********************
import { DrawingModalWindowService } from './services/drawing-modal-window/drawing-modal-window.service';
import { EventListenerService } from './services/event-listener/event-listener.service';
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
import { LabelFilter } from '../classes/pipes/labelFilter';
import { MySlice } from '../classes/pipes/mySlice';
import { NameFilter } from '../classes/pipes/nameFilter';
import { ToTrustHtmlPipe } from '../classes/pipes/toTrustHtml';
import { ColorNumericValuesComponent } from './components/color-palette/color-numeric-values/color-numeric-values.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-palette/color-picker/color-picker.component';
import { ColorQueueComponent } from './components/color-palette/color-queue/color-queue.component';
import { DrawingModalWindowComponent } from './components/modal-windows/drawing-modal-window/drawing-modal-window.component';
// tslint:disable-next-line: max-line-length
import { ExportFileModalWindowComponent } from './components/modal-windows/export-file-modal-window/export-file-modal-window.component';
import { OpenFileModalWindowComponent } from './components/modal-windows/open-file-modal-window/open-file-modal-window.component';
import { SaveFileModalWindowComponent } from './components/modal-windows/save-file-modal-window/save-file-modal-window.component';
import { WelcomeModalWindowComponent } from './components/modal-windows/welcome-modal-window/welcome-modal-window.component';
import { DropperAttributesComponent } from './components/sidebar-tools/attribute-panel/dropper-attributes/dropper-attributes.component';
import { EllipsisAttributesComponent } from './components/sidebar-tools/attribute-panel/ellipsis-attributes/ellipsis-attributes.component';
import { EraserAttributesComponent } from './components/sidebar-tools/attribute-panel/eraser-attributes/eraser-attributes.component';
import { GridAttributesComponent } from './components/sidebar-tools/attribute-panel/grid-attributes/grid-attributes.component';
import { LineAttributesComponent } from './components/sidebar-tools/attribute-panel/line-attributes/line-attributes.component';
import { PenAttributesComponent } from './components/sidebar-tools/attribute-panel/pen-attributes/pen-attributes.component';
import { PolygonAttributesComponent } from './components/sidebar-tools/attribute-panel/polygon-attributes/polygon-attributes.component';
// tslint:disable-next-line: max-line-length
import { SelectionAttributesComponent } from './components/sidebar-tools/attribute-panel/selection-attributes/selection-attributes.component';
import { StampAttributesComponent } from './components/sidebar-tools/attribute-panel/stamp-attributes/stamp-attributes.component';
import { TextAttributesComponent } from './components/sidebar-tools/attribute-panel/text-attributes/text-attributes.component';
import { SidebarToolsComponent } from './components/sidebar-tools/sidebar-tools.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';
import { DrawStackService } from './services/draw-stack/draw-stack.service';
import { DrawingSaverService } from './services/server/drawing-saver/drawing-saver.service';
import { UndoRedoerService } from './services/undo-redoer/undo-redoer.service';

@NgModule({
    declarations: [
        MySlice,
        LabelFilter,
        NameFilter,
        ToTrustHtmlPipe,
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
        OpenFileModalWindowComponent,
        PolygonAttributesComponent,
        GridAttributesComponent,
        LineAttributesComponent,
        StampAttributesComponent,
        DropperAttributesComponent,
        EllipsisAttributesComponent,
        SaveFileModalWindowComponent,
        SelectionAttributesComponent,
        ExportFileModalWindowComponent,
        PenAttributesComponent,
        TextAttributesComponent,
        EraserAttributesComponent,
    ],
    imports: [
        MatSliderModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatDialogModule,
        MatListModule,
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
        MatSelectModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatSnackBarModule,
    ],
    entryComponents: [
        WelcomeModalWindowComponent,
        DrawingModalWindowComponent,
        OpenFileModalWindowComponent,
        SaveFileModalWindowComponent,
        ExportFileModalWindowComponent,
    ],
    providers: [
        ToolSelectorService,
        DrawingModalWindowService,
        WelcomeModalWindowService,
        ColorToolService,
        EventListenerService,
        DrawStackService,
        DrawingSaverService,
        UndoRedoerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
