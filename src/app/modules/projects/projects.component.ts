import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, CreateProjectRequest } from '../../models/project.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
    selector: 'app-projects',
    template: `
    <div class="projects-page">
      <app-page-header title="Projects" subtitle="Manage projects and allocations"></app-page-header>

      <div class="projects-grid">
        <mat-card class="panel-card">
          <mat-card-header>
            <mat-card-title>Create New Project</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-columns">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Project Name</mat-label>
                <input matInput [(ngModel)]="newProject.projectName" placeholder="e.g. Banking Portal" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Client Name</mat-label>
                <input matInput [(ngModel)]="newProject.clientName" placeholder="e.g. HDFC Bank" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Domain</mat-label>
                <input matInput [(ngModel)]="newProject.requiredDomain" placeholder="e.g. JAVA" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Required Skills</mat-label>
                <input matInput [(ngModel)]="newProject.requiredSkills" placeholder="e.g. Java, Spring Boot" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Required Headcount</mat-label>
                <input matInput type="number" [(ngModel)]="newProject.requiredCount" min="1" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Start Date</mat-label>
                <input matInput type="date" [(ngModel)]="newProject.startDate" />
              </mat-form-field>
            </div>

            <button mat-raised-button color="primary" class="save-btn" (click)="createProject()">
              Create Project
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="panel-card table-panel">
          <mat-card-header>
            <mat-card-title>Active Projects</mat-card-title>
            <button mat-stroked-button color="primary" (click)="navigateToAllocation()">
              Open Allocation Board
            </button>
          </mat-card-header>
          <mat-card-content>
            <app-empty-state *ngIf="projects.length === 0" icon="business_center" title="No projects found" subtitle="Create a new project to begin allocation planning."></app-empty-state>

            <div class="table-container" *ngIf="projects.length > 0">
              <table mat-table [dataSource]="projects">
                <ng-container matColumnDef="project">
                  <th mat-header-cell *matHeaderCellDef>Project</th>
                  <td mat-cell *matCellDef="let project">{{ project.projectName }}</td>
                </ng-container>

                <ng-container matColumnDef="client">
                  <th mat-header-cell *matHeaderCellDef>Client</th>
                  <td mat-cell *matCellDef="let project">{{ project.clientName || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="domain">
                  <th mat-header-cell *matHeaderCellDef>Domain</th>
                  <td mat-cell *matCellDef="let project">{{ project.requiredDomain }}</td>
                </ng-container>

                <ng-container matColumnDef="vacancy">
                  <th mat-header-cell *matHeaderCellDef>Vacancy</th>
                  <td mat-cell *matCellDef="let project">{{ project.remainingCount }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let project">{{ project.status }}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                  <td mat-cell *matCellDef="let project" align="end">
                    <button mat-button color="primary" (click)="viewProject(project)">View</button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .projects-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
    }
    @media (max-width: 992px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
    .panel-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 16px;
    }
    .form-columns {
      display: grid;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .table-panel {
      display: flex;
      flex-direction: column;
    }
    .table-container {
      margin-top: 16px;
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
    }
    .save-btn {
      margin-top: 16px;
      width: 100%;
      height: 40px;
    }
  `],
    standalone: false
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  displayedColumns = ['project', 'client', 'domain', 'vacancy', 'status', 'actions'];
  newProject: Partial<CreateProjectRequest> = {
    projectName: '',
    clientName: '',
    requiredDomain: '',
    requiredSkills: '',
    requiredCount: 1,
    startDate: ''
  };

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(list => this.projects = list || []);
  }

  createProject(): void {
    if (!this.newProject.projectName || !this.newProject.requiredDomain || !this.newProject.requiredCount) {
      this.toastService.error('Please provide a project name, domain and headcount.');
      return;
    }

    const request: CreateProjectRequest = {
      projectName: this.newProject.projectName,
      clientName: this.newProject.clientName,
      requiredDomain: this.newProject.requiredDomain,
      requiredSkills: this.newProject.requiredSkills,
      requiredCount: this.newProject.requiredCount,
      startDate: this.newProject.startDate,
    };

    this.projectService.createProject(request).subscribe({
      next: (project) => {
        this.toastService.success('Project created successfully.');
        this.projects = [project, ...this.projects];
        this.resetForm();
      },
      error: () => this.toastService.error('Failed to create project.')
    });
  }

  resetForm(): void {
    this.newProject = {
      projectName: '',
      clientName: '',
      requiredDomain: '',
      requiredSkills: '',
      requiredCount: 1,
      startDate: ''
    };
  }

  viewProject(project: Project): void {
    this.router.navigate(['/dashboard/projects', project.projectId]);
  }

  navigateToAllocation(): void {
    this.router.navigate(['/dashboard/projects/allocation']);
  }
}
