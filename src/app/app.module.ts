import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChartsService } from './charts.service';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LinesChartComponent } from './lines-chart/lines-chart.component';
import { ContainersAnalysisChartComponent } from './containers-analysis-chart/containers-analysis-chart.component';
import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    LandingPageComponent,
    LineChartComponent,
    LinesChartComponent,
    ContainersAnalysisChartComponent,
    ChartTooltipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ChartsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
