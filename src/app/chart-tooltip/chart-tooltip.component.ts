import { Component, Input } from '@angular/core';
import { IChartToolTip } from '../typings/platfom-typings';

@Component({
  selector: 'app-chart-tooltip',
  templateUrl: './chart-tooltip.component.html',
  styleUrls: ['./chart-tooltip.component.scss']
})
export class ChartTooltipComponent {

   @Input() IChartToolTip:IChartToolTip[]

}
