import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelryDetailComponent } from './jewelry-detail.component';

describe('JewelryDetailComponent', () => {
  let component: JewelryDetailComponent;
  let fixture: ComponentFixture<JewelryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JewelryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JewelryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
