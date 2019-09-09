import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app/app.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// *********** Material Angular ******************
import {
	MatInputModule,
	MatDialogModule,
	MatButtonToggleModule,
	MatSidenavModule,
	MatButtonModule,
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//************************************************

// *************** Services **********************
import { ToolsService } from "./services/panel-tools/tools.service";
import { DrawingInfoService } from "./services/drawing-info/drawing-info.service";
//************************************************

import { SidebarComponent } from "./components/app/sidebar/sidebar.component";
import { AttributePanelComponent } from "./components/app/sidebar/sidebar-tools/attribute-panel/attribute-panel.component";
import { WorkZoneComponent } from "./components/app/work-zone/work-zone.component";
import { SidebarToolsComponent } from "./components/app/sidebar/sidebar-tools/sidebar-tools.component";
import { DrawingModalWindowComponent } from "./components/app/drawing-modal-window/drawing-modal-window.component";
import { ContentComponent } from "./components/app/drawing-modal-window/content/content.component";

@NgModule({
	declarations: [
		AppComponent,
		SidebarComponent,
		AttributePanelComponent,
		WorkZoneComponent,
		SidebarToolsComponent,
		DrawingModalWindowComponent,
		ContentComponent,
	],
	entryComponents: [ContentComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatDialogModule,
		MatButtonToggleModule,
		MatSidenavModule,
		MatButtonModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
	],
	providers: [ToolsService, DrawingInfoService],
	bootstrap: [AppComponent],
})
export class AppModule {}
