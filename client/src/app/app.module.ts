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
import { AttributePanelComponent } from "./components/app/sidebar/attribute-panel/attribute-panel.component";
//************************************************

@NgModule({
	declarations: [AppComponent, SidebarComponent, AttributePanelComponent],
	imports: [
		MatButtonToggleModule,
		MatSidenavModule,
		MatButtonModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
