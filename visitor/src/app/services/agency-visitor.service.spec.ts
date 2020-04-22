import { TestBed } from '@angular/core/testing';

import { AgencyVisitorService } from './agency-visitor.service';

describe('AgencyVisitorService', () => {
  let service: AgencyVisitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgencyVisitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
