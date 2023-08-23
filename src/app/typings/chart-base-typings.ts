import { ElementRef, Input } from "@angular/core";
import { BarChatOutline, IChartAxisInstance, IViewDimConfig, d3SelectionBase } from "./platfom-typings";


// Define all base Methods and Properties for the
export interface IChartRendererBase {
     chartContainer:ElementRef<HTMLElement>
     viewDimConfig: IViewDimConfig;
     barChartAxisInstance?: IChartAxisInstance
     viewSVGGroup: d3SelectionBase
     onAxisTextRender<T>(...args: T[]):void;
     onDrawChartLegends<T>(...args:T[]):void;
     onGetGenerateAxisDomainRangeOutlines<T>(...args: T[]):BarChatOutline<any>[];
     onRemoveAxisGroup():void;
     onCreateChartAxis?<T>(...args:T[]):IChartAxisInstance;
     onConstructViewDimConfig(chartContainer:ElementRef<HTMLElement>):IViewDimConfig;
     onCreateSVGViewGroup(viewDimConfig: IViewDimConfig):d3SelectionBase;
     onRender():void

}

// Blue print for the Chart Event Handlers and Register , this might be discrete and common , so make sure add those here
export interface IChartEventRegisterBase {

  onRegisterEvent<T>(object:d3SelectionBase,event:IChartGenericEventEnum,data:any,...args:T[]):void;
  onToolTipRegister<T>(containerRef?:ElementRef<HTMLElement> , containerClass?:string):void;
  onGenericEventRaised(event:IChartGenericEventEnum,data:any):void
}


export interface IChartGenericEventEmitter<T> {
   event:IChartGenericEventEnum;
   data:T;
   mouseEvent:any
}


export enum IChartGenericEventEnum {
   MOUSE_MOVE = 'mousemove',
   MOUSE_OUT = 'mouseout',
   MOUSE_CLICKED = 'click',

  //  Custom Chart Event
  TOOLTIP_EVENT = 'TOOLTIP_EVENT'
}
