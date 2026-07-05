import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReleasedCandidate, Project } from '../../models/project.model';

@Component({
    selector: 'app-released-candidates',
    template: `
    <div class="released-candidates">
      <app-page-header title="Project Allocation Board" subtitle="Allocate graduated released trainees to active client projects based on technology domains"></app-page-header>

      <div class="allocation-grid">
        <!-- Released Candidates (Ready for tag) -->
        <mat-card class="column-card">
          <mat-card-header>
            <mat-card-title>Released Candidates</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-empty-state *ngIf="released.length === 0" icon="people" title="No released candidates" subtitle="Trainees must complete training to be released here."></app-empty-state>

            <div class="table-container" *ngIf="released.length > 0">
              <table mat-table [dataSource]="released">
                <!-- Name -->
                <ng-container matColumnDef="candidate">
                  <th mat-header-cell *matHeaderCellDef>Candidate</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="candidate-meta">
                      <span class="name">{{ r.candidateName }}</span>
                      <span class="email">{{ r.candidateEmail }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Technology / Domain -->
                <ng-container matColumnDef="domain">
                  <th mat-header-cell *matHeaderCellDef>Domain</th>
                  <td mat-cell *matCellDef="let r">
                    <mat-chip-row>{{ r.trainingDomain }}</mat-chip-row>
                  </td>
                </ng-container>

                <!-- Action -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                  <td mat-cell *matCellDef="let r" align="end">
                    <ng-container *ngIf="r.projectAllocationStatus !== 'ALLOCATED'">
                      <button mat-raised-button color="primary" class="row-btn" (click)="pickCandidateToAllocate(r)">Allocate to Project</button>
                    </ng-container>
                    <span *ngIf="r.projectAllocationStatus === 'ALLOCATED'" class="allocated-label">Allocated ({{ r.projectName }})</span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="candidateColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: candidateColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Project Allocation Drawer / Selector -->
        <mat-card class="column-card drawer-card" *ngIf="allocatingCandidate">
          <mat-card-header>
            <mat-card-title>Configure Project Allocation</mat-card-title>
            <button mat-icon-button (click)="allocatingCandidate = null"><mat-icon>close</mat-icon></button>
          </mat-card-header>
          <mat-card-content class="drawer-body">
            <p>Candidate: <strong>{{ allocatingCandidate.candidateName }}</strong></p>
            <p>Domain: <strong>{{ allocatingCandidate.trainingDomain }}</strong></p>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Project</mat-label>
              <mat-select [(value)]="selectedProjectId" (selectionChange)="onProjectSelect()">
                <mat-option *ngFor="let p of projects" [value]="p.projectId" [disabled]="p.remainingCount === 0">
                  {{ p.projectName }} (Req: {{ p.requiredDomain }} • Vacancy: {{ p.remainingCount }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Domain Mismatch Warning -->
            <div class="mismatch-warning" *ngIf="isDomainMismatch()">
              <mat-icon color="warn">warning</mat-icon>
              <div>
                <h4>Domain Mismatch Detected</h4>
                <p>Trainee Domain ({{ allocatingCandidate.trainingDomain }}) does not match Project Domain ({{ selectedProjectDomain }}). Click override check below if authorized.</p>
              </div>
            </div>

            <!-- Override Checkbox -->
            <div class="override-checkbox-row" *ngIf="isDomainMismatch()">
              <mat-checkbox [(ngModel)]="overrideDomain">Authorize & Override Match Check</mat-checkbox>
            </div>

            <button mat-raised-button color="primary" 
                    class="allocate-submit-btn"
                    [disabled]="isAllocationDisabled()" 
                    (click)="submitAllocation()">
              Confirm Project Tagging
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .released-candidates {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .allocation-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    @media (max-width: 992px) {
      .allocation-grid {
        grid-template-columns: 1fr;
      }
    }
    .column-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 16px;
      height: fit-content;
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
    .row-btn {
      height: 32px;
      line-height: 32px;
      font-size: 13px;
    }
    .allocated-label {
      font-size: 12px;
      color: #16a34a;
      font-weight: 600;
    }
    .drawer-body {
      padding-top: 16px !important;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .mismatch-warning {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      gap: 12px;
    }
    .mismatch-warning h4 {
      margin: 0 0 4px;
      font-size: 13px;
      font-weight: 700;
      color: #b45309;
    }
    .mismatch-warning p {
      margin: 0;
      font-size: 12px;
      color: #d97706;
      line-height: 1.4;
    }
    .override-checkbox-row {
      margin-top: 4px;
    }
    .allocate-submit-btn {
      width: 100%;
      height: 40px;
    }
  `],
    standalone: false
})
export class ReleasedCandidatesComponent implements OnInit {
  released: ReleasedCandidate[] = [];
  projects: Project[] = [];
  candidateColumns = ['candidate', 'domain', 'actions'];

  allocatingCandidate: ReleasedCandidate | null = null;
  selectedProjectId!: number;
  selectedProjectDomain = '';
  overrideDomain = false;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadReleasedList();
    this.loadProjects();
  }

  loadReleasedList(): void {
    this.projectService.getAllReleased().subscribe(list => this.released = list);
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(list => {
      this.projects = list.filter(p => p.status === 'ACTIVE');
    });
  }

  pickCandidateToAllocate(candidate: ReleasedCandidate): void {
    this.allocatingCandidate = candidate;
    this.selectedProjectId = undefined as any;
    this.selectedProjectDomain = '';
    this.overrideDomain = false;
  }

  onProjectSelect(): void {
    const proj = this.projects.find(p => p.projectId === this.selectedProjectId);
    this.selectedProjectDomain = proj?.requiredDomain ?? '';
    this.overrideDomain = false;
  }

  isDomainMismatch(): boolean {
    if (!this.allocatingCandidate || !this.selectedProjectId) return false;
    return this.allocatingCandidate.trainingDomain !== this.selectedProjectDomain;
  }

  isAllocationDisabled(): boolean {
    if (!this.selectedProjectId) return true;
    if (this.isDomainMismatch() && !this.overrideDomain) return true;
    return false;
  }

  submitAllocation(): void {
    if (!this.allocatingCandidate || this.isAllocationDisabled()) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Project Allocation',
        message: `Are you sure you want to allocate ${this.allocatingCandidate.candidateName} to Project ID: ${this.selectedProjectId}?`,
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.projectService.allocate({
          projectId: this.selectedProjectId,
          releasedId: this.allocatingCandidate!.releasedId,
          overrideDomainMismatch: this.overrideDomain
        }).subscribe({
          next: () => {
            this.toastService.success('Candidate successfully allocated to project batch!');
            this.allocatingCandidate = null;
            this.loadReleasedList();
            this.loadProjects();
          },
          error: () => this.toastService.error('Allocation failed.')
        });
      }
    });
  }
}
