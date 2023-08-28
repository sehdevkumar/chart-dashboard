import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { ChartRendererBaseClass } from '../base-instance-classes/chart-renderer-base.class'
import {
  IViewDimConfig,
  d3SelectionBase,
  BarChatOutline,
  IChartToolTip,
  ChartOccupancyEnum,
  ILaborsMachineResponse,
  Points,
} from '../typings/platfom-typings'
import { LaborMachineChart } from '../dummy/labor-machine-data'
import * as d3 from 'd3'

/**
 * @description
 *
 * Connect Data Points: Draw lines connecting each consecutive data point on the chart. This line visually represents the progression or trend of the data between the points.
 *
 */
@Component({
  selector: 'app-lines-chart',
  templateUrl: './lines-chart.component.html',
  styleUrls: ['./lines-chart.component.scss'],
})
export class LinesChartComponent extends ChartRendererBaseClass
  implements AfterViewInit {
  @Input() inputChartWidth: number = 820
  @Input() inputChartHeight: number = 500
  @ViewChild('visualization') visualization: ElementRef<HTMLElement>

  constructor() {
    super()
  }

  ngAfterViewInit(): void {
    this.init(this.visualization)
    this.onWeekly()
  }

  onGetGenerateLeData() {
    const chartLegend = []
    const labor: IChartToolTip = {
      markColor: this.onGetColorBasedOnOccupancy(ChartOccupancyEnum.labor),
      value: ChartOccupancyEnum.labor,
    }
    const machine: IChartToolTip = {
      markColor: this.onGetColorBasedOnOccupancy(ChartOccupancyEnum.machine),
      value: ChartOccupancyEnum.machine,
    }

    chartLegend.push(labor, machine)

    return chartLegend
  }

  onWeekly() {
    const xDomains = ['week1', 'week2', 'week3', 'week4', 'week5']

    const xRange = [0, this.viewDimConfig?.viewWidth]

    const yDomains = [0, 100]
    const yRange = [this.viewDimConfig?.viewHeight, 0]

    const axisOutlines = this.onGetGenerateAxisDomainRangeOutlines<
      string[] | number[]
    >(xDomains, xRange, yDomains, yRange)

    this.barChartAxisInstance = this.onCreateChartAxis<
      IViewDimConfig | d3SelectionBase | Array<BarChatOutline<string>> | number
    >(this.viewSVGGroup, this.viewDimConfig, axisOutlines, 1)

    this.onRender()
    this.onAxisTextRender<d3SelectionBase | string>(
      this.viewSVGGroup,
      'Timer Range',
      'Weight (tones)',
    )

    this.onDrawChartLegends<d3SelectionBase | IChartToolTip[] | boolean>(
      this.viewSVGGroup,
      this.onGetGenerateLeData(),
      false,
    )
  }

  onRender(): void {
    this.onConstructLineChartData()
  }

  onConstructLineChartData() {
    const laborsMachinesData = LaborMachineChart as ILaborsMachineResponse

    const labors = laborsMachinesData?.labors
    const machines = laborsMachinesData?.machines

    this.onStartRenderingLineChart(machines, ChartOccupancyEnum.machine)
    this.onStartRenderingLineChart(labors, ChartOccupancyEnum.labor)

    this.onDrawBackdropOverlay()
  }

  onDrawBackdropOverlay() {
     const group = this.barChartAxisInstance?.viewGroup
     const h = this.barChartAxisInstance?.viewDimConfig?.viewHeight;
     const w = this.barChartAxisInstance?.viewDimConfig?.viewWidth;

     console.log(group,h,w)
  }


  onStartRenderingLineChart(
    data: Points[],
    chartOccupancyEnum: ChartOccupancyEnum,
  ) {
    const xScale = this.barChartAxisInstance?.xScale
    const yScale = this.barChartAxisInstance?.yScale

    const xDomain = this.barChartAxisInstance.axisOutlines[0]?.domains

    // For Line Chart Use This
    // const line = d3
    //   ?.line()
    //   ?.x((d) => xScale(xDomain[d['x']]))

    //   ?.y((d) => yScale(d['y']))

    const area = (datum, boolean) => {
      return d3
        .area()
        .y0((p) => yScale(0))
        .x((p) =>  (boolean ? xScale(0) : xScale(xDomain[p['x']])))
        .y1((p) => (boolean ? yScale(0) : yScale(p['y'])))(datum)
    }

    const lineGroup = this.viewSVGGroup
      ?.append('g')
      ?.attr('class', `{line-group}-${chartOccupancyEnum}`)

    const path = lineGroup
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', this.onGetColorBasedOnOccupancy(chartOccupancyEnum))
      .attr('d', (d) => area(d, true))
      .attr('stroke', this.onGetColorBasedOnOccupancy(chartOccupancyEnum))
      .attr('stroke-width', 5)
      .attr('opacity', 0.1)

    const length = path?.node()?.getTotalLength()
    path
      .attr('stroke-dasharray', length + ' ' + length)
      .attr('stroke-dashoffset', length)
      .transition()
      .ease(d3.easeBounceOut)
      .duration(3000)
      .attr('stroke-dashoffset', 0)
      .attr('d', (d) => area(d, false))
      .attr('opacity', 0.9)
      .on('end', () => {
        lineGroup
          .selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', (d) => xScale(xDomain[d['x']]))
          .attr('cy', (d) => yScale(d['y']))
          .transition()
          .attr('r', 4)
          .attr('fill', this.onGetColorBasedOnOccupancy(chartOccupancyEnum))
      })
  }

  /**
   * Get Color based on Occupancy
   * @param keyName
   * @returns
   */
  onGetColorBasedOnOccupancy(keyName: string): string {
    switch (keyName) {
      case ChartOccupancyEnum.labor:
        return '#A81D92'

      case ChartOccupancyEnum.machine:
        return '#015C8F'
    }

    return ''
  }
}
