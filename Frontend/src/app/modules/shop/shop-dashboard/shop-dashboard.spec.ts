import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ShopDashboardComponent } from './shop-dashboard';

describe('ShopDashboardComponent', () => {
  let component: ShopDashboardComponent;
  let fixture: ComponentFixture<ShopDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ShopDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
