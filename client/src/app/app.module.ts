import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app/app.component";

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
//************************************************

import { SidebarComponent } from "./components/app/sidebar/sidebar.component";
import { AttributePanelComponent } from "./components/app/sidebar/sidebar-tools/attribute-panel/attribute-panel.component";
import { WorkZoneComponent } from "./components/app/work-zone/work-zone.component";
import { SidebarToolsComponent } from "./components/app/sidebar/sidebar-tools/sidebar-tools.component";
import {
	DrawingModalWindowComponent,
	DrawingModalWindowContent,
} from "./components/app/modal-window-new-drawing/drawing-modal-window.component";

@NgModule({
	declarations: [
		AppComponent,
		SidebarComponent,
		AttributePanelComponent,
		WorkZoneComponent,
		SidebarToolsComponent,
		DrawingModalWindowComponent,
		DrawingModalWindowContent,
	],
	entryComponents: [DrawingModalWindowContent],
	imports: [
		MatInputModule,
		MatDialogModule,
		MatButtonToggleModule,
		MatSidenavModule,
		MatButtonModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
	],
	providers: [ToolsService],
	bootstrap: [AppComponent],
})
export class AppModule {}
