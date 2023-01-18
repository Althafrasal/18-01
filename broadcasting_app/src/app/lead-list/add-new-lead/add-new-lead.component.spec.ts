import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLeadComponent } from './add-new-lead.component';

describe('AddNewLeadComponent', () => {
  let component: AddNewLeadComponent;
  let fixture: ComponentFixture<AddNewLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewLeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
