import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChartsService } from './charts.service';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ChartsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
