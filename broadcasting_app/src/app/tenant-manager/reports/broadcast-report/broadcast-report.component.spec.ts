import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastReportComponent } from './broadcast-report.component';

describe('BroadcastReportComponent', () => {
  let component: BroadcastReportComponent;
  let fixture: ComponentFixture<BroadcastReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
