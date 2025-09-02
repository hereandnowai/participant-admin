import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Sort } from '@angular/material/sort';

import { ParticipantsService } from '../../../../services/participants.service';
import { NotificationService } from '../../../../services/notification.service';
import { Participant } from '../../../../models/participant.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * Component for displaying and managing the list of participants
 * Features: search, sort, pagination, CRUD operations
 */
@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
  standalone: false
})
export class ParticipantsListComponent implements OnInit {
  // Injected services
  private readonly participantsService = inject(ParticipantsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  // Table configuration
  displayedColumns: string[] = [
    'name', 
    'email', 
    'whatsapp', 
    'linkedin', 
    'github_id', 
    'created_at', 
    'actions'
  ];

  // Reactive signals
  readonly searchQuery = signal<string>('');
  readonly participants = this.participantsService.participants;
  
  // Table data source
  dataSource = new MatTableDataSource<Participant>([]);
  
  // Computed filtered participants
  filteredParticipants = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const participants = this.participants();
    
    if (!query) {
      return participants;
    }
    
    return participants.filter(participant => 
      participant.name.toLowerCase().includes(query) ||
      participant.email.toLowerCase().includes(query) ||
      participant.github_id.toLowerCase().includes(query)
    );
  });

  // Loading and error states
  loading = this.participantsService.loading;
  error = this.participantsService.error;

  ngOnInit(): void {
    this.loadParticipants();
    
    // Update data source when filtered participants change
    this.dataSource.data = this.filteredParticipants();
    
    // Watch for changes in filtered participants
    this.updateDataSource();
  }

  /**
   * Load participants from the API
   */
  loadParticipants(): void {
    this.participantsService.list().subscribe({
      next: () => {
        this.notificationService.showSuccess('Participants loaded successfully');
      },
      error: (error) => {
        this.notificationService.showError(error.message);
      }
    });
  }

  /**
   * Handle search input changes
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.updateDataSource();
  }

  /**
   * Clear search and reset filters
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.updateDataSource();
  }

  /**
   * Handle table sorting
   */
  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * Navigate to create new participant
   */
  addParticipant(): void {
    this.router.navigate(['/participants/new']);
  }

  /**
   * Navigate to view/edit participant
   */
  viewParticipant(participant: Participant): void {
    this.router.navigate(['/participants', participant.id]);
  }

  /**
   * Edit participant
   */
  editParticipant(participant: Participant): void {
    this.router.navigate(['/participants', participant.id]);
  }

  /**
   * Delete participant with confirmation
   */
  deleteParticipant(participant: Participant): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Participant',
        message: `Are you sure you want to delete "${participant.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.participantsService.remove(participant.id).subscribe({
          next: () => {
            this.notificationService.showSuccess(`Participant "${participant.name}" deleted successfully`);
            this.updateDataSource();
          },
          error: (error) => {
            this.notificationService.showError(error.message);
          }
        });
      }
    });
  }

  /**
   * Refresh the participants list
   */
  refresh(): void {
    this.participantsService.refresh().subscribe({
      next: () => {
        this.notificationService.showSuccess('Participants refreshed');
      },
      error: (error) => {
        this.notificationService.showError(error.message);
      }
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Get truncated text for display
   */
  getTruncatedText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Update the data source with filtered results
   */
  private updateDataSource(): void {
    this.dataSource.data = this.filteredParticipants();
  }

  /**
   * Track by function for performance optimization
   */
  trackByParticipant(index: number, participant: Participant): number {
    return participant.id;
  }
}
