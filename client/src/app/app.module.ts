import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app/app.component";

// *********** Material Angular ******************
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SidebarComponent } from "./components/app/sidebar/sidebar.component";
import { AttributePanelComponent } from "./components/app/sidebar/sidebar-tools/attribute-panel/attribute-panel.component";
import { WorkZoneComponent } from "./components/app/work-zone/work-zone.component";
import { SidebarToolsComponent } from "./components/app/sidebar/sidebar-tools/sidebar-tools.component";
//************************************************

// *************** Services **********************
import { ToolsService } from "./services/panel-tools/tools.service";
//************************************************

@NgModule({
	declarations: [AppComponent, SidebarComponent, AttributePanelComponent, WorkZoneComponent, SidebarToolsComponent],
	imports: [
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
