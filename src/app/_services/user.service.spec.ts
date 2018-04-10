import { TestBed, inject } from '@angular/core/testing';

import { User.ServiceService } from './user.service.service';

describe('User.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [User.ServiceService]
    });
  });

  it('should be created', inject([User.ServiceService], (service: User.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
