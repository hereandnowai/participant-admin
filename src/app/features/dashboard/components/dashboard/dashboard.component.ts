import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { ParticipantsService } from '../../../../services/participants.service';
import { NotificationService } from '../../../../services/notification.service';
import { Participant, ParticipantStats, SkillType } from '../../../../models/participant.model';

/**
 * Dashboard component displaying participant analytics and statistics
 * Features: KPIs, charts showing skill distributions and averages
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  // Injected services
  private readonly participantsService = inject(ParticipantsService);
  private readonly notificationService = inject(NotificationService);

  // Chart configurations
  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';
  
  // Chart data
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  // Chart options
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Average Skill Levels'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Skill Level (1-10)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Technologies'
        }
      }
    }
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Skill Level Distribution'
      }
    }
  };

  // State signals
  private readonly participants = this.participantsService.participants;
  readonly selectedSkillForPie = signal<SkillType>('python_skill');
  
  // Loading and error states
  readonly loading = this.participantsService.loading;
  readonly error = this.participantsService.error;

  // Computed statistics
  readonly stats = computed(() => this.calculateStats(this.participants()));
  readonly skillOptions = [
    { value: 'python_skill' as SkillType, label: 'Python' },
    { value: 'angular_skill' as SkillType, label: 'Angular' },
    { value: 'javascript_skill' as SkillType, label: 'JavaScript' },
    { value: 'html_skill' as SkillType, label: 'HTML' },
    { value: 'css_skill' as SkillType, label: 'CSS' },
    { value: 'java_skill' as SkillType, label: 'Java' }
  ];

  ngOnInit(): void {
    this.loadParticipants();
    
    // Update charts when data changes
    this.updateCharts();
  }

  /**
   * Load participants data
   */
  loadParticipants(): void {
    this.participantsService.list().subscribe({
      next: () => {
        this.updateCharts();
      },
      error: (error) => {
        this.notificationService.showError(error.message);
      }
    });
  }

  /**
   * Calculate statistics from participants data
   */
  private calculateStats(participants: Participant[]): ParticipantStats {
    if (participants.length === 0) {
      return {
        totalCount: 0,
        averageSkills: {
          python: 0,
          angular: 0,
          javascript: 0,
          html: 0,
          css: 0,
          java: 0
        },
        skillDistribution: {} as any
      };
    }

    // Calculate average skills (excluding 0 values)
    const averageSkills = {
      python: this.calculateAverageSkill(participants, 'python_skill'),
      angular: this.calculateAverageSkill(participants, 'angular_skill'),
      javascript: this.calculateAverageSkill(participants, 'javascript_skill'),
      html: this.calculateAverageSkill(participants, 'html_skill'),
      css: this.calculateAverageSkill(participants, 'css_skill'),
      java: this.calculateAverageSkill(participants, 'java_skill')
    };

    // Calculate skill distribution
    const skillDistribution: ParticipantStats['skillDistribution'] = {} as any;
    this.skillOptions.forEach(skill => {
      skillDistribution[skill.value] = this.calculateSkillDistribution(participants, skill.value);
    });

    return {
      totalCount: participants.length,
      averageSkills,
      skillDistribution
    };
  }

  /**
   * Calculate average skill level (excluding 0 values)
   */
  private calculateAverageSkill(participants: Participant[], skillField: SkillType): number {
    const validSkills = participants
      .map(p => p[skillField])
      .filter(skill => skill > 0);
    
    if (validSkills.length === 0) return 0;
    
    const sum = validSkills.reduce((acc, skill) => acc + skill, 0);
    return Math.round((sum / validSkills.length) * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Calculate skill level distribution (Low: 1-3, Medium: 4-6, High: 7-10)
   */
  private calculateSkillDistribution(participants: Participant[], skillField: SkillType) {
    const skills = participants
      .map(p => p[skillField])
      .filter(skill => skill > 0);

    const distribution = {
      low: skills.filter(skill => skill >= 1 && skill <= 3).length,
      medium: skills.filter(skill => skill >= 4 && skill <= 6).length,
      high: skills.filter(skill => skill >= 7 && skill <= 10).length
    };

    return distribution;
  }

  /**
   * Update chart data when participants data changes
   */
  private updateCharts(): void {
    this.updateBarChart();
    this.updatePieChart();
  }

  /**
   * Update bar chart with average skills data
   */
  private updateBarChart(): void {
    const stats = this.stats();
    
    this.barChartData = {
      labels: ['Python', 'Angular', 'JavaScript', 'HTML', 'CSS', 'Java'],
      datasets: [
        {
          label: 'Average Skill Level',
          data: [
            stats.averageSkills.python,
            stats.averageSkills.angular,
            stats.averageSkills.javascript,
            stats.averageSkills.html,
            stats.averageSkills.css,
            stats.averageSkills.java
          ],
          backgroundColor: [
            '#3776ab', // Python blue
            '#dd0031', // Angular red
            '#f7df1e', // JavaScript yellow
            '#e34c26', // HTML orange
            '#1572b6', // CSS blue
            '#ed8b00'  // Java orange
          ],
          borderColor: [
            '#2d5d8b',
            '#b8002a',
            '#c4b91a',
            '#c13b1f',
            '#115a94',
            '#c7730b'
          ],
          borderWidth: 1
        }
      ]
    };
  }

  /**
   * Update pie chart with skill distribution data
   */
  private updatePieChart(): void {
    const stats = this.stats();
    const selectedSkill = this.selectedSkillForPie();
    const distribution = stats.skillDistribution[selectedSkill];

    if (!distribution) {
      this.pieChartData = { labels: [], datasets: [] };
      return;
    }

    this.pieChartData = {
      labels: ['Low (1-3)', 'Medium (4-6)', 'High (7-10)'],
      datasets: [
        {
          data: [distribution.low, distribution.medium, distribution.high],
          backgroundColor: [
            '#ff6b6b', // Red for low
            '#feca57', // Yellow for medium
            '#48ca26'  // Green for high
          ],
          borderColor: [
            '#ee5a52',
            '#fd9644',
            '#2ed573'
          ],
          borderWidth: 2
        }
      ]
    };
  }

  /**
   * Handle skill selection change for pie chart
   */
  onSkillSelectionChange(skill: SkillType): void {
    this.selectedSkillForPie.set(skill);
    this.updatePieChart();
  }

  /**
   * Refresh dashboard data
   */
  refresh(): void {
    this.participantsService.refresh().subscribe({
      next: () => {
        this.notificationService.showSuccess('Dashboard data refreshed');
        this.updateCharts();
      },
      error: (error) => {
        this.notificationService.showError(error.message);
      }
    });
  }

  /**
   * Get the selected skill label for display
   */
  getSelectedSkillLabel(): string {
    const skill = this.skillOptions.find(s => s.value === this.selectedSkillForPie());
    return skill?.label || 'Unknown';
  }

  /**
   * Check if there's data to display
   */
  hasData(): boolean {
    return this.participants().length > 0;
  }

  /**
   * Get formatted percentage for skill distribution
   */
  getSkillPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
  }

  /**
   * Get appropriate icon for skill type
   */
  getSkillIcon(skillType: SkillType): string {
    const iconMap: { [key in SkillType]: string } = {
      python_skill: 'code',
      angular_skill: 'web',
      javascript_skill: 'javascript',
      html_skill: 'language',
      css_skill: 'palette',
      java_skill: 'coffee'
    };
    return iconMap[skillType] || 'code';
  }

  /**
   * Safely get skill value from averageSkills object
   * @param skillType The skill type with or without '_skill' suffix
   * @returns The skill value or 0 if not found
   */
  getSkillValue(skillType: string): number {
    const skillKey = skillType.replace('_skill', '');
    const skills = this.stats().averageSkills as Record<string, number>;
    return skills[skillKey] || 0;
  }
}
