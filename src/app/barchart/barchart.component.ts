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
  ICustomBarDim,
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

    this.onRenderChart(BarChartRenderingType.YEARLY)
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

  onAxisTextRender(
    group: d3SelectionBase,
    xAxisLabel: string,
    yAxisLabel: string,
  ) {
    const xAxisLabelGroup = group
      ?.append('text')
      .text(xAxisLabel)
      .attr('x', this.viewDimConfig?.viewWidth / 2)
      .attr('y', this.viewDimConfig?.viewHeight + 50)
      .style('text-anchor', 'middle')

    xAxisLabelGroup?.raise()

    const yAxisLabelGroup = group
      ?.append('text')
      .text(yAxisLabel)
      .attr('x', 0)
      .attr('y', this.viewDimConfig?.viewHeight / 2)
      .attr(
        'transform',
        `translate(-${this.viewDimConfig?.viewHeight / 2 + 30},${
          this.viewDimConfig?.viewHeight / 2
        }) rotate(-90)`,
      )
      .style('text-anchor', 'middle')
      .style('writing-mode', 'sideways-lr')

    yAxisLabelGroup?.raise()
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
    this.onAxisTextRender(this.viewSVGGroup, 'Weeks', 'Occupancy percentage')
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
    this.onAxisTextRender(this.viewSVGGroup, 'Yearly', 'Occupancy percentage')
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
    this.onAxisTextRender(this.viewSVGGroup, 'Weekly', 'Occupancy percentage')
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
      'hollow',
      0,
    )
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
      .attr('x', (d, i, n) =>
        this.onGetBarXScalePosition(
          xScale(barChartAxisInstance.axisOutlines[0]?.domains[+i]),
          margin * xScale?.bandwidth(),
          keyName,
        ),
      )
      .attr('width', this.onGetBarWidth(xScale?.bandwidth(), keyName))
      .attr('fill', this.onGetColorBasedOnOccupancy(keyName))
      .attr('height', (d, i, n) =>
        this.onGetBarHeight(yScale(0), keyName, false),
      )
      .attr('y', (d) => this.onGetBarYScalePosition(yScale(0), 0, keyName))
      .attr('stroke', '#191919')
      .attr('stroke-width', 0.1)
      .attr('rx', 10)
      .attr('ry', 5)

    gp.selectAll('rect')
      .transition()
      .duration(1500)
      .ease(d3.easePolyInOut)
      .attr('y', (d, i, n) =>
        this.onGetBarYScalePosition(yScale(+data[i]?.[keyName]), 0, keyName),
      )
      .attr('height', (d, i, n) =>
        this.onGetBarHeight(yScale(+data[i][keyName]), keyName, true),
      )
      .delay((d, i) => i * 50)
  }

  onGetBarXScalePosition(xScale: number, margin: number, keyName: string) {
    if (keyName === BarOccupancyEnum.hollow) {
      return xScale
    }

    return xScale + margin / 3
  }

  onGetBarYScalePosition(xScale: number, margin: number, keyName: string) {
    if (keyName === BarOccupancyEnum.hollow) {
      return xScale
    }

    return xScale + margin / 3
  }

  onGetBarWidth(bandWidth: number, keyName: string, isAnimation = false) {
    if (keyName === BarOccupancyEnum.hollow) {
      return bandWidth
    }

    return bandWidth / 3
  }

  onGetBarHeight(bandHeight: number, keyName: string, isAnimation = false) {
    if (keyName === BarOccupancyEnum.hollow) {
      return isAnimation
        ? this.viewDimConfig?.viewHeight
        : this.viewDimConfig?.viewHeight - bandHeight
    }

    return isAnimation
      ? this.viewDimConfig?.viewHeight - bandHeight
      : this.viewDimConfig?.viewHeight - bandHeight
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
      case BarOccupancyEnum.hollow:
        return '#FFFFFF'
    }

    return ''
  }
}
