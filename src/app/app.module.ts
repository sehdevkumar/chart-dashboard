import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChartsService } from './charts.service';
import { BarExampleComponent } from './bar-example/bar-example.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LinesChartComponent } from './lines-chart/lines-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    LandingPageComponent,
    BarExampleComponent,
    LineChartComponent,
    LinesChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ChartsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
