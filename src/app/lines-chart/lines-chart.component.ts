import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { ChartRendererBaseClass } from '../base-instance-classes/chart-renderer-base.class'


@Component({
  selector: 'app-lines-chart',
  templateUrl: './lines-chart.component.html',
  styleUrls: ['./lines-chart.component.scss'],
})
export class LinesChartComponent extends ChartRendererBaseClass implements AfterViewInit {

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
