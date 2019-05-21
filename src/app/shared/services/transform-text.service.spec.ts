import { TestBed, inject } from '@angular/core/testing';

import { TransformTextService } from './transform-text.service';

describe('TransformTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransformTextService]
    });
  });

  it('should be created', inject([TransformTextService], (service: TransformTextService) => {
    expect(service).toBeTruthy();
  }));
});
