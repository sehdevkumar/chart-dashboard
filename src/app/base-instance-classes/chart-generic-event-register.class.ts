import { ElementRef, Self } from "@angular/core";
import { IChartEventRegisterBase, IChartGenericEventEmitter, IChartGenericEventEnum } from "../typings/chart-base-typings";
import { d3SelectionBase } from "../typings/platfom-typings";
import { Subject } from "rxjs";
import * as d3 from "d3";



/**
 * @description
 * Just Generic class to raiased the global event from the chart objects, for examples it might be rect, g,or svg it self.
 */
export class ChartGenericEventEmitter<T> implements IChartGenericEventEmitter<T> {
  mouseEvent: any;
  event: IChartGenericEventEnum;
  data: T;
}


/**
 * @description
 * this is kind of important class for the All charts Event Handling , if in future there are some more use cases where handlers need to be implement for shared functionalities then add here , make sure base interface also should hold those helpers
 */
export class ChartEventRegisterClass implements IChartEventRegisterBase {


  GenericEventRaised$:Subject<ChartGenericEventEmitter<any>> = new Subject();

  onRegisterEvent<T>(object: d3SelectionBase,event:IChartGenericEventEnum, data: any, ...args: T[]): void {
      // Raised only Registered Generic Event
      object?.on(event,(mouseEvt,d)=> {
        const newData = Object?.assign(data ?? {},{datum:d})
           this.onGenericEventRaised(event,newData,mouseEvt);
      })

  }
  onToolTipRegister<T>(containerRef?: ElementRef<HTMLElement>, containerClass?: string,event?:MouseEvent): void {
    const isContainerRef = containerRef !==null && containerRef!==undefined;

    const selectedEle = isContainerRef ? d3.select(containerRef?.nativeElement) : d3.select(containerClass);

    if(event === null || event === undefined) {
       selectedEle.style('display','none')
    }

    else {
      selectedEle
          .style('position','absolute')
          .style('display','block')
          .transition()
          .ease(d3.easeBackOut)
          .style('top', `${event?.y}px`)
          .style('left', `${event?.x + 10}px`)
    }

  }
  onGenericEventRaised(event:IChartGenericEventEnum,data:any,mouseEvt?:MouseEvent): void {
      const instance:ChartGenericEventEmitter<any> = new ChartGenericEventEmitter();
      instance.data = data;
      instance.event = event;
      instance.mouseEvent = mouseEvt;
      this.GenericEventRaised$.next(instance);
  }
}
