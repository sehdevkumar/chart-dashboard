import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BarchartComponent } from './barchart/barchart.component'
import { LandingPageComponent } from './landing-page/landing-page.component'

const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'barchart',
    component: BarchartComponent,
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
