import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAdminsComponent } from './tenant-admins.component';

describe('TenantAdminsComponent', () => {
  let component: TenantAdminsComponent;
  let fixture: ComponentFixture<TenantAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantAdminsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
