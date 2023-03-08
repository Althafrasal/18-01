import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeadComponent } from './edit-lead.component';

describe('EditLeadComponent', () => {
  let component: EditLeadComponent;
  let fixture: ComponentFixture<EditLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
