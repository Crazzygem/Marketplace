import { TestBed } from '@angular/core/testing';

import { ExampleService } from './example.service';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExampleService]
    });
    service = TestBed.inject(ExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getGreeting', () => {
    it('should return the expected greeting string', () => {
      const result = service.getGreeting();

      expect(result).toBe('Hello, World!');
    });
  });
});
