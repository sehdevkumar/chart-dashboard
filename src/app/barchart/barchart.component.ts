import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  BarChartRenderingType,
  BarOccupancyEnum,
  ChartEnumClass,
  IChartAxisInstance,
  ICellsOccupancyResponse,
  IViewDimConfig,
  d3SelectionBase,
  BarChatOutline,
  IChartToolTip,
} from '../typings/platfom-typings'
import * as d3 from 'd3'
import { WeeklyData } from '../dummy/barchart-data'

import { cloneDeep } from 'lodash'
import { ChartRendererBaseClass } from '../base-instance-classes/chart-renderer-base.class'
import { IChartGenericEventEnum } from '../typings/chart-base-typings'
import { debounceTime } from 'rxjs'

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent extends ChartRendererBaseClass
  implements AfterViewInit, OnInit {
  //  Chart View Height And Width
  @Input() inputChartWidth: number = 820
  @Input() inputChartHeight: number = 500
  @Input() chartRenderingType: BarChartRenderingType
  @ViewChild('visualization') visualization: ElementRef<HTMLElement>
  @ViewChild('charToolTip') charToolTip: ElementRef

  IChartToolTip:IChartToolTip[]

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.GenericEventRaised$.pipe(debounceTime(100)).subscribe((res) => {
      if (res?.event === IChartGenericEventEnum.MOUSE_MOVE) {
        this.onGetGenerateChartToolTipData(res?.data)
        this.onToolTipRegister(this.charToolTip,null, res?.mouseEvent)
      } else if (res?.event === IChartGenericEventEnum.MOUSE_OUT) {
        this.IChartToolTip = []
        this.onToolTipRegister(this.charToolTip,null, null)
      }
    })
  }


  onGetGenerateChartToolTipData(data:ICellsOccupancyResponse) {
    console.log(data)
     this.IChartToolTip = []
    const container_40_fit: IChartToolTip = {
      markColor: this.onGetColorBasedOnOccupancy(
        data['datum'],
      ),
      value: data['datum'],
    }


    this.IChartToolTip.push(container_40_fit)
  }

  ngAfterViewInit(): void {
    this.init(this.visualization)
    this.onMonthly()
  }

  // on Monthly
  onMonthly() {
    const xDomains = ['week1', 'week2', 'week3', 'week4', 'week5']

    const xRange = [0, this.viewDimConfig?.viewWidth]

    const yDomains = [0, 100]
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
      'Occupancy percentage',
    )
  }

  onRender() {
    const response: Array<ICellsOccupancyResponse> = WeeklyData as any
    // TODO: this is just dumay data later it will change

    const gp = this.barChartAxisInstance?.viewGroup
      .append('g')
      .attr('class', `${ChartEnumClass.BAR_CHART_CLASS}`)

    response?.forEach((data, index) => {
      this.onRenderOccupancyBarChart(gp, data, index, 'hollow', -65)
      this.onRenderOccupancyBarChart(gp, data, index, 'hollow', 0)
      this.onRenderOccupancyBarChart(gp, data, index, 'hollow', 65)
      this.onRenderOccupancyBarChart(gp, data, index, 'spillOver', -65)
      this.onRenderOccupancyBarChart(gp, data, index, 'available', 0)
      this.onRenderOccupancyBarChart(gp, data, index, 'occupied', 65)
    })
  }

  onRenderOccupancyBarChart(
    group: d3SelectionBase,
    data: ICellsOccupancyResponse,
    index?: number,
    keyName?: string,
    margin?: number,
  ) {
    const xScale = this.barChartAxisInstance?.xScale as d3.ScaleBand<any>
    const yScale = this.barChartAxisInstance?.yScale
    const bar = group.append('rect').datum(keyName)

    bar
      .attr('x', (d, i, n) =>
        this.onGetBarXScalePosition(
          xScale(this.barChartAxisInstance.axisOutlines[0]?.domains[+index]),
          xScale?.bandwidth() + xScale?.bandwidth() / 3 + margin,
          keyName,
        ),
      )
      .attr('width', this.onGetBarWidth(xScale?.bandwidth(), keyName))
      .attr('fill', this.onGetColorBasedOnOccupancy(keyName))
      .attr('height', (d, i, n) =>
        this.onGetBarHeight(yScale(0), keyName, false),
      )
      .attr('y', (d) => this.onGetBarYScalePosition(yScale(0), 0, keyName))

      this.onRegisterEvent(bar, IChartGenericEventEnum.MOUSE_MOVE, data,keyName)
      this.onRegisterEvent(bar, IChartGenericEventEnum.MOUSE_OUT,  data,keyName)

    bar
      .transition()
      .duration(1500)
      .ease(d3.easeExpInOut)
      .attr('y', (d, i, n) =>
        this.onGetBarYScalePosition(yScale(+data?.[keyName]), 0, keyName),
      )
      .attr('height', (d, i, n) =>
        this.onGetBarHeight(yScale(+data[keyName]), keyName, true),
      )
      .delay((d, i) => i * 50)



  }

  onGetBarXScalePosition(xScale: number, margin: number, keyName: string) {
    return xScale + margin / 3
  }

  onGetBarYScalePosition(xScale: number, margin: number, keyName: string) {
    if (keyName === BarOccupancyEnum.hollow) {
      return xScale
    }

    return xScale + margin / 3
  }

  onGetBarWidth(bandWidth: number, keyName: string, isAnimation = false) {
    return 20
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
        return '#F78D8D'

      case BarOccupancyEnum.available:
        return '#909090'

      case BarOccupancyEnum.occupied:
        return '#92D04E'

      case BarOccupancyEnum.reserved:
        return 'blue'
      case BarOccupancyEnum.hollow:
        return '#f1f1f1'
    }

    return ''
  }
}
