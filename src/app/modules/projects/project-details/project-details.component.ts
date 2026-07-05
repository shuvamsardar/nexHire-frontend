import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
    selector: 'app-project-details',
    template: `
    <div class="project-details-page">
      <app-page-header title="Project Details" subtitle="View project roadmap and capacity summary"></app-page-header>

      <mat-card *ngIf="project; else loadingCard">
        <mat-card-header>
          <mat-card-title>{{ project.projectName }}</mat-card-title>
          <mat-card-subtitle>{{ project.clientName || 'Client not specified' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="details-grid">
            <div>
              <strong>Domain</strong>
              <p>{{ project.requiredDomain }}</p>
            </div>
            <div>
              <strong>Skills</strong>
              <p>{{ project.requiredSkills || 'N/A' }}</p>
            </div>
            <div>
              <strong>Headcount Required</strong>
              <p>{{ project.requiredCount }}</p>
            </div>
            <div>
              <strong>Allocated</strong>
              <p>{{ project.allocatedCount }}</p>
            </div>
            <div>
              <strong>Remaining</strong>
              <p>{{ project.remainingCount }}</p>
            </div>
            <div>
              <strong>Status</strong>
              <p>{{ project.status }}</p>
            </div>
            <div>
              <strong>Start Date</strong>
              <p>{{ project.startDate || 'TBD' }}</p>
            </div>
          </div>

          <div class="description-card" *ngIf="project.description">
            <h4>Project Description</h4>
            <p>{{ project.description }}</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="primary" (click)="goBack()">Back to Projects</button>
        </mat-card-actions>
      </mat-card>

      <ng-template #loadingCard>
        <mat-card>
          <mat-card-content>
            <p>Loading project details...</p>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
    styles: [`
    .project-details-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .details-grid div {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
    }
    .details-grid strong {
      display: block;
      margin-bottom: 8px;
      font-size: 12px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .description-card {
      margin-top: 12px;
      padding: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
    }
  `],
    standalone: false
})
export class ProjectDetailsComponent implements OnInit {
  project?: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projectService.getProjectById(id).subscribe(project => this.project = project);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/projects']);
  }
}
