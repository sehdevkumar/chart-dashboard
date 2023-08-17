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
  BarCoordinates,
  BarOccupancyEnum,
  GenericIndexSignature,
  IBar,
  IBarResponse,
  d3SelectionBase,
} from '../typings/platfom-typings'
import * as d3 from 'd3'
import { ChartsService } from '../charts.service'
import { WeeklyData } from '../dummy/barchart-data'

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

  currentXGapFactor = 5
  currentYGapFactor = 5

  // SVG main Group
  viewSVGGroup!: d3SelectionBase

  get getViewDim() {
    return [
      this.chartContainer?.nativeElement?.offsetWidth,
      this.chartContainer?.nativeElement?.offsetHeight,
    ]
  }


  get getXAxisGap():number {
     return this.getViewDim[0] / this.currentXGapFactor;
  }

  get getYAxisGap():number {

    return this.getViewDim[1] / this.currentYGapFactor;

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
      ticksIndices: [0, 1, 2, 3, 4],
      values: [null, '25', '50', '75', '100'],
      domains: [0, 4],
      ranges: [this.getViewDim[1], 0],
    }

    const barchartAxisObject: BarChatAxis<string, string> = {
      xAxis,
      yAxis,
      dim: this.getViewDim,
      parentViewGroup: this.viewSVGGroup,
      childViewGroupList: [],
      xAxisTickGroups: null,
      yAxisTickGroups: null,
    }

    this.currentXGapFactor = barchartAxisObject?.xAxis?.values?.length
    this.currentYGapFactor = barchartAxisObject?.yAxis?.values?.length

    const object = this.cs.onCreateChartAxis(barchartAxisObject)
    this.onDrawOccupancyBarCharts(object)
  }

  /**
   * @description
   * To draw the bar chart there are some dependencies like axis should render and proper context about charts , it means that we should have the ticks groups where all bars get appended , for that visit to chart service and pass the appropriate  args
   */
  onDrawOccupancyBarCharts(barChartAxis: BarChatAxis<string, string>) {

    // Construct the Bar Chart Data
    const collections = this.onConstructBarChartData(WeeklyData as any)

    // TODO: This selection from the d3 Groups, In future this might be remove from d3 , so keep in mind
    const xNodeList: NodeList = (barChartAxis?.xAxisTickGroups as any)[
      '_groups'
    ][0]
    xNodeList?.forEach((i, index) => {
      // Ignore the First Index
      if (index !== 0) {
        this.onRenderBar(i as unknown as d3SelectionBase,collections[index-1])
      }
    })
  }

  /**
   *  it helps to generate the Bar chart data
   * @param barResponse
   * @returns
   */
  onConstructBarChartData(
    barResponse: IBarResponse[],
  ): GenericIndexSignature<IBar>[] {
    const collections: GenericIndexSignature<IBar>[] = []
    const isHorizontal = true

    barResponse?.forEach((br, index) => {
      const genericIbar: GenericIndexSignature<IBar> = {}
      // Construct now every Ibar Object for Occupancy bar Chart
      Object.entries(br).forEach((pair) => {
        const key = pair[0]
        const val = pair[1]

        // Actual Percentage Respective to the SVG  View Groups
        const yActualPercentage = (this.getViewDim[1] * val) / 100
        const yPosition = this.getViewDim[1] - yActualPercentage

        const xActualPercentage = (this.getViewDim[0] * val) / 100
        const xPosition = (index + 1) * this.getXAxisGap

        const actualPercentage = isHorizontal ? yActualPercentage : xActualPercentage;


        const coors: BarCoordinates = {
          progressHeight: actualPercentage,
          progressWidth: 20,
          x: xPosition,
          y: yPosition - 30,
        }
        const ibar: IBar = {
          color: this.onGetColorBasedOnOccupancy(key),
          barName: key,
          coords: coors,
        }

        genericIbar[key] = ibar
      })

      collections.push(genericIbar)
    })

    return collections
  }

  onRenderBar(group: d3SelectionBase,genericIndexSignature:GenericIndexSignature<IBar>) {

    let localGap = 0;

    const bar = (data:IBar,group:d3SelectionBase)=> {
      group?.append('rect')
      .attr('x',data?.coords?.x + localGap)
      .attr('y',data?.coords?.y + '')
      .attr('width',data?.coords?.progressWidth+'')
      .attr('height',data?.coords?.progressHeight+'')
      .attr('fill',data?.color+'')

    }

    const spillOver = genericIndexSignature['spillOver'];
    const available = genericIndexSignature['available'];
    const occupied  = genericIndexSignature['occupied'];

    bar(available,this.viewSVGGroup)
    localGap+=20
    bar(spillOver,this.viewSVGGroup)
    localGap+=20
    bar(occupied,this.viewSVGGroup)
  }



  onGetColorBasedOnOccupancy(keyName:string):string {

    switch(keyName) {

      case BarOccupancyEnum.spillOver:
        return 'red'

       case BarOccupancyEnum.available:
        return '#191919'

       case BarOccupancyEnum.occupied:
        return 'green'

       case BarOccupancyEnum.reserved:
        return 'blue'
    }

    return ''
  }
}
