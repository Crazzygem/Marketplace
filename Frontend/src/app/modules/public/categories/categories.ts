import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../core/models/category';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { LoggerService } from '../../../core/services/logger.service';
import { CategoryIconService } from '../../../core/services/category-icon.service';

@Component({
  selector: 'app-categories',
  imports: [NgFor, NgIf],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  categoryIconService = inject(CategoryIconService);

  categories: Category[] = [];
  loading = true;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  viewCategory(categoryId: number) {
    // Navigate to home page with category filter
    this.router.navigate(['/public/home'], { queryParams: { category_id: categoryId } });
  }

  goToHome() {
    this.router.navigate(['/public/home']);
  }
}
