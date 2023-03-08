import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantManagerComponent } from './tenant-manager.component';

describe('TenantManagerComponent', () => {
  let component: TenantManagerComponent;
  let fixture: ComponentFixture<TenantManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
