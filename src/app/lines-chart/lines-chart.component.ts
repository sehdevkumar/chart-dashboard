import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { ChartsService } from '../charts.service'
import { d3SelectionBase, IViewDimConfig } from '../typings/platfom-typings'

@Component({
  selector: 'app-lines-chart',
  templateUrl: './lines-chart.component.html',
  styleUrls: ['./lines-chart.component.scss'],
})
export class LinesChartComponent implements AfterViewInit {
  //  Chart View Height And Width
  @Input() chartWidth: number = 820
  @Input() chartHeight: number = 500
  @ViewChild('visualization')
  private chartContainer!: ElementRef<HTMLElement>

  viewDimConfig: IViewDimConfig
  viewSVGGroup!: d3SelectionBase

  get getViewDim() {
    return [
      this.chartContainer?.nativeElement?.offsetWidth,
      this.chartContainer?.nativeElement?.offsetHeight,
    ]
  }

  get getViewDimConfig() {
    return this.viewDimConfig
  }

  constructor(private cs: ChartsService) {}
  ngAfterViewInit(): void {
    this.viewDimConfig = this.cs.onConstructViewDimConfig(this.chartContainer)
    this.viewSVGGroup = this.cs?.onCreateSVGViewGroup(this.viewDimConfig)
  }
}
