import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersAnalysisChartComponent } from './containers-analysis-chart.component';

describe('ContainersAnalysisChartComponent', () => {
  let component: ContainersAnalysisChartComponent;
  let fixture: ComponentFixture<ContainersAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainersAnalysisChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainersAnalysisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
