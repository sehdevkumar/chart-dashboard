import { ElementRef } from '@angular/core'

export type d3DragBehavior = d3.ZoomBehavior<Element, unknown>
export type d3SelectionBase = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | any,
  any | NodeList
>

interface AxisOutline<T> {
  ticksIndices: Array<number>
  values: Array<T | null>
  domains: Array<T>
  ranges: Array<number>
}
export type BarChatOutline<T> = AxisOutline<T>

export interface IBarChartAxisInstance {
  xScale:   d3.ScaleBand<any> |d3.ScaleLinear<any, any, never>
  yScale: d3.ScaleLinear<any, any, never> | d3.ScaleBand<any>
  viewGroup: d3SelectionBase
  viewDimConfig: IViewDimConfig
  axisOutlines: BarChatOutline<any>[]
}


// Just Dummay Interface
export interface IBarResponse {
  spillOver?: string
  available?: string
  occupied?: string
  reserved?: string
}

export enum BarOccupancyEnum {
  spillOver = 'spillOver',
  available = 'available',
  occupied = 'occupied',
  reserved = 'reserved',
  hollow = 'hollow'
}

export interface IViewDimConfig {
  rendererInstance?: ElementRef
  rendererHeight: number
  rendererWidth: number
  margin: ICustomBarDim
  viewHeight: number
  viewWidth: number
}

export interface ICustomBarDim {
  top: number
  right: number
  bottom: number
  left: number
  height?:number;
  width?:number;
}


export enum ChartEnumClass {
   BAR_CHART_CLASS='bar-chart-class'
}


export enum BarChartRenderingType {
   MONTHLY='MONTHLY',
   WEEKLY='WEEKLY',
   YEARLY='YEARLY'
}
