export interface Participant {
  id?: number;
  name: string;
  whatsapp?: string;
  email?: string;
  linkedin?: string;
  github_id?: string;
  python_skill?: number;
  angular_skill?: number;
  javascript_skill?: number;
  html_skill?: number;
  css_skill?: number;
  java_skill?: number;
  outcome?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateParticipantDto {
  name: string;
  whatsapp?: string;
  email?: string;
  linkedin?: string;
  github_id?: string;
  python_skill?: number;
  angular_skill?: number;
  javascript_skill?: number;
  html_skill?: number;
  css_skill?: number;
  java_skill?: number;
  outcome?: string;
}

export interface UpdateParticipantDto extends CreateParticipantDto {
}
