import { TestBed } from '@angular/core/testing';

import { CartUiService } from './cart-ui.service';

describe('CartUiService', () => {
  let service: CartUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
