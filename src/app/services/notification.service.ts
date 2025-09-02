import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Service for displaying user notifications using Material Snackbar
 * Provides methods for showing success, error, and info messages
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success message
   */
  showSuccess(message: string, duration?: number): void {
    this.snackBar.open(message, '✓', {
      ...this.defaultConfig,
      duration: duration || 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show an error message
   */
  showError(message: string, duration?: number): void {
    this.snackBar.open(message, '✗', {
      ...this.defaultConfig,
      duration: duration || 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Show an info message
   */
  showInfo(message: string, duration?: number): void {
    this.snackBar.open(message, 'ℹ', {
      ...this.defaultConfig,
      duration: duration || 4000,
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Show a warning message
   */
  showWarning(message: string, duration?: number): void {
    this.snackBar.open(message, '⚠', {
      ...this.defaultConfig,
      duration: duration || 4000,
      panelClass: ['warning-snackbar']
    });
  }
}
