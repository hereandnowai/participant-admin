import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { 
  Participant, 
  CreateParticipantDto, 
  UpdateParticipantDto, 
  ApiResponse 
} from '../models/participant.model';
import { environment } from '../../environments/environment';

/**
 * ParticipantsService
 * 
 * Core service for managing participant data with Laravel REST API integration.
 * Uses Angular Signals for reactive state management and provides comprehensive
 * CRUD operations with error handling and loading states.
 * 
 * Features:
 * - Signal-based state management for reactive UI updates
 * - HTTP error handling with user-friendly messages
 * - Loading state management for UI feedback
 * - Real-time data synchronization with API
 * - TypeScript interfaces for type safety
 * 
 * State Signals:
 * - participants: Current participant list
 * - loading: Loading state for operations
 * - error: Error messages for user feedback
 * - selectedParticipant: Currently selected participant
 * 
 * @author HERE AND NOW AI Development Team
 * @version 1.0.0
 * @since Angular 20.2.1
 */
@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private readonly apiUrl = `${environment.apiBaseUrl}/participants`;
  
  // Signals for reactive state management
  private readonly participantsSignal = signal<Participant[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  
  // Public readonly signals
  public readonly participants = this.participantsSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Fetch all participants from the API
   * Updates the participants signal with the response
   */
  list(): Observable<Participant[]> {
    this.setLoading(true);
    this.setError(null);
    
    return this.http.get<Participant[]>(this.apiUrl).pipe(
      tap(participants => {
        this.participantsSignal.set(participants);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load participants');
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a single participant by ID
   */
  get(id: number): Observable<Participant> {
    this.setLoading(true);
    this.setError(null);
    
    return this.http.get<Participant>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load participant');
        return this.handleError(error);
      })
    );
  }

  /**
   * Create a new participant
   */
  create(dto: CreateParticipantDto): Observable<Participant> {
    this.setLoading(true);
    this.setError(null);
    
    return this.http.post<Participant>(this.apiUrl, dto).pipe(
      tap(newParticipant => {
        // Add to local state
        const currentParticipants = this.participantsSignal();
        this.participantsSignal.set([...currentParticipants, newParticipant]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to create participant');
        return this.handleError(error);
      })
    );
  }

  /**
   * Update an existing participant
   */
  update(id: number, dto: UpdateParticipantDto): Observable<Participant> {
    this.setLoading(true);
    this.setError(null);
    
    return this.http.put<Participant>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updatedParticipant => {
        // Update local state
        const currentParticipants = this.participantsSignal();
        const index = currentParticipants.findIndex(p => p.id === id);
        if (index !== -1) {
          const updated = [...currentParticipants];
          updated[index] = updatedParticipant;
          this.participantsSignal.set(updated);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to update participant');
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete a participant by ID
   */
  remove(id: number): Observable<void> {
    this.setLoading(true);
    this.setError(null);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Remove from local state
        const currentParticipants = this.participantsSignal();
        const filtered = currentParticipants.filter(p => p.id !== id);
        this.participantsSignal.set(filtered);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to delete participant');
        return this.handleError(error);
      })
    );
  }

  /**
   * Refresh the participants list from the server
   */
  refresh(): Observable<Participant[]> {
    return this.list();
  }

  /**
   * Clear the error state
   */
  clearError(): void {
    this.setError(null);
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  /**
   * Set error state
   */
  private setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  /**
   * Handle HTTP errors and return user-friendly error messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please check your API key.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = `Validation error: ${validationErrors.join(', ')}`;
          }
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
