import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Participant } from '../models/participant.model';
import { ParticipantsService } from '../services/participants.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'whatsapp', 'linkedin', 'github_id', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<Participant>([]);
  isLoading = false;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private participantsService: ParticipantsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadParticipants();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Load all participants from the API
   */
  loadParticipants(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.participantsService.list().subscribe({
      next: (participants) => {
        this.dataSource.data = participants;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.snackBar.open('Failed to load participants', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Apply search filter to the table
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Filter by name, email, and github_id
    this.dataSource.filterPredicate = (data: Participant, filter: string) => {
      const searchStr = `${data.name} ${data.email || ''} ${data.github_id || ''}`.toLowerCase();
      return searchStr.includes(filter);
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Confirm delete action with dialog
   */
  confirmDelete(participant: Participant): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '300px',
      data: { name: participant.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && participant.id) {
        this.deleteParticipant(participant.id);
      }
    });
  }

  /**
   * Delete participant
   */
  private deleteParticipant(id: number): void {
    this.participantsService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Participant deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadParticipants(); // Refresh the list
      },
      error: (error) => {
        this.snackBar.open(`Failed to delete participant: ${error.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}

// Simple confirmation dialog component
@Component({
  selector: 'confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete participant "{{ data.name }}"?</p>
      <p><small>This action cannot be undone.</small></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="warn" (click)="onConfirm()" cdkFocusInitial>Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
