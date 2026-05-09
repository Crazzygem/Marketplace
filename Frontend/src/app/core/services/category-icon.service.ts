import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryIconService {
  public categoryIcons: Record<string, string> = {
    Electronics: 'fa-mobile-alt',
    Fashion: 'fa-tshirt',
    'Home & Garden': 'fa-home',
    Sports: 'fa-running',
    Books: 'fa-book',
    Beauty: 'fa-spa',
    General: 'fa-box',
    Other: 'fa-tag',
    Toys: 'fa-gamepad',
    Automotive: 'fa-car',
    Food: 'fa-utensils',
  };

  getIcon(categoryName: string): string {
    return this.categoryIcons[categoryName] || 'fa-tag';
  }
}
