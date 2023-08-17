import { ElementRef, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { BarChatAxis, d3SelectionBase } from './typings/platfom-typings';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor() { }


  /**
   *  @description
   *  if you pass the rendererClass to this, new SVG will append to it and return the view, also need to pass the Hight and Width
   * @param rendererClass
   * @param w
   * @param h
   * @returns
   */
  onCreateSVGViewGroup(rendererNative:ElementRef,w?:number,h?:number) : d3SelectionBase {

      const height = rendererNative?.nativeElement?.offsetHeight;
      const width = rendererNative?.nativeElement?.offsetWidth;


      const viewGroup = d3
      .select(rendererNative?.nativeElement)
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('background-color', 'transparent')
      .style('border-radius', 'inherit')


      return viewGroup as unknown as d3SelectionBase;
  }


  onCreateChartAxis(barchartAxisObject: BarChatAxis<string, string>) : BarChatAxis<string, string>{
    const margin = { top: 20, right: 20, bottom: 30, left: 30 }
    const width = barchartAxisObject?.dim[0] - margin.left - margin.right
    const height =barchartAxisObject?.dim[1] - margin.top - margin.bottom

    const chartGroup = barchartAxisObject?.parentViewGroup
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const xScale = d3
      .scaleLinear()
      .domain(barchartAxisObject?.xAxis?.domains)
      .range(barchartAxisObject?.xAxis?.ranges)

    const yScale = d3
      .scaleLinear()
      .domain(barchartAxisObject?.yAxis?.domains)
      .range(barchartAxisObject?.yAxis?.ranges)

    const getMutatedValue = (value: any) => {
      if (value !== null) {
        return value
      }

      return ''
    }

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(barchartAxisObject?.xAxis?.ticksIndices)
      .tickFormat(
        (d) => '' + getMutatedValue(barchartAxisObject?.xAxis?.values[+d]),
      )

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(barchartAxisObject?.yAxis?.ticksIndices)
      .tickFormat(
        (d) => '' + getMutatedValue(barchartAxisObject?.yAxis?.values[+d]),
      )

    chartGroup
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(-40,' + height + ')')
      .datum({})
      .call(xAxis)


    chartGroup.append('g').attr('class', 'y-axis').call(yAxis)

    barchartAxisObject.childViewGroupList = [chartGroup as any]

    return barchartAxisObject;
  }
}
