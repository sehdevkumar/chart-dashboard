import { ElementRef, Injectable } from '@angular/core'
import * as d3 from 'd3'
import {
  BarChatOutline,
  IBarChartAxisInstance,
  IViewDimConfig,
  d3SelectionBase,
} from './typings/platfom-typings'

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor() {}

  /**
   * Construct the View Dim Configurations
   * @param rendererNative
   * @returns
   */
  onConstructViewDimConfig(rendererNative: ElementRef): IViewDimConfig {
    const rendererHeight = rendererNative?.nativeElement?.offsetHeight
    const rendererWidth = rendererNative?.nativeElement?.offsetWidth

    const margin = { top: 10, right: 30, bottom: 90, left: 40 }
    const viewWidth = rendererWidth - margin.left - margin.right
    const viewHeight = rendererHeight - margin.top - margin.bottom

    const config: IViewDimConfig = {
      rendererHeight,
      rendererWidth,
      margin,
      viewHeight,
      viewWidth,
      rendererInstance: rendererNative,
    }

    return config
  }

  /**
   *  @description
   *  if you pass the rendererClass to this, new SVG will append to it and return the view, also need to pass the Hight and Width
   * @param rendererClass
   * @param w
   * @param h
   * @returns
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

  onCreateBarChartAxis(
    svgGroup: d3SelectionBase,
    viewDimConfig: IViewDimConfig,
    axisOutlines: BarChatOutline<any>[],
  ): IBarChartAxisInstance {
    const xScale = d3
      .scaleBand()
      .range(axisOutlines[0]?.ranges)
      .domain(axisOutlines[0]?.domains)
      .padding(0.2)

    svgGroup
      .append('g')
      .attr('transform', `translate(0,${viewDimConfig?.viewHeight})`)
      .call(d3.axisBottom(xScale).tickSize(1))
      .selectAll('text')
      // .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'center')

    const yScale = d3
      .scaleLinear()
      .domain(axisOutlines[1]?.domains)
      .range(axisOutlines[1]?.ranges)

    svgGroup.append('g').call(d3.axisLeft(yScale).tickSize(1).ticks(4))

    const BarChartAxisInstance: IBarChartAxisInstance = {
      xScale: xScale,
      yScale: yScale,
      viewGroup: svgGroup,
      viewDimConfig: viewDimConfig,
      axisOutlines: axisOutlines,
    }

    return BarChartAxisInstance
  }
}
