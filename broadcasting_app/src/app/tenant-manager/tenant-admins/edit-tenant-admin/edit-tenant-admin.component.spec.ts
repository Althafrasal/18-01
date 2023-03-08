import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTenantAdminComponent } from './edit-tenant-admin.component';

describe('EditTenantAdminComponent', () => {
  let component: EditTenantAdminComponent;
  let fixture: ComponentFixture<EditTenantAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTenantAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTenantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
