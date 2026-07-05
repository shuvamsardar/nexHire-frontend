import { Component, OnInit } from '@angular/core';
import { TraineeService } from '../../services/trainee.service';
import { ToastService } from '../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Trainee, TraineeStatus } from '../../models/training.model';

@Component({
    selector: 'app-trainees-mgmt',
    template: `
    <div class="trainees-mgmt">
      <app-page-header title="Trainee Batches" subtitle="Track progress percentages and graduate trainees to project-ready state"></app-page-header>

      <mat-card class="table-card">
        <mat-card-content>
          <app-empty-state *ngIf="trainees.length === 0" icon="school" title="No active trainees" subtitle="Trainees will appear here once allocated to a training block."></app-empty-state>

          <div class="table-container" *ngIf="trainees.length > 0">
            <table mat-table [dataSource]="trainees">
              <!-- Name -->
              <ng-container matColumnDef="candidate">
                <th mat-header-cell *matHeaderCellDef>Candidate</th>
                <td mat-cell *matCellDef="let t">
                  <div class="candidate-meta">
                    <span class="name">{{ t.candidateName }}</span>
                    <span class="email">{{ t.candidateEmail }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Training Program -->
              <ng-container matColumnDef="program">
                <th mat-header-cell *matHeaderCellDef>Program</th>
                <td mat-cell *matCellDef="let t">{{ t.trainingName }}</td>
              </ng-container>

              <!-- Location Block -->
              <ng-container matColumnDef="block">
                <th mat-header-cell *matHeaderCellDef>Room/Block</th>
                <td mat-cell *matCellDef="let t">{{ t.cityName }} - {{ t.blockName }}</td>
              </ng-container>

              <!-- Progress Percentage -->
              <ng-container matColumnDef="progress">
                <th mat-header-cell *matHeaderCellDef>Progress</th>
                <td mat-cell *matCellDef="let t">
                  <div class="progress-cell">
                    <mat-progress-bar mode="determinate" [value]="t.progressPercentage" class="progress-bar"></mat-progress-bar>
                    <span class="pct-text">{{ t.progressPercentage }}%</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let t">
                  <app-status-badge [status]="t.status"></app-status-badge>
                </td>
              </ng-container>

              <!-- Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                <td mat-cell *matCellDef="let t" align="end">
                  <ng-container *ngIf="t.status === 'IN_PROGRESS' || t.status === 'TRAINING_ASSIGNED'">
                    <!-- Progress increment -->
                    <button mat-stroked-button class="row-btn" (click)="updateProgress(t, t.progressPercentage + 15)">+15% Progress</button>
                    <!-- Complete Training -->
                    <button mat-flat-button color="primary" class="row-btn" [disabled]="t.progressPercentage < 100" (click)="completeTraining(t.traineeId)">Graduate</button>
                  </ng-container>
                  <span *ngIf="t.status === 'COMPLETED'" class="completed-label">Graduated (Released)</span>
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
    .trainees-mgmt {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .table-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
    }
    table {
      width: 100%;
    }
    .candidate-meta {
      display: flex;
      flex-direction: column;
    }
    .candidate-meta .name {
      font-weight: 600;
      color: #1e293b;
    }
    .candidate-meta .email {
      font-size: 11px;
      color: #64748b;
    }
    .progress-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
    }
    .progress-bar {
      height: 6px !important;
      border-radius: 4px;
      flex-grow: 1;
    }
    .pct-text {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }
    .row-btn {
      margin-left: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
    }
    .completed-label {
      font-size: 12px;
      color: #16a34a;
      font-weight: 600;
    }
  `],
    standalone: false
})
export class TraineesManagementComponent implements OnInit {
  trainees: Trainee[] = [];
  displayedColumns = ['candidate', 'program', 'block', 'progress', 'status', 'actions'];

  constructor(
    private traineeService: TraineeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTrainees();
  }

  loadTrainees(): void {
    this.traineeService.getAll().subscribe((list: Trainee[]) => this.trainees = list);
  }

  updateProgress(t: Trainee, newProgress: number): void {
    const capped = Math.min(newProgress, 100);
    this.traineeService.updateStatus(t.traineeId, {
      status: capped === 100 ? 'IN_PROGRESS' : 'IN_PROGRESS',
      progressPercentage: capped
    }).subscribe({
      next: () => {
        this.toastService.success(`Progress updated to ${capped}%`);
        this.loadTrainees();
      },
      error: () => this.toastService.error('Failed to update progress.')
    });
  }

  completeTraining(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Graduation',
        message: 'Graduating this trainee marks their status as COMPLETED and automatically moves them to the Released candidates table. Proceed?',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.traineeService.updateStatus(id, {
          status: 'COMPLETED',
          progressPercentage: 100
        }).subscribe({
          next: () => {
            this.toastService.success('Trainee graduated and released for project allocation!');
            this.loadTrainees();
          },
          error: () => this.toastService.error('Graduation update failed.')
        });
      }
    });
  }
}
