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

    const xRange = [1, this.viewDimConfig?.viewWidth]

    const yDomains = [0, 30]
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

    this.onStartRenderingLineChart(machines,ChartOccupancyEnum.machine)
    this.onStartRenderingLineChart(labors,ChartOccupancyEnum.labor)

  }

  onStartRenderingLineChart(
    data: Points[],
    chartOccupancyEnum: ChartOccupancyEnum,
  ) {
    const xScale = this.barChartAxisInstance?.xScale
    const yScale = this.barChartAxisInstance?.yScale

    const xDomain = this.barChartAxisInstance.axisOutlines[0]?.domains;

    const line = d3
      ?.line()
      .x((d) => xScale(xDomain[d['x']]))
      .y((d) => yScale(d['y']))


    const lineGroup = this.viewSVGGroup?.append('g')?.attr('class',`{line-group}-${chartOccupancyEnum}`);

    lineGroup
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .transition()
      .duration(1500)
      .ease(d3.easeSinInOut)
      .delay((d, i) => i * Math.random() * 100)
      .attr('d', (line as unknown) as string)
      .attr('fill', 'none')
      .attr('stroke', this.onGetColorBasedOnOccupancy(chartOccupancyEnum))
      .attr('stroke-width', 2)

  lineGroup
     .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .transition()
      .duration(1500)
      .ease(d3.easeSinInOut)
      .delay((d, i) => i * Math.random() * 100)
      .attr('cx', (d) => xScale(xDomain[d['x']]))
      .attr('cy', (d) => yScale(d['y']))
      .attr('r', 4) // Radius of the circles
      .attr('fill', this.onGetColorBasedOnOccupancy(chartOccupancyEnum)) // Circle fill color
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
