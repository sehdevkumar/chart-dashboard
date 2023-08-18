import { Component } from '@angular/core';
import { BarChartRenderingType } from './typings/platfom-typings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  changeFlag: BarChartRenderingType

  type = BarChartRenderingType

  onChange(event) {
     console.log(event.target.value)
     this.changeFlag = event.target.value
  }
}
