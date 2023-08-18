import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarExampleComponent } from './bar-example.component';

describe('BarExampleComponent', () => {
  let component: BarExampleComponent;
  let fixture: ComponentFixture<BarExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
