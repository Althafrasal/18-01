import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewAdminComponent } from './addnew-admin.component';

describe('AddnewAdminComponent', () => {
  let component: AddnewAdminComponent;
  let fixture: ComponentFixture<AddnewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
