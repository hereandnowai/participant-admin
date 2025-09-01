import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipantsService } from '../services/participants.service';
import { Participant, CreateParticipantDto, UpdateParticipantDto } from '../models/participant.model';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent implements OnInit {
  participantForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  participantId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private participantsService: ParticipantsService,
    private snackBar: MatSnackBar
  ) {
    this.participantForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.participantId = +id;
        this.loadParticipant(this.participantId);
      }
    });
  }

  /**
   * Create the reactive form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.email]],
      whatsapp: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      linkedin: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      github_id: [''],
      python_skill: [1, [Validators.min(1), Validators.max(10)]],
      angular_skill: [1, [Validators.min(1), Validators.max(10)]],
      javascript_skill: [1, [Validators.min(1), Validators.max(10)]],
      html_skill: [1, [Validators.min(1), Validators.max(10)]],
      css_skill: [1, [Validators.min(1), Validators.max(10)]],
      java_skill: [1, [Validators.min(1), Validators.max(10)]],
      outcome: ['']
    });
  }

  /**
   * Load participant data for editing
   */
  private loadParticipant(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.participantsService.get(id).subscribe({
      next: (participant) => {
        this.populateForm(participant);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.snackBar.open('Failed to load participant data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Populate form with participant data
   */
  private populateForm(participant: Participant): void {
    this.participantForm.patchValue({
      name: participant.name,
      email: participant.email || '',
      whatsapp: participant.whatsapp || '',
      linkedin: participant.linkedin || '',
      github_id: participant.github_id || '',
      python_skill: participant.python_skill || 1,
      angular_skill: participant.angular_skill || 1,
      javascript_skill: participant.javascript_skill || 1,
      html_skill: participant.html_skill || 1,
      css_skill: participant.css_skill || 1,
      java_skill: participant.java_skill || 1,
      outcome: participant.outcome || ''
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.participantForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formData = this.participantForm.value;
      
      // Clean up the data - remove empty strings and convert to appropriate types
      const participantData = this.cleanFormData(formData);

      if (this.isEditMode && this.participantId) {
        this.updateParticipant(this.participantId, participantData);
      } else {
        this.createParticipant(participantData);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.participantForm.markAllAsTouched();
      this.snackBar.open('Please fix the form errors', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  /**
   * Clean form data before sending to API
   */
  private cleanFormData(formData: any): CreateParticipantDto | UpdateParticipantDto {
    const cleaned: any = {
      name: formData.name
    };

    // Only include non-empty optional fields
    if (formData.email?.trim()) cleaned.email = formData.email.trim();
    if (formData.whatsapp?.trim()) cleaned.whatsapp = formData.whatsapp.trim();
    if (formData.linkedin?.trim()) cleaned.linkedin = formData.linkedin.trim();
    if (formData.github_id?.trim()) cleaned.github_id = formData.github_id.trim();
    if (formData.outcome?.trim()) cleaned.outcome = formData.outcome.trim();

    // Include skill ratings (always include as they have default values)
    cleaned.python_skill = formData.python_skill;
    cleaned.angular_skill = formData.angular_skill;
    cleaned.javascript_skill = formData.javascript_skill;
    cleaned.html_skill = formData.html_skill;
    cleaned.css_skill = formData.css_skill;
    cleaned.java_skill = formData.java_skill;

    return cleaned;
  }

  /**
   * Create new participant
   */
  private createParticipant(participantData: CreateParticipantDto): void {
    this.participantsService.create(participantData).subscribe({
      next: (participant) => {
        this.isSubmitting = false;
        this.snackBar.open('Participant created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/participants']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message;
        this.snackBar.open(`Failed to create participant: ${error.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Update existing participant
   */
  private updateParticipant(id: number, participantData: UpdateParticipantDto): void {
    this.participantsService.update(id, participantData).subscribe({
      next: (participant) => {
        this.isSubmitting = false;
        this.snackBar.open('Participant updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/participants']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message;
        this.snackBar.open(`Failed to update participant: ${error.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Format slider label for display
   */
  formatSliderLabel(value: number): string {
    return `${value}`;
  }
}
