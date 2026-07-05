import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project, ProjectAllocation } from '../../../models/project.model';

@Component({
    selector: 'app-project-allocation',
    template: `
    <div class="project-allocation-page">
      <app-page-header title="Project Allocation Board" subtitle="Review current project vacanies and past allocation records."></app-page-header>

      <div class="allocation-grid">
        <mat-card class="panel-card">
          <mat-card-header>
            <mat-card-title>Active Projects</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-empty-state *ngIf="projects.length === 0" icon="business_center" title="No active projects" subtitle="Create projects from the Projects page first."></app-empty-state>
            <div class="table-container" *ngIf="projects.length > 0">
              <table mat-table [dataSource]="projects">
                <ng-container matColumnDef="name">
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
                <tr mat-header-row *matHeaderRowDef="projectColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: projectColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="panel-card">
          <mat-card-header>
            <mat-card-title>Allocation History</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-empty-state *ngIf="allocations.length === 0" icon="history" title="No allocations recorded" subtitle="Allocations will appear here after projects are assigned."></app-empty-state>
            <div class="table-container" *ngIf="allocations.length > 0">
              <table mat-table [dataSource]="allocations">
                <ng-container matColumnDef="project">
                  <th mat-header-cell *matHeaderCellDef>Project</th>
                  <td mat-cell *matCellDef="let alloc">{{ alloc.projectName }}</td>
                </ng-container>
                <ng-container matColumnDef="candidate">
                  <th mat-header-cell *matHeaderCellDef>Candidate</th>
                  <td mat-cell *matCellDef="let alloc">{{ alloc.candidateName || 'Trainee' }}</td>
                </ng-container>
                <ng-container matColumnDef="domain">
                  <th mat-header-cell *matHeaderCellDef>Domain</th>
                  <td mat-cell *matCellDef="let alloc">{{ alloc.trainingDomain || 'N/A' }}</td>
                </ng-container>
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Allocated On</th>
                  <td mat-cell *matCellDef="let alloc">{{ alloc.allocationDate | date }}</td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let alloc">{{ alloc.status }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="allocationColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: allocationColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .project-allocation-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .allocation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 992px) {
      .allocation-grid {
        grid-template-columns: 1fr;
      }
    }
    .panel-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 16px;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
    }
  `],
    standalone: false
})
export class ProjectAllocationComponent implements OnInit {
  projects: Project[] = [];
  allocations: ProjectAllocation[] = [];
  projectColumns = ['name', 'client', 'domain', 'vacancy', 'status'];
  allocationColumns = ['project', 'candidate', 'domain', 'date', 'status'];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadAllocations();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(list => this.projects = list || []);
  }

  loadAllocations(): void {
    this.projectService.getAllAllocations().subscribe(list => this.allocations = list || []);
  }
}
