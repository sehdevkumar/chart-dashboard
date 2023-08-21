import { ElementRef, Input } from "@angular/core";
import { BarChatOutline, IChartAxisInstance, IViewDimConfig, d3SelectionBase } from "./platfom-typings";


// Define all base Methods and Properties for the
export interface IChartRendererBase {
     chartContainer:ElementRef<HTMLElement>
     viewDimConfig: IViewDimConfig;
     barChartAxisInstance?: IChartAxisInstance
     viewSVGGroup: d3SelectionBase
     onAxisTextRender?<T>(...args: T[]):void;
     onGetGenerateAxisDomainRangeOutlines<T>(...args: T[]):BarChatOutline<any>[];
     onRemoveAxisGroup():void;
     onCreateChartAxis?<T>(...args:T[]):IChartAxisInstance;
     onConstructViewDimConfig(chartContainer:ElementRef<HTMLElement>):IViewDimConfig;
     onCreateSVGViewGroup(viewDimConfig: IViewDimConfig):d3SelectionBase;
     onRender():void

}
