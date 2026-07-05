import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { ToastService } from '../../shared/services/toast.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
    selector: 'app-applications-mgmt',
    template: `
    <div class="applications-mgmt">
      <app-page-header title="Job Applications" subtitle="Review and transition applicant states from apply to shortlisting"></app-page-header>

      <!-- Filters Panel -->
      <mat-card class="filter-card">
        <mat-card-content class="filter-row">
          <mat-form-field appearance="outline" class="filter-item">
            <mat-label>Search candidate email or name...</mat-label>
            <input matInput [(ngModel)]="searchQuery" (input)="onFilterChange()" placeholder="e.g. John Doe">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-item">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onFilterChange()">
              <mat-option value="">All Statuses</mat-option>
              <mat-option value="APPLIED">Applied</mat-option>
              <mat-option value="SHORTLISTED">Shortlisted</mat-option>
              <mat-option value="REJECTED">Rejected</mat-option>
              <mat-option value="WITHDRAWN">Withdrawn</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Applications List Card -->
      <mat-card class="table-card">
        <mat-card-content>
          <app-empty-state *ngIf="applications.length === 0" icon="search_off" title="No applications match filters" subtitle="Try modifying your parameters."></app-empty-state>
          
          <div class="table-container" *ngIf="applications.length > 0">
            <table mat-table [dataSource]="applications">
              <!-- Candidate Name -->
              <ng-container matColumnDef="candidate">
                <th mat-header-cell *matHeaderCellDef>Candidate</th>
                <td mat-cell *matCellDef="let app">
                  <div class="candidate-info">
                    <span class="name">{{ app.userFullName }}</span>
                    <span class="email">{{ app.userEmail }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Position -->
              <ng-container matColumnDef="job">
                <th mat-header-cell *matHeaderCellDef>Job Applied</th>
                <td mat-cell *matCellDef="let app">{{ app.jobTitle }}</td>
              </ng-container>

              <!-- Location -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Location</th>
                <td mat-cell *matCellDef="let app">{{ app.jobLocation }}</td>
              </ng-container>

              <!-- Date -->
              <ng-container matColumnDef="appliedDate">
                <th mat-header-cell *matHeaderCellDef>Applied Date</th>
                <td mat-cell *matCellDef="let app">{{ app.appliedDate | date }}</td>
              </ng-container>

              <!-- Status -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let app">
                  <app-status-badge [status]="app.status"></app-status-badge>
                </td>
              </ng-container>

              <!-- Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                <td mat-cell *matCellDef="let app" align="end">
                  <ng-container *ngIf="app.status === 'APPLIED'">
                    <button mat-flat-button color="primary" class="row-btn" (click)="updateStatus(app.applicationId, 'SHORTLISTED')">Shortlist</button>
                    <button mat-stroked-button color="warn" class="row-btn" (click)="updateStatus(app.applicationId, 'REJECTED')">Reject</button>
                  </ng-container>
                  <span *ngIf="app.status !== 'APPLIED'" class="status-updated-text">Transition Complete</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .applications-mgmt {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .filter-card, .table-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
    }
    .filter-row {
      display: flex;
      gap: 16px;
      padding: 8px 0;
      flex-wrap: wrap;
    }
    .filter-item {
      flex: 1;
      min-width: 240px;
    }
    table {
      width: 100%;
    }
    .candidate-info {
      display: flex;
      flex-direction: column;
    }
    .candidate-info .name {
      font-weight: 600;
      color: #1e293b;
    }
    .candidate-info .email {
      font-size: 12px;
      color: #64748b;
    }
    .row-btn {
      margin-left: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
    }
    .status-updated-text {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
  `],
    standalone: false
})
export class ApplicationsManagementComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns = ['candidate', 'job', 'location', 'appliedDate', 'status', 'actions'];
  searchQuery = '';
  selectedStatus = '';

  constructor(
    private appService: ApplicationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.appService.getAll({
      search: this.searchQuery,
      status: this.selectedStatus as ApplicationStatus
    }).subscribe(apps => this.applications = apps);
  }

  onFilterChange(): void {
    this.loadApplications();
  }

  updateStatus(id: number, status: ApplicationStatus): void {
    this.appService.updateStatus(id, { status }).subscribe({
      next: () => {
        this.toastService.success(`Application updated to ${status}`);
        this.loadApplications();
      },
      error: () => this.toastService.error('Status transition failed.')
    });
  }
}
