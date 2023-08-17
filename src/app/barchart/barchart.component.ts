import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  BarChatAxis,
  BarChatOutline,
  d3SelectionBase,
} from '../typings/platfom-typings'
import * as d3 from 'd3'
import { ChartsService } from '../charts.service'

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements AfterViewInit, AfterContentInit {
  //  Chart View Height And Width
  @Input() chartWidth: number = 800
  @Input() chartHeight: number = 500
  @ViewChild('visualization')
  private chartContainer!: ElementRef<HTMLElement>

  // SVG main Group
  viewSVGGroup!: d3SelectionBase

  get getViewDim() {
    return [
      this.chartContainer?.nativeElement?.offsetWidth,
      this.chartContainer?.nativeElement?.offsetHeight,
    ]
  }

  constructor(private cs: ChartsService) {}

  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {
    this.viewSVGGroup = this.cs?.onCreateSVGViewGroup(this.chartContainer)
    this.onMonthly()
  }

  onMonthly() {
    const xAxis: BarChatOutline<string> = {
      ticksIndices: [0, 1, 2, 3, 4, 5],
      values: [null, 'week1', 'week2', 'week3', 'week4', 'week5'],
      domains: [0, 6],
      ranges: [0, this.getViewDim[0]],
    }

    const yAxis: BarChatOutline<string> = {
      ticksIndices: [0, 1, 2, 3, 4, 5],
      values: [null, '0', '25', '50', '75', '100'],
      domains: [0, 5],
      ranges: [this.getViewDim[1], 0],
    }

    const barchartAxisObject: BarChatAxis<string, string> = {
      xAxis,
      yAxis,
      dim:this.getViewDim,
      parentViewGroup:this.viewSVGGroup,
      childViewGroupList:[]
    }

   const object =  this.cs.onCreateChartAxis(barchartAxisObject);
  }

}
