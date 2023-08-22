import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { ChartRendererBaseClass } from '../base-instance-classes/chart-renderer-base.class'
import * as d3 from 'd3'
import { cloneDeep } from 'lodash'
import { WeeklyData } from '../dummy/barchart-data'
import {
  IViewDimConfig,
  d3SelectionBase,
  BarChatOutline,
  ICellsOccupancyResponse,
  IChartAxisInstance,
  ChartEnumClass,
  BarOccupancyEnum,
  IContainersResosponse,
} from '../typings/platfom-typings'
import { ContainerChart } from '../dummy/containers-data'

@Component({
  selector: 'app-containers-analysis-chart',
  templateUrl: './containers-analysis-chart.component.html',
  styleUrls: ['./containers-analysis-chart.component.scss'],
})
export class ContainersAnalysisChartComponent extends ChartRendererBaseClass
  implements AfterViewInit {
  //  Chart View Height And Width
  @Input() inputChartWidth: number = 820
  @Input() inputChartHeight: number = 500
  @ViewChild('visualization') visualization: ElementRef<HTMLElement>

  constructor() {
    super()
  }
  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {
    this.init(this.visualization)
    this.onMonthly()
  }

  // on Monthly
  onMonthly() {
    const xDomains = ['week1', 'week2', 'week3', 'week4', 'week5']

    const xRange = [0, this.viewDimConfig?.viewWidth]

    const yDomains = [0, 700]
    const yRange = [this.viewDimConfig?.viewHeight, 0]

    const axisOutlines = this.onGetGenerateAxisDomainRangeOutlines<
      string[] | number[]
    >(xDomains, xRange, yDomains, yRange)

    this.barChartAxisInstance = this.onCreateChartAxis<
      IViewDimConfig | d3SelectionBase | Array<BarChatOutline<string>>
    >(this.viewSVGGroup, this.viewDimConfig, axisOutlines)

    this.onRender()
    this.onAxisTextRender<d3SelectionBase | string>(
      this.viewSVGGroup,
      'Weeks',
      'Containers',
    )
  }

  onRender() {
    const response: Array<IContainersResosponse> = ContainerChart as any
    // TODO: this is just dumay data later it will change

    const gp = this.barChartAxisInstance?.viewGroup
      .append('g')
      .attr('class', `${ChartEnumClass.BAR_CHART_CLASS}`)

    response?.forEach((data, index) => {
      this.onRenderOccupancyBarChart(gp, data, index, 'container_20_fit')
      this.onRenderOccupancyBarChart(gp, data, index, 'container_40_fit')
    })
  }

  onRenderOccupancyBarChart(
    group: d3SelectionBase,
    data: IContainersResosponse,
    index?: number,
    keyName?: string,
  ) {
    const xScale = this.barChartAxisInstance?.xScale as d3.ScaleBand<any>
    const yScale = this.barChartAxisInstance?.yScale
    const bar = group?.append('rect')?.datum(data)

    bar
      .attr('x', (d, i, n) =>
        this.onGetBarXScalePosition(
          xScale(this.barChartAxisInstance.axisOutlines[0]?.domains[+index]),
          xScale?.bandwidth() / 2 - 10,
          keyName,
        ),
      )
      .attr('width', this.onGetBarWidth(xScale?.bandwidth(), keyName))
      .attr('fill', this.onGetColorBasedOnOccupancy(keyName))
      .attr('height', (d, i, n) => this.onGetBarHeight(yScale, keyName, data))
      .attr('y', (d) => this.onGetBarYScalePosition(yScale, 0, keyName, data))

    bar
      .on('mousemove', (d) => {
        this.onTooltip<MouseEvent | string | number | IContainersResosponse>(
          d,
          keyName,
          data,
        )
      })
      .on('mouseout', (d) => {
        d3.select('.legend-tool-tip').style('display','none')
      })
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr('y', (d, i, n) =>
        this.onGetBarYScalePosition(yScale, 0, keyName, data, true),
      )
      .attr('height', (d, i, n) =>
        this.onGetBarHeight(yScale, keyName, data, true),
      )
      .delay((d, i) => i * Math.random() * 10)
  }

  onTooltip<T>(...arg: Array<T>) {
    const toopTipRef = d3.select('.legend-tool-tip')
    if (arg === null) {
      return
    }

    const event: MouseEvent = arg[0] as MouseEvent
    const keyName = arg[1]
    const data = arg[2]

    toopTipRef
      .style('display','block')
      .transition()
      .ease(d3.easeCircle)
      .style('top', `${event?.y}px`)
      .style('left', `${event?.x + 10}px`)
  }

  onGetBarXScalePosition(xScale: number, margin: number, keyName: string) {
    return xScale +  margin
  }

  onGetBarYScalePosition(
    yScale: d3.ScaleLinear<any, any, never> | d3.ScaleBand<any>,
    margin: number,
    keyName: string,
    datum?: any,
    isAnimation = false,
  ) {
    let newYScale = yScale(0)

    if (isAnimation) {
      const is40FitContainer = BarOccupancyEnum.container_40_fit === keyName
      newYScale = is40FitContainer
        ? yScale(datum?.[BarOccupancyEnum.container_20_fit]) -
          this.onGetBarHeight(yScale, keyName, datum)
        : yScale(datum?.[BarOccupancyEnum.container_20_fit])
    } else {
      const is40FitContainer = BarOccupancyEnum.container_40_fit === keyName
      newYScale = is40FitContainer
        ? yScale(0) - this.onGetBarHeight(yScale, keyName, datum)
        : yScale(0) - this.onGetBarHeight(yScale, keyName, datum)
    }

    return newYScale
  }

  onGetBarWidth(bandWidth: number, keyName: string, isAnimation = false) {
    return 20
  }

  onGetBarHeight(
    yScale: d3.ScaleLinear<any, any, never> | d3.ScaleBand<any>,
    keyName: string,
    datum?: any,
    isAnimation = false,
  ) {
    let newHeight = yScale(0)

    if (isAnimation) {
      const is40FitContainer = BarOccupancyEnum.container_40_fit === keyName
      newHeight = is40FitContainer
        ? this.viewDimConfig?.viewHeight -
          yScale(datum?.[BarOccupancyEnum.container_40_fit])
        : this.viewDimConfig?.viewHeight -
          yScale(datum?.[BarOccupancyEnum.container_20_fit])
    } else {
      const is40FitContainer = BarOccupancyEnum.container_40_fit === keyName
      newHeight = is40FitContainer
        ? this.viewDimConfig?.viewHeight -
          yScale(datum?.[BarOccupancyEnum.container_40_fit])
        : this.viewDimConfig?.viewHeight - yScale(0)
    }

    return newHeight
  }

  /**
   * Get Color based on Occupancy
   * @param keyName
   * @returns
   */
  onGetColorBasedOnOccupancy(keyName: string): string {
    switch (keyName) {
      case BarOccupancyEnum.container_20_fit:
        return '#FB9E13'

      case BarOccupancyEnum.container_40_fit:
        return '#008EBB'
    }

    return ''
  }
}
