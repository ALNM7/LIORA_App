import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHighJManageComponent } from './admin-high-j-manage.component';

describe('AdminHighJManageComponent', () => {
  let component: AdminHighJManageComponent;
  let fixture: ComponentFixture<AdminHighJManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHighJManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHighJManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
