import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SavedItemsService, SavedItem } from '../../../core/services/saved-items.service';
import { AuthService } from '../../../core/services/auth';
import { ListingCardComponent } from '../../../shared/components/listing-card/listing-card.component';
import { Listing } from '../../../core/models/listing';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saved-items',
  standalone: true,
  imports: [CommonModule, FormsModule, ListingCardComponent, EmptyStateComponent, SkeletonComponent],
  templateUrl: './saved-items.component.html',
  styleUrls: ['./saved-items.component.css']
})
export class SavedItemsComponent implements OnInit {
  private savedItemsService = inject(SavedItemsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  savedItems: SavedItem[] = [];
  loading = this.savedItemsService.loading.asReadonly();

  constructor() {
    // Use effect to reactively update saved items when the signal changes
    effect(() => {
      this.savedItems = this.savedItemsService.items();
    });
  }

  ngOnInit() {
    // Initialization logic if needed
  }

  handleSaveToggle(listing: Listing) {
    // When user clicks the save button on a saved item, remove it
    this.savedItemsService.removeFromSavedItems(listing.listing_id);
  }

  handleRemove(listingId: number) {
    this.savedItemsService.removeFromSavedItems(listingId);
  }

  clearSavedItems() {
    if (confirm('Are you sure you want to clear all saved items?')) {
      this.savedItemsService.clearSavedItems();
    }
  }

  viewItem(listingId: number) {
    this.router.navigate(['/public/product', listingId]);
  }

  navigateToHome() {
    this.router.navigate(['/public/home']);
  }
}
