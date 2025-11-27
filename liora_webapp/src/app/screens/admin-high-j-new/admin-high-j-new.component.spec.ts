import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHighJNewComponent } from './admin-high-j-new.component';

describe('AdminHighJNewComponent', () => {
  let component: AdminHighJNewComponent;
  let fixture: ComponentFixture<AdminHighJNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHighJNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHighJNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
