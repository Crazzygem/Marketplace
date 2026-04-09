import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from '../../../core/models/listing';
import { getImageUrl } from '../../utils/image.utils';

import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent {
  @Input({ required: true }) listing!: Listing;
  @Input() showSaveButton = true;
  @Input() showStatusBadge = true;
  @Input() showViewCount = true;
  @Input() isSaved = false;

  @Output() onSaveToggle = new EventEmitter<Listing>();
  @Output() onRemove = new EventEmitter<number>();
  @Output() onView = new EventEmitter<number>();

  getImageUrl = getImageUrl;

  getStatusVariant(status: string, isSold?: boolean): 'success' | 'destructive' | 'warning' | 'info' {
    if (isSold) return 'destructive';
    if (status === 'Active') return 'success';
    return 'warning';
  }

  getStatusText(status: string, isSold?: boolean): string {
    if (isSold) return 'SOLD';
    if (status === 'Active') return 'Available';
    return status;
  }

  handleSaveToggle(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onSaveToggle.emit(this.listing);
  }

  handleRemove(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onRemove.emit(this.listing.listing_id);
  }

  handleView(): void {
    this.onView.emit(this.listing.listing_id);
  }
}
