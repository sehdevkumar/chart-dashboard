import { IChartToolTip } from './../typings/platfom-typings'
import { Input, ElementRef, Component } from '@angular/core'
import { IChartRendererBase } from '../typings/chart-base-typings'
import {
  IViewDimConfig,
  IChartAxisInstance,
  d3SelectionBase,
  BarChatOutline,
  ChartOccupancyEnum,
} from '../typings/platfom-typings'
import * as d3 from 'd3'
import { ChartEventRegisterClass } from './chart-generic-event-register.class'

/**
 * Base abstract class for chart rendering.
 */
export abstract class ChartRendererBaseClass extends ChartEventRegisterClass
  implements IChartRendererBase {
  /** Width of the chart. */
  chartWidth: number

  /** Height of the chart. */
  chartHeight: number

  /** Reference to the HTML element that contains the chart. */
  chartContainer: ElementRef<HTMLElement>

  /** Configuration for the dimensions of the chart view. */
  viewDimConfig: IViewDimConfig

  /** Instance of the chart's bar chart axis, if applicable. */
  barChartAxisInstance?: IChartAxisInstance

  /** Reference to the SVG group element that contains the chart's view. */
  viewSVGGroup: d3SelectionBase

  GlobalChartOccupancyEnum = ChartOccupancyEnum

  // Just Track the Current Legend Text Length

  abstract onRender(): void

  constructor() {
    super()
  }

  init(chartContainer?: ElementRef<HTMLElement>) {
    this.chartContainer = chartContainer
    this.viewDimConfig = this.onConstructViewDimConfig(this.chartContainer)
    this.viewSVGGroup = this.onCreateSVGViewGroup(this.viewDimConfig)
  }

  onDrawChartLegends<T>(...args: T[]): void {
    const [group, IChartToolTip, isVertical] = (args as unknown) as [
      d3SelectionBase,
      IChartToolTip[],
      boolean,
    ]

    const legendsGroup = group?.append('g').attr('class',`legends-group`)
    IChartToolTip?.forEach((ich, i) => {

      legendsGroup
        ?.append('circle')
        .attr('cx', isVertical ?  this.viewDimConfig?.viewWidth - (ich?.value?.length+ 60 * (i + 1))  : this.viewDimConfig?.viewWidth - 60  )
        .attr('cy', isVertical ?  24 : 20 * i)
        .attr('r', 8)
        .attr('fill', ich?.markColor)

      legendsGroup
        ?.append('text')
        .text(ich?.value?.replace('(','').replace(')',''))
        .attr('x', isVertical   ?  this.viewDimConfig?.viewWidth - (ich?.value?.length + 40 * (i + 1))  :this.viewDimConfig?.viewWidth - 20)
        .attr('y',  isVertical  ?  28   :  20 * i + 4)
        .style('text-anchor', 'middle')
        .style('font-size', `clamp(12px,0.5vw,18px)`)
    })

    legendsGroup.attr('transform',`translate(0, -50)`)
  }

  /**
   * Callback function for rendering axis text.
   * @param args - Additional arguments for the callback.
   */
  onAxisTextRender<T>(...args: T[]): void {
    const [group, xAxisLabel, yAxisLabel] = (args as unknown) as [
      d3SelectionBase,
      string,
      string,
    ]
    const xAxisLabelGroup = group
      ?.append('text')
      .text(xAxisLabel)
      .attr('x', this.viewDimConfig?.viewWidth / 2)
      .attr('y', this.viewDimConfig?.viewHeight + 50)
      .style('text-anchor', 'middle')
      .style('font-size', `clamp(12px,0.5vw,18px)`)

    xAxisLabelGroup?.raise()

    const yAxisLabelGroup = group
      ?.append('text')
      .text(yAxisLabel)
      .attr('x', 0)
      .attr('y', this.viewDimConfig?.viewHeight / 2)
      .attr(
        'transform',
        `translate(-${this.viewDimConfig?.viewHeight / 2 + 40},${
          this.viewDimConfig?.viewHeight / 2
        }) rotate(-90)`,
      )
      .style('font-size', `clamp(12px,0.5vw,18px)`)
      .style('text-anchor', 'middle')

    yAxisLabelGroup?.raise()
  }

  /**
   * Callback function for generating axis domain range outlines.
   * @param args - Additional arguments for the callback.
   * @returns An array of bar chart outlines.
   */
  onGetGenerateAxisDomainRangeOutlines<T>(...args: T[]): BarChatOutline<any>[] {
    const [xdomains, xRange, yDomains, yRange] = (args as unknown) as [
      Array<string | number>,
      Array<number | string>,
      Array<string | number>,
      Array<number | string>,
    ]
    this.onRemoveAxisGroup()
    const xAxisOutline: BarChatOutline<any> = {
      ticksIndices: [0, 1, 2, 3, 4,5],
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

    return axisOutlines
  }

  /**
   * Callback function for removing the chart's axis group.
   */
  onRemoveAxisGroup() {
    this.viewSVGGroup?.selectAll(`*`)?.remove()
  }

  /**
   * Callback function for creating the chart's axis instance.
   * @param args - Additional arguments for the callback.
   * @returns An instance of the chart's axis.
   */
  onCreateChartAxis?<T>(...args: T[]): IChartAxisInstance {
    const [svgGroup, viewDimConfig, axisOutlines,padding] = (args as unknown) as [
      d3SelectionBase,
      IViewDimConfig,
      BarChatOutline<any>[],
      number
    ]

    const xScale = d3
      .scaleBand()
      .range(axisOutlines[0]?.ranges as any)
      .domain(axisOutlines[0]?.domains)


    // .padding(1)
    .paddingInner(padding ?? 0)

    svgGroup
      .append('g')
      .attr('transform', `translate(0,${viewDimConfig?.viewHeight})`)
      .call(d3.axisBottom(xScale).tickSize(10))
      .selectAll('text')
      // .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'center')

    const yScale = d3
      .scaleLinear()
      .domain(axisOutlines[1]?.domains)
      .range(axisOutlines[1]?.ranges as any)

    svgGroup.append('g').call(d3.axisLeft(yScale).tickSize(10).ticks(5))

    const BarChartAxisInstance: IChartAxisInstance = {
      xScale: xScale,
      yScale: yScale,
      viewGroup: svgGroup,
      viewDimConfig: viewDimConfig,
      axisOutlines: axisOutlines,
    }

    return BarChartAxisInstance
  }

  /**
   * Callback function for constructing the configuration for chart view dimensions.
   * @param chartContainer - Reference to the HTML element containing the chart.
   * @returns The configuration for chart view dimensions.
   */
  onConstructViewDimConfig(
    chartContainer: ElementRef<HTMLElement>,
  ): IViewDimConfig {
    const rendererHeight = chartContainer?.nativeElement?.offsetHeight
    const rendererWidth = chartContainer?.nativeElement?.offsetWidth

    const margin = { top: 60, right: 60, bottom: 90, left: 60 }
    const viewWidth = rendererWidth - margin.left - margin.right
    const viewHeight = rendererHeight - margin.top - margin.bottom

    const config: IViewDimConfig = {
      rendererHeight,
      rendererWidth,
      margin,
      viewHeight,
      viewWidth,
      rendererInstance: chartContainer,
    }

    return config
  }

  /**
   * Callback function for creating the SVG group element for the chart view.
   * @param viewDimConfig - Configuration for chart view dimensions.
   * @returns The SVG group element for the chart view.
   */
  onCreateSVGViewGroup(viewDimConfig: IViewDimConfig): d3SelectionBase {
    const svgWidth =
      viewDimConfig?.viewWidth +
      viewDimConfig?.margin?.left +
      viewDimConfig?.margin?.right
    const svgHeight =
      viewDimConfig?.viewHeight +
      viewDimConfig?.margin?.top +
      viewDimConfig?.margin?.bottom

    const viewGroup = d3
      .select(viewDimConfig?.rendererInstance?.nativeElement)
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('background-color', 'transparent')
      .style('border-radius', 'inherit')

    const finalGroup = viewGroup
      .append('g')
      .attr(
        'transform',
        `translate(${viewDimConfig?.margin.left},${viewDimConfig?.margin.top})`,
      )

    return (finalGroup as unknown) as d3SelectionBase
  }
}
