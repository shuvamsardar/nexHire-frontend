import { Component } from '@angular/core';

@Component({
    selector: 'app-candidate-profile',
    template: `
    <div>
      <app-page-header title="My Profile" subtitle="View and update your candidate profile."></app-page-header>
      <mat-card style="border-radius: 12px; margin-top: 8px;">
        <mat-card-content style="padding: 48px; text-align: center; color: #64748b;">
          <mat-icon style="font-size: 56px; width: 56px; height: 56px; color: #10b981; display: block; margin: 0 auto 16px;">person</mat-icon>
          <h3 style="margin: 0 0 8px; color: #374151;">Profile Management</h3>
          <p style="margin: 0; font-size: 14px;">Update your personal information, resume, and preferences.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    standalone: false
})
export class CandidateProfileComponent {}
