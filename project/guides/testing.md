# Guide: Testing Guidelines

**Purpose**: Testing standards for Angular and Laravel.

**Frontend (Angular)**:
```typescript
// Test setup
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule, RouterTestingModule],
  providers: [provideMockStore()]
});

// Mock services
mockService = TestBed.inject(MockService);

// Test observables
it('should return data', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeTruthy();
    done();
  });
});
```

**Backend (Laravel)**:
```php
// Feature test
public function test_user_can_create_listing()
{
    $user = User::factory()->create();
    $response = $this->actingAs($user)->post('/api/listings', [
        'title' => 'Test Listing'
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['id', 'title']);
}
```

**Key Points**:
- Frontend: `HttpClientTestingModule`, `RouterTestingModule`. Use `beforeEach()`. Mock services with `TestBed.inject()`. Test observables with `done` or `fakeAsync`/`tick`.
- Backend: Feature tests in `tests/Feature/`, Unit tests in `tests/Unit/`. Use factories: `User::factory()->create()`. `assertStatus()`, `assertJsonStructure()`. SQLite in-memory. `RefreshDatabase` trait.

**Reference**: Angular Testing Guide, Laravel Testing docs
