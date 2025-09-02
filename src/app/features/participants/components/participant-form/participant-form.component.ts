import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ParticipantsService } from '../../../../services/participants.service';
import { NotificationService } from '../../../../services/notification.service';
import { Participant, CreateParticipantDto, UpdateParticipantDto, SKILL_LEVELS } from '../../../../models/participant.model';

/**
 * Component for creating and editing participants
 * Handles both create (new) and edit modes based on route parameters
 */
@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss'],
  standalone: false
})
export class ParticipantFormComponent implements OnInit {
  // Injected services
  private readonly fb = inject(FormBuilder);
  private readonly participantsService = inject(ParticipantsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  // Form and state
  participantForm!: FormGroup;
  skillLevels = SKILL_LEVELS;
  
  // Signals for reactive state
  private readonly isEditMode = signal<boolean>(false);
  private readonly isLoading = signal<boolean>(false);
  private readonly participantId = signal<number | null>(null);
  private readonly currentParticipant = signal<Participant | null>(null);

  // Public readonly signals
  readonly loading = this.isLoading.asReadonly();
  readonly editMode = this.isEditMode.asReadonly();
  readonly participant = this.currentParticipant.asReadonly();

  ngOnInit(): void {
    this.initializeForm();
    this.checkRouteParams();
  }

  /**
   * Initialize the reactive form with validation
   */
  private initializeForm(): void {
    this.participantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,20}$/)]],
      linkedin: ['', [Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*$/)]],
      github_id: ['', [Validators.maxLength(50)]],
      python_skill: [0, [Validators.min(0), Validators.max(10)]],
      angular_skill: [0, [Validators.min(0), Validators.max(10)]],
      javascript_skill: [0, [Validators.min(0), Validators.max(10)]],
      html_skill: [0, [Validators.min(0), Validators.max(10)]],
      css_skill: [0, [Validators.min(0), Validators.max(10)]],
      java_skill: [0, [Validators.min(0), Validators.max(10)]],
      outcome: ['', [Validators.maxLength(1000)]]
    });
  }

  /**
   * Check route parameters to determine if this is edit mode
   */
  private checkRouteParams(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      const participantId = parseInt(id, 10);
      if (!isNaN(participantId)) {
        this.participantId.set(participantId);
        this.isEditMode.set(true);
        this.loadParticipant(participantId);
      }
    }
  }

  /**
   * Load participant data for editing
   */
  private loadParticipant(id: number): void {
    this.isLoading.set(true);
    this.participantsService.get(id).subscribe({
      next: (participant) => {
        this.currentParticipant.set(participant);
        this.populateForm(participant);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.isLoading.set(false);
        this.router.navigate(['/participants']);
      }
    });
  }

  /**
   * Populate form with participant data
   */
  private populateForm(participant: Participant): void {
    this.participantForm.patchValue({
      name: participant.name,
      email: participant.email,
      whatsapp: participant.whatsapp,
      linkedin: participant.linkedin,
      github_id: participant.github_id,
      python_skill: participant.python_skill,
      angular_skill: participant.angular_skill,
      javascript_skill: participant.javascript_skill,
      html_skill: participant.html_skill,
      css_skill: participant.css_skill,
      java_skill: participant.java_skill,
      outcome: participant.outcome
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.participantForm.valid) {
      this.isLoading.set(true);
      const formData = this.participantForm.value;

      if (this.isEditMode()) {
        this.updateParticipant(formData);
      } else {
        this.createParticipant(formData);
      }
    } else {
      this.markFormGroupTouched();
      this.notificationService.showError('Please fix the validation errors before submitting');
    }
  }

  /**
   * Create new participant
   */
  private createParticipant(data: CreateParticipantDto): void {
    this.participantsService.create(data).subscribe({
      next: (participant) => {
        this.notificationService.showSuccess(`Participant "${participant.name}" created successfully`);
        this.router.navigate(['/participants']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Update existing participant
   */
  private updateParticipant(data: UpdateParticipantDto): void {
    const id = this.participantId();
    if (id) {
      this.participantsService.update(id, data).subscribe({
        next: (participant) => {
          this.notificationService.showSuccess(`Participant "${participant.name}" updated successfully`);
          this.router.navigate(['/participants']);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.notificationService.showError(error.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  /**
   * Cancel and navigate back
   */
  onCancel(): void {
    this.location.back();
  }

  /**
   * Reset form to initial state
   */
  onReset(): void {
    if (this.isEditMode() && this.currentParticipant()) {
      this.populateForm(this.currentParticipant()!);
    } else {
      this.participantForm.reset();
      // Reset skill levels to 0
      Object.keys(this.participantForm.controls).forEach(key => {
        if (key.includes('_skill')) {
          this.participantForm.get(key)?.setValue(0);
        }
      });
    }
    this.notificationService.showInfo('Form reset to original values');
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.participantForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    
    if (errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${this.getFieldLabel(controlName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.getFieldLabel(controlName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      if (controlName === 'whatsapp') {
        return 'Please enter a valid WhatsApp number (10-20 digits, can include +, -, (, ), spaces)';
      }
      if (controlName === 'linkedin') {
        return 'Please enter a valid LinkedIn URL (https://linkedin.com/...)';
      }
      return 'Please enter a valid format';
    }
    if (errors['min'] || errors['max']) {
      return 'Skill level must be between 0 and 10';
    }

    return 'Invalid input';
  }

  /**
   * Get user-friendly field label
   */
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      github_id: 'GitHub ID',
      python_skill: 'Python Skill',
      angular_skill: 'Angular Skill',
      javascript_skill: 'JavaScript Skill',
      html_skill: 'HTML Skill',
      css_skill: 'CSS Skill',
      java_skill: 'Java Skill',
      outcome: 'Outcome'
    };
    return labels[controlName] || controlName;
  }

  /**
   * Check if field has error and is touched
   */
  hasError(controlName: string): boolean {
    const control = this.participantForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.participantForm.controls).forEach(key => {
      const control = this.participantForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get page title based on mode
   */
  getPageTitle(): string {
    return this.isEditMode() ? 'Edit Participant' : 'Add New Participant';
  }

  /**
   * Get submit button text based on mode
   */
  getSubmitButtonText(): string {
    if (this.isLoading()) {
      return this.isEditMode() ? 'Updating...' : 'Creating...';
    }
    return this.isEditMode() ? 'Update Participant' : 'Create Participant';
  }
}
