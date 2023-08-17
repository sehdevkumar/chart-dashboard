export type d3DragBehavior = d3.ZoomBehavior<Element, unknown>;
export type d3SelectionBase = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | any,
  any
  |
  NodeList
>;

   interface AxisOutline<T> {
      ticksIndices:Array<number>;
      values:Array<T | null>;
      domains:Array<number>;
      ranges:Array<number>;
    }



    export interface AxisTitle {
      x?:number;
      y?:number;
      rotationAngle?:number;
      title:string
    }

    export type BarChatOutline<T>  = AxisOutline<T>;


/**
 * @description
 * x => x Axis Values Generic Type.
 *
 * y => y Axis Values Generic Type.
 */
    export interface BarChatAxis<X,Y>{
      xAxis:BarChatOutline<X>;
      yAxis:BarChatOutline<Y>;
      dim:Array<number>;
      parentViewGroup:d3SelectionBase;
      childViewGroupList:Array<d3SelectionBase>
      xAxisTickGroups:Array<d3SelectionBase> | null;
      yAxisTickGroups:Array<d3SelectionBase> | null;
    }




export interface BarCoordinates {
  progressHeight?:number;
  progressWidth?:number;
  x?:number;
  y?:number;
}

export interface IBar{
     color?:string;
     barName?:string;
     coords?: BarCoordinates;
}

export interface GenericIndexSignature<T> {
  [key: string]: T;
}


// Just Dummay Interface
export interface IBarResponse{
    spillover?:string;
    available?:string;
    occupied?:string;
    reserved?:string;
}

