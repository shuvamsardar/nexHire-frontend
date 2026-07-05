import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { TraineeService } from '../../services/trainee.service';
import { ToastService } from '../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Asset, AssetType } from '../../models/asset.model';
import { Trainee } from '../../models/training.model';

@Component({
    selector: 'app-assets-mgmt',
    template: `
    <div class="assets-mgmt">
      <app-page-header title="Asset Inventory" subtitle="Track corporate hardware assets and assign laptops to active trainees">
        <button mat-raised-button color="primary" (click)="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'Hide Form' : 'Add New Asset' }}
        </button>
      </app-page-header>

      <!-- Add Asset Form -->
      <mat-card class="form-card" *ngIf="showCreateForm">
        <mat-card-content class="form-row">
          <mat-form-field appearance="outline" class="form-item">
            <mat-label>Asset Name</mat-label>
            <input matInput [(ngModel)]="newAssetName" placeholder="e.g. MacBook Pro 16">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-item">
            <mat-label>Type</mat-label>
            <mat-select [(value)]="newAssetType">
              <mat-option value="LAPTOP">Laptop</mat-option>
              <mat-option value="MOUSE">Mouse</mat-option>
              <mat-option value="KEYBOARD">Keyboard</mat-option>
              <mat-option value="MONITOR">Monitor</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="accent" class="submit-btn" [disabled]="!newAssetName" (click)="createAsset()">Save Asset</button>
        </mat-card-content>
      </mat-card>

      <div class="assets-layout">
        <!-- Asset List -->
        <mat-card class="table-card">
          <mat-card-content>
            <app-empty-state *ngIf="assets.length === 0" icon="computer" title="No hardware assets" subtitle="Add hardware assets using the top form."></app-empty-state>

            <div class="table-container" *ngIf="assets.length > 0">
              <table mat-table [dataSource]="assets">
                <!-- Tag -->
                <ng-container matColumnDef="tag">
                  <th mat-header-cell *matHeaderCellDef>Asset Tag</th>
                  <td mat-cell *matCellDef="let asset" class="bold-text">{{ asset.assetTag || 'UNTAGGED' }}</td>
                </ng-container>

                <!-- Name -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let asset">{{ asset.assetName }}</td>
                </ng-container>

                <!-- Type -->
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let asset">
                    <mat-chip-row>{{ asset.assetType }}</mat-chip-row>
                  </td>
                </ng-container>

                <!-- User/Trainee -->
                <ng-container matColumnDef="holder">
                  <th mat-header-cell *matHeaderCellDef>Assigned To</th>
                  <td mat-cell *matCellDef="let asset">
                    <span *ngIf="asset.status === 'ASSIGNED'">{{ asset.currentTraineeName || 'Trainee' }}</span>
                    <span *ngIf="asset.status !== 'ASSIGNED'" class="unassigned-text">Unassigned</span>
                  </td>
                </ng-container>

                <!-- Status -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let asset">
                    <app-status-badge [status]="asset.status"></app-status-badge>
                  </td>
                </ng-container>

                <!-- Actions -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                  <td mat-cell *matCellDef="let asset" align="end">
                    <ng-container *ngIf="asset.status === 'AVAILABLE'">
                      <button mat-stroked-button color="primary" class="row-btn" (click)="pickAssetToAssign(asset)">Assign</button>
                    </ng-container>
                    <ng-container *ngIf="asset.status === 'ASSIGNED'">
                      <button mat-stroked-button color="warn" class="row-btn" (click)="returnAsset(asset.assetId)">Return</button>
                    </ng-container>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Assignment Drawer Panel -->
        <mat-card class="drawer-card" *ngIf="assigningAsset">
          <mat-card-header>
            <mat-card-title>Assign Asset</mat-card-title>
            <button mat-icon-button (click)="assigningAsset = null"><mat-icon>close</mat-icon></button>
          </mat-card-header>
          <mat-card-content class="drawer-body">
            <p>Target: <strong>{{ assigningAsset.assetName }} ({{ assigningAsset.assetTag }})</strong></p>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Trainee</mat-label>
              <mat-select [(value)]="selectedTraineeId">
                <mat-option *ngFor="let t of trainees" [value]="t.traineeId">
                  {{ t.candidateName }} ({{ t.trainingDomain }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" 
                    [disabled]="!selectedTraineeId" 
                    (click)="confirmAssignment()">
              Confirm Assignment
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .assets-mgmt {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .form-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
    }
    .form-row {
      display: flex;
      gap: 16px;
      padding: 8px 0;
      align-items: center;
      flex-wrap: wrap;
    }
    .form-item {
      flex: 1;
      min-width: 200px;
    }
    .submit-btn {
      height: 48px;
    }
    .assets-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .assets-layout {
        grid-template-columns: 1fr;
      }
    }
    .table-card, .drawer-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 16px;
    }
    .drawer-card {
      display: flex;
      flex-direction: column;
      height: fit-content;
    }
    table {
      width: 100%;
    }
    .bold-text {
      font-weight: 600;
      color: #1e293b;
    }
    .unassigned-text {
      color: #94a3b8;
      font-size: 13px;
    }
    .row-btn {
      height: 32px;
      line-height: 32px;
      font-size: 13px;
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
  `],
    standalone: false
})
export class AssetsManagementComponent implements OnInit {
  assets: Asset[] = [];
  trainees: Trainee[] = [];
  showCreateForm = false;
  displayedColumns = ['tag', 'name', 'type', 'holder', 'status', 'actions'];

  newAssetName = '';
  newAssetType: AssetType = 'LAPTOP';

  assigningAsset: Asset | null = null;
  selectedTraineeId!: number;

  constructor(
    private assetService: AssetService,
    private traineeService: TraineeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAssets();
    this.loadTrainees();
  }

  loadAssets(): void {
    this.assetService.getAll().subscribe(list => this.assets = list);
  }

  loadTrainees(): void {
    this.traineeService.getAll().subscribe((list: Trainee[]) => {
      // Allow assigning assets to trainees who are currently in progress
      this.trainees = list.filter(t => t.status === 'IN_PROGRESS' || t.status === 'TRAINING_ASSIGNED');
    });
  }

  createAsset(): void {
    if (!this.newAssetName) return;

    this.assetService.create({
      assetName: this.newAssetName,
      assetType: this.newAssetType,
      assetTag: 'ASSET-' + Date.now().toString().slice(-4),
      brand: 'NexHire Brand'
    }).subscribe({
      next: () => {
        this.toastService.success('Asset saved to inventory.');
        this.newAssetName = '';
        this.showCreateForm = false;
        this.loadAssets();
      },
      error: () => this.toastService.error('Failed to create asset.')
    });
  }

  pickAssetToAssign(asset: Asset): void {
    this.assigningAsset = asset;
    this.selectedTraineeId = undefined as any;
  }

  confirmAssignment(): void {
    if (!this.assigningAsset || !this.selectedTraineeId) return;

    this.assetService.assign({
      assetId: this.assigningAsset.assetId,
      traineeId: this.selectedTraineeId
    }).subscribe({
      next: () => {
        this.toastService.success('Asset successfully assigned to trainee.');
        this.assigningAsset = null;
        this.loadAssets();
      },
      error: () => this.toastService.error('Assignment failed.')
    });
  }

  returnAsset(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Asset Return',
        message: 'Are you sure you want to mark this asset as returned to inventory?',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.assetService.updateStatus(id, { status: 'AVAILABLE' }).subscribe({
          next: () => {
            this.toastService.success('Asset returned to stock.');
            this.loadAssets();
          },
          error: () => this.toastService.error('Return update failed.')
        });
      }
    });
  }
}
