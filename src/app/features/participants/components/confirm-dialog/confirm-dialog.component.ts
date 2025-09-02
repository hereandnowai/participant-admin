import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

/**
 * Reusable confirmation dialog component
 * Used for confirming destructive actions like delete
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Set default values
    this.data.confirmText = this.data.confirmText || 'Confirm';
    this.data.cancelText = this.data.cancelText || 'Cancel';
    this.data.type = this.data.type || 'info';
  }

  /**
   * Handle confirm action
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Handle cancel action
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Get the appropriate icon for the dialog type
   */
  getIcon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'info';
    }
  }

  /**
   * Get the appropriate color for the confirm button
   */
  getConfirmButtonColor(): string {
    return this.data.type === 'danger' ? 'warn' : 'primary';
  }
}
