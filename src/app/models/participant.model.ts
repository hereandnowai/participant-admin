/**
 * Participant Data Models and Types
 * 
 * TypeScript interfaces and types for participant management system.
 * Provides comprehensive type safety for all participant-related operations
 * and ensures consistency between frontend and Laravel backend API.
 * 
 * Features:
 * - Strict TypeScript interfaces for API data structures
 * - DTO patterns for create/update operations
 * - Utility types for skill levels and statistics
 * - Validation-ready data structures
 * 
 * @author HERE AND NOW AI Development Team
 * @version 1.0.0
 * @since Angular 20.2.1
 */

/**
 * Participant Interface
 * 
 * Represents a complete participant entity from the Laravel API.
 * Includes all fields returned by the backend including timestamps.
 * 
 * @interface Participant
 * @property {number} id - Unique identifier (auto-generated)
 * @property {string} name - Participant's full name
 * @property {string} whatsapp - WhatsApp contact number
 * @property {string} email - Email address (unique)
 * @property {string} linkedin - LinkedIn profile URL
 * @property {string} github_id - GitHub username/profile
 * @property {number} python_skill - Python skill level (1-10)
 * @property {number} angular_skill - Angular skill level (1-10)
 * @property {number} javascript_skill - JavaScript skill level (1-10)
 * @property {number} html_skill - HTML skill level (1-10)
 * @property {number} css_skill - CSS skill level (1-10)
 * @property {number} java_skill - Java skill level (1-10)
 * @property {string} outcome - Training outcome/status
 * @property {string} created_at - Creation timestamp (ISO format)
 * @property {string} updated_at - Last update timestamp (ISO format)
 */
export interface Participant {
  id: number;
  name: string;
  whatsapp: string;
  email: string;
  linkedin: string;
  github_id: string;
  python_skill: number;
  angular_skill: number;
  javascript_skill: number;
  html_skill: number;
  css_skill: number;
  java_skill: number;
  outcome: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create Participant DTO
 * 
 * Data Transfer Object for creating new participants.
 * Excludes auto-generated fields (id, timestamps).
 * 
 * @interface CreateParticipantDto
 */
export interface CreateParticipantDto {
  name: string;
  whatsapp: string;
  email: string;
  linkedin: string;
  github_id: string;
  python_skill: number;
  angular_skill: number;
  javascript_skill: number;
  html_skill: number;
  css_skill: number;
  java_skill: number;
  outcome: string;
}

/**
 * DTO for updating an existing participant
 */
export interface UpdateParticipantDto extends Partial<CreateParticipantDto> {}

/**
 * Skill level options for dropdowns (1-10 scale)
 */
export const SKILL_LEVELS = [
  { value: 0, label: 'Not specified' },
  { value: 1, label: '1 - Beginner' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5 - Intermediate' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10 - Expert' }
];

/**
 * Skills that can be tracked
 */
export type SkillType = 'python_skill' | 'angular_skill' | 'javascript_skill' | 'html_skill' | 'css_skill' | 'java_skill';

/**
 * API response wrapper for list endpoints
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

/**
 * Statistics interface for dashboard
 */
export interface ParticipantStats {
  totalCount: number;
  averageSkills: {
    python: number;
    angular: number;
    javascript: number;
    html: number;
    css: number;
    java: number;
  };
  skillDistribution: {
    [skill in SkillType]: {
      low: number;    // 1-3
      medium: number; // 4-6
      high: number;   // 7-10
    };
  };
}
