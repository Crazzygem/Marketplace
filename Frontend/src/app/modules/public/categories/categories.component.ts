import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../core/models/category';
import { LoggerService } from '../../../core/services/logger.service';
import { CategoryIconService } from '../../../core/services/category-icon.service';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);
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
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading categories:', error);
        this.loading = false;
        this.cdr.markForCheck();
      },
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
