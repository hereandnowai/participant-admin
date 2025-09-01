import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Participant, CreateParticipantDto, UpdateParticipantDto } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private readonly apiUrl = `${environment.apiBaseUrl}/participants`;

  constructor(private http: HttpClient) { }

  /**
   * Get all participants
   */
  list(): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a single participant by ID
   */
  get(id: number): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create a new participant
   */
  create(participantDto: CreateParticipantDto): Observable<Participant> {
    return this.http.post<Participant>(this.apiUrl, participantDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing participant
   */
  update(id: number, participantDto: UpdateParticipantDto): Observable<Participant> {
    return this.http.put<Participant>(`${this.apiUrl}/${id}`, participantDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a participant
   */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors and provide user-friendly messages
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
          errorMessage = 'Participant not found.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error('ParticipantsService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
