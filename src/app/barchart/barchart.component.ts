import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import {
  BarChartRenderingType,
  BarChatOutline,
  BarOccupancyEnum,
  ChartEnumClass,
  IBarChartAxisInstance,
  IBarResponse,
  IViewDimConfig,
  d3SelectionBase,
} from '../typings/platfom-typings'
import * as d3 from 'd3'
import { ChartsService } from '../charts.service'
import { WeeklyData } from '../dummy/barchart-data'

import { cloneDeep } from 'lodash'

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements AfterViewInit, OnChanges {
  //  Chart View Height And Width
  @Input() chartWidth: number = 820
  @Input() chartHeight: number = 500
  @Input() chartRenderingType: BarChartRenderingType
  @ViewChild('visualization')
  private chartContainer!: ElementRef<HTMLElement>

  // config
  viewDimConfig: IViewDimConfig
  barChartAxisInstance: IBarChartAxisInstance
  // SVG main Group
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartRenderingType) {
      this.onRenderChart(this.chartRenderingType)
    }
  }

  ngAfterViewInit(): void {

    this.viewDimConfig = this.cs.onConstructViewDimConfig(this.chartContainer)
    this.viewSVGGroup = this.cs?.onCreateSVGViewGroup(this.viewDimConfig)

    this.onRenderChart(BarChartRenderingType.WEEKLY);
  }

  onRenderChart(renderingType: BarChartRenderingType) {
    switch (renderingType) {
      case BarChartRenderingType.MONTHLY:
        this.onMonthly()
        return
      case BarChartRenderingType.WEEKLY:
        this.onWeekly()
        return
      case BarChartRenderingType.YEARLY:
        this.onYearly()
        return
    }
  }

  // on Monthly
  onMonthly() {
    const xDomains = ['week1', 'week2', 'week3', 'week4', 'week5']

    const xRange = [0, this.getViewDimConfig?.viewWidth]

    const yDomains = [0, 100]
    const yRange = [this.getViewDimConfig?.viewHeight, 0]
    // Dummy Response
    const response: Array<IBarResponse> = WeeklyData as any
    this.onRender(xDomains, xRange, yDomains, yRange, response)
  }

  // on Yearly
  onYearly() {
    const xDomains = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const xRange = [0, this.getViewDimConfig?.viewWidth]

    const yDomains = [0, 100]
    const yRange = [this.getViewDimConfig?.viewHeight, 0]
    // Dummy Response
    const response: Array<IBarResponse> = WeeklyData as any
    this.onRender(xDomains, xRange, yDomains, yRange, response)
  }

  // on Weekly
  onWeekly() {
    const xDomains = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const xRange = [0, this.getViewDimConfig?.viewWidth]

    const yDomains = [0, 100]
    const yRange = [this.getViewDimConfig?.viewHeight, 0]
    // Dummy Response
    const response: Array<IBarResponse> = WeeklyData as any
    this.onRender(xDomains, xRange, yDomains, yRange, response)
  }

  onRender(
    xdomains: Array<string | number>,
    xRange: Array<number>,
    yDomains: Array<string | number>,
    yRange: Array<number>,
    data: Array<IBarResponse>,
  ) {
    // Clean the View Group and Render all bars
    this.viewSVGGroup?.selectAll(`*`)?.remove()

    const xAxisOutline: BarChatOutline<any> = {
      ticksIndices: [0, 1, 2, 3, 4],
      values: [],
      domains: xdomains,
      ranges: xRange,
    }

    const yAxisOutline: BarChatOutline<any> = {
      ticksIndices: [0, 1, 2, 3, 4, 5, 6],
      values: [],
      domains: yDomains,
      ranges: yRange,
    }

    const axisOutlines = [xAxisOutline, yAxisOutline]

    this.barChartAxisInstance = this.cs.onCreateBarChartAxis(
      this.viewSVGGroup,
      this.viewDimConfig,
      axisOutlines,
    )

    // Remove and render
    this.onRenderOccupancyBarChart(
      cloneDeep(this.barChartAxisInstance),
      cloneDeep(data),
      'occupied',
      0,
    )
    this.onRenderOccupancyBarChart(
      cloneDeep(this.barChartAxisInstance),
      cloneDeep(data),
      'available',
      1,
    )
    this.onRenderOccupancyBarChart(
      cloneDeep(this.barChartAxisInstance),
      cloneDeep(data),
      'spillOver',
      2,
    )
  }

  onRenderOccupancyBarChart(
    barChartAxisInstance: IBarChartAxisInstance,
    data: any,
    keyName: string,
    margin: number,
  ) {
    // TODO: this is just dumay data later it will change
    const xScale = barChartAxisInstance?.xScale as d3.ScaleBand<any>
    const yScale = barChartAxisInstance?.yScale

    const gp = barChartAxisInstance?.viewGroup
      .append('g')
      .attr('class', `${ChartEnumClass.BAR_CHART_CLASS}`)
    gp.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, n, i) => {
        return (
          xScale(barChartAxisInstance.axisOutlines[0]?.domains[+n]) +
          (margin * xScale?.bandwidth()) / 3
        )
      })
      .attr('width', xScale?.bandwidth() / 3)
      .attr('fill', this.onGetColorBasedOnOccupancy(keyName))
      .attr('height', (d, i, n) => this.viewDimConfig?.viewHeight - yScale(0))
      .attr('y', (d) => yScale(0))

    gp.selectAll('rect')
      .transition()
      .duration(800)
      .ease(d3.easePolyInOut)
      .attr('y', (d, i, n) => yScale(+data[i]?.[keyName]))
      .attr(
        'height',
        (d, i, n) => this.viewDimConfig?.viewHeight - yScale(+data[i][keyName]),
      )
      .delay((d, i) => i * 100)
  }

  /**
   * Get Color based on Occupancy
   * @param keyName
   * @returns
   */
  onGetColorBasedOnOccupancy(keyName: string): string {
    switch (keyName) {
      case BarOccupancyEnum.spillOver:
        return '#F55C1E'

      case BarOccupancyEnum.available:
        return '#191919'

      case BarOccupancyEnum.occupied:
        return '#7BF403'

      case BarOccupancyEnum.reserved:
        return 'blue'
    }

    return ''
  }
}
