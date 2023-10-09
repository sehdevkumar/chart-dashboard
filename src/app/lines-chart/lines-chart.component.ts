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

    this.onDrawBackdropOverlay(labors,machines)
  }

  /**
   *  This backdrop Overlay used to get the index for domain or Data which is provided
   *  eventually it is needed when we wanted to draw a line between to data points
   * @param labors
   * @param machines
   */
  onDrawBackdropOverlay(labors:Points[],machines:Points[]) {
    const group = this.barChartAxisInstance?.viewGroup
    const h = this.barChartAxisInstance?.viewDimConfig?.viewHeight
    const w = this.barChartAxisInstance?.viewDimConfig?.viewWidth

   const backDropRect = group
      ?.append('rect')
      .attr('width', w)
      .attr('height', h)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'transparent')
      .on('mousemove', (d, n) => {
        const xScale = this.barChartAxisInstance?.xScale
        const yScale = this.barChartAxisInstance?.yScale
        const Point = d3.pointer(d)
        const xPoint = Point[0]
        const yPoint = Point[1]

        const yExactPoint =   (yScale as any)?.invert(yPoint)

        // Calculate the index based on the position of the pointer
        const index = Math?.floor(xPoint / (xScale as any)?.step())

        // Ensure the index is within bounds
        if (index >= 0 && index < 6) {

          const findDataPointMachine = machines?.find(point=>  point?.y === Math.floor(yExactPoint));


        }
        const findDataPointLabor = labors?.reduce((acc,val)=> acc.concat(val?.y) ,[]);
        if(findDataPointLabor.includes(Math.floor(yExactPoint))) {
            console.log("yes",findDataPointLabor.indexOf(Math.floor(yExactPoint)),index)
        }

      })
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
        .x((p) => (boolean ? xScale(0) : xScale(xDomain[p['x']])))
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
      .ease(d3.easeCircle)
      .duration(1000)
      .attr('stroke-dashoffset', 0)
      .attr('d', (d) => area(d, false))
      .attr('opacity', 0.4)
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
          .attr('opacity', 0.4)

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
