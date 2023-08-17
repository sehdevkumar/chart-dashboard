export type d3DragBehavior = d3.ZoomBehavior<Element, unknown>;
export type d3SelectionBase = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | any,
  any
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
    }
