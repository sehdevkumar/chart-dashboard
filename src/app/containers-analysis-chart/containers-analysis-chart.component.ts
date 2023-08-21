import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartRendererBaseClass } from '../base-instance-classes/chart-renderer-base.class';

@Component({
  selector: 'app-containers-analysis-chart',
  templateUrl: './containers-analysis-chart.component.html',
  styleUrls: ['./containers-analysis-chart.component.scss']
})
export class ContainersAnalysisChartComponent  extends ChartRendererBaseClass implements AfterViewInit  {



   @Input() inputChartWidth: number = 820
   @Input() inputChartHeight: number = 500
   @ViewChild('visualization') visualization: ElementRef<HTMLElement>


   constructor(){
     super()
   }

   ngAfterViewInit(): void {
     this.init(this.visualization)
   }

  onRender(): void {
    console.log('Hello World')
  }


}
