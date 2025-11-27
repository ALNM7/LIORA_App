import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighJComponent } from './high-j.component';

describe('HighJComponent', () => {
  let component: HighJComponent;
  let fixture: ComponentFixture<HighJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighJComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
