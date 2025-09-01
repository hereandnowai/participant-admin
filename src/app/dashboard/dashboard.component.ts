import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipantsService } from '../services/participants.service';
import { Participant } from '../models/participant.model';

// Register Chart.js components
Chart.register(...registerables);

interface DashboardStats {
  totalParticipants: number;
  avgPythonSkill: number;
  avgAngularSkill: number;
  avgJavaScriptSkill: number;
  avgHtmlSkill: number;
  avgCssSkill: number;
  avgJavaSkill: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('avgSkillsChart') avgSkillsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('skillDistributionChart') skillDistributionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('skillsRadarChart') skillsRadarChartRef!: ElementRef<HTMLCanvasElement>;

  participants: Participant[] = [];
  stats: DashboardStats = {
    totalParticipants: 0,
    avgPythonSkill: 0,
    avgAngularSkill: 0,
    avgJavaScriptSkill: 0,
    avgHtmlSkill: 0,
    avgCssSkill: 0,
    avgJavaSkill: 0
  };

  isLoading = false;
  errorMessage = '';

  private avgSkillsChart?: Chart;
  private skillDistributionChart?: Chart;
  private skillsRadarChart?: Chart;

  constructor(
    private participantsService: ParticipantsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  /**
   * Load participants data and compute statistics
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.participantsService.list().subscribe({
      next: (participants) => {
        this.participants = participants;
        this.computeStats();
        this.createCharts();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.snackBar.open('Failed to load dashboard data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Compute dashboard statistics
   */
  private computeStats(): void {
    const total = this.participants.length;
    
    if (total === 0) {
      this.stats = {
        totalParticipants: 0,
        avgPythonSkill: 0,
        avgAngularSkill: 0,
        avgJavaScriptSkill: 0,
        avgHtmlSkill: 0,
        avgCssSkill: 0,
        avgJavaSkill: 0
      };
      return;
    }

    const sumPython = this.participants.reduce((sum, p) => sum + (p.python_skill || 0), 0);
    const sumAngular = this.participants.reduce((sum, p) => sum + (p.angular_skill || 0), 0);
    const sumJavaScript = this.participants.reduce((sum, p) => sum + (p.javascript_skill || 0), 0);
    const sumHtml = this.participants.reduce((sum, p) => sum + (p.html_skill || 0), 0);
    const sumCss = this.participants.reduce((sum, p) => sum + (p.css_skill || 0), 0);
    const sumJava = this.participants.reduce((sum, p) => sum + (p.java_skill || 0), 0);

    this.stats = {
      totalParticipants: total,
      avgPythonSkill: sumPython / total,
      avgAngularSkill: sumAngular / total,
      avgJavaScriptSkill: sumJavaScript / total,
      avgHtmlSkill: sumHtml / total,
      avgCssSkill: sumCss / total,
      avgJavaSkill: sumJava / total
    };
  }

  /**
   * Create all dashboard charts
   */
  private createCharts(): void {
    if (this.stats.totalParticipants === 0) return;

    this.createAvgSkillsChart();
    this.createSkillDistributionChart();
    this.createSkillsRadarChart();
  }

  /**
   * Create average skills bar chart
   */
  private createAvgSkillsChart(): void {
    const ctx = this.avgSkillsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.avgSkillsChart) {
      this.avgSkillsChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: ['Python', 'Angular', 'JavaScript', 'HTML', 'CSS', 'Java'],
        datasets: [{
          label: 'Average Skill Level',
          data: [
            this.stats.avgPythonSkill,
            this.stats.avgAngularSkill,
            this.stats.avgJavaScriptSkill,
            this.stats.avgHtmlSkill,
            this.stats.avgCssSkill,
            this.stats.avgJavaSkill
          ],
          backgroundColor: [
            '#4CAF50', // Primary color
            '#FFC107', // Secondary color
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#F44336'
          ],
          borderColor: [
            '#4CAF50',
            '#FFC107',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#F44336'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    this.avgSkillsChart = new Chart(ctx, config);
  }

  /**
   * Create skill distribution pie chart (for Angular skills)
   */
  private createSkillDistributionChart(): void {
    const ctx = this.skillDistributionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.skillDistributionChart) {
      this.skillDistributionChart.destroy();
    }

    // Calculate distribution of Angular skills
    const beginner = this.participants.filter(p => (p.angular_skill || 0) <= 3).length;
    const intermediate = this.participants.filter(p => (p.angular_skill || 0) > 3 && (p.angular_skill || 0) <= 6).length;
    const advanced = this.participants.filter(p => (p.angular_skill || 0) > 6).length;

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Beginner (1-3)', 'Intermediate (4-6)', 'Advanced (7-10)'],
        datasets: [{
          data: [beginner, intermediate, advanced],
          backgroundColor: [
            '#FFC107', // Secondary color
            '#4CAF50', // Primary color
            '#2196F3'
          ],
          borderColor: [
            '#FFC107',
            '#4CAF50',
            '#2196F3'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    this.skillDistributionChart = new Chart(ctx, config);
  }

  /**
   * Create skills radar chart
   */
  private createSkillsRadarChart(): void {
    const ctx = this.skillsRadarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.skillsRadarChart) {
      this.skillsRadarChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'radar' as ChartType,
      data: {
        labels: ['Python', 'Angular', 'JavaScript', 'HTML', 'CSS', 'Java'],
        datasets: [{
          label: 'Average Skills',
          data: [
            this.stats.avgPythonSkill,
            this.stats.avgAngularSkill,
            this.stats.avgJavaScriptSkill,
            this.stats.avgHtmlSkill,
            this.stats.avgCssSkill,
            this.stats.avgJavaSkill
          ],
          backgroundColor: 'rgba(76, 175, 80, 0.2)', // Primary color with transparency
          borderColor: '#4CAF50', // Primary color
          borderWidth: 2,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    this.skillsRadarChart = new Chart(ctx, config);
  }

  /**
   * Cleanup charts on component destroy
   */
  ngOnDestroy(): void {
    if (this.avgSkillsChart) this.avgSkillsChart.destroy();
    if (this.skillDistributionChart) this.skillDistributionChart.destroy();
    if (this.skillsRadarChart) this.skillsRadarChart.destroy();
  }
}
