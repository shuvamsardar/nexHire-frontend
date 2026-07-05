import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoggedInUser } from '../../../models/user.model';
import { ToastService } from '../../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './create-user-dialog.component';

@Component({
    selector: 'app-user-management',
    template: `
    <div class="user-management-container">
      <app-page-header title="User Management" subtitle="Manage system users (Candidate, HR, Admin) and restrict access if needed.">
        <button mat-raised-button color="primary" (click)="openCreateUserDialog()">
          <mat-icon>person_add</mat-icon> Add New User
        </button>
      </app-page-header>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container" *ngIf="users.length > 0">
            <table mat-table [dataSource]="users">
              
              <!-- Name & Email Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let u">
                  <div class="user-meta">
                    <span class="name">{{ u.fullName }}</span>
                    <span class="email">{{ u.email }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let u">
                  <button mat-button [matMenuTriggerFor]="roleMenu" [ngClass]="getRoleClass(u.role)" class="role-btn" [disabled]="u.role === 'SUPER_ADMIN'">
                    {{ u.role }} <mat-icon *ngIf="u.role !== 'SUPER_ADMIN'">arrow_drop_down</mat-icon>
                  </button>
                  <mat-menu #roleMenu="matMenu">
                    <button mat-menu-item (click)="changeRole(u, 'CANDIDATE')">Candidate</button>
                    <button mat-menu-item (click)="changeRole(u, 'HR')">HR</button>
                    <button mat-menu-item (click)="changeRole(u, 'ADMIN')">Admin</button>
                  </mat-menu>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let u">
                  <span class="status-badge" [class.active]="u.active" [class.restricted]="!u.active">
                    {{ u.active ? 'Active' : 'Restricted' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef align="end">Actions</th>
                <td mat-cell *matCellDef="let u" align="end">
                  <button mat-stroked-button [color]="u.active ? 'warn' : 'primary'" (click)="toggleRestriction(u)" [disabled]="u.role === 'SUPER_ADMIN'">
                    {{ u.active ? 'Restrict User' : 'Activate User' }}
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
          
          <app-empty-state *ngIf="users.length === 0" icon="people_outline" title="No users found"></app-empty-state>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .user-management-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .table-card {
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }
    .user-meta .name {
      font-weight: 600;
      color: #1e293b;
    }
    .user-meta .email {
      font-size: 12px;
      color: #64748b;
    }
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge.active {
      background: #dcfce7;
      color: #15803d;
    }
    .status-badge.restricted {
      background: #fee2e2;
      color: #dc2626;
    }
    .role-btn {
      border-radius: 20px !important;
      font-size: 12px !important;
      height: 32px !important;
      line-height: 32px !important;
      padding: 0 8px 0 16px !important;
    }
    .role-admin { background-color: #f3e8ff !important; color: #7c3aed !important; }
    .role-hr { background-color: #dbeafe !important; color: #1d4ed8 !important; }
    .role-candidate { background-color: #f1f5f9 !important; color: #475569 !important; }
  `],
    standalone: false
})
export class UserManagementComponent implements OnInit {
  users: LoggedInUser[] = [];
  displayedColumns: string[] = ['user', 'role', 'status', 'actions'];

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  getRoleClass(role: string): string {
    if (role === 'ADMIN') return 'role-admin';
    if (role === 'HR') return 'role-hr';
    return 'role-candidate';
  }

  changeRole(user: LoggedInUser, newRole: string): void {
    if (user.role === newRole) return;
    this.userService.changeUserRole(user.userId!, newRole).subscribe(success => {
      if (success) {
        user.role = newRole;
        this.toastService.success(`Role updated to ${newRole}`);
      } else {
        this.toastService.error('Failed to update role');
      }
    });
  }

  toggleRestriction(user: LoggedInUser): void {
    const newStatus = !user.active;
    this.userService.toggleUserStatus(user.userId!, newStatus).subscribe(success => {
      if (success) {
        user.active = newStatus;
        this.toastService.success(newStatus ? 'User activated successfully' : 'User restricted successfully');
      } else {
        this.toastService.error('Failed to update user status');
      }
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe(() => {
          this.toastService.success('User created successfully');
          this.loadUsers();
        });
      }
    });
  }
}
