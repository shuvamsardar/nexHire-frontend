import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-jobs-list',
    template: `
    <div class="single-job-container">
      <!-- Hero Section -->
      <div class="job-hero">
        <div class="job-hero-content">
          <div class="company-logo">
            <mat-icon>business</mat-icon>
          </div>
          <h1>Senior Full Stack Engineer</h1>
          <div class="job-meta">
            <span class="meta-item"><mat-icon>business_center</mat-icon> Engineering</span>
            <span class="meta-item"><mat-icon>location_on</mat-icon> Remote / Global</span>
            <span class="meta-item"><mat-icon>schedule</mat-icon> Full-time</span>
            <span class="meta-item"><mat-icon>attach_money</mat-icon> Competitive</span>
          </div>
          <button mat-raised-button class="apply-hero-btn" (click)="applyNow()">
            Apply for this Job <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>

      <!-- Content Layout -->
      <div class="job-content-layout">
        <!-- Main Description -->
        <div class="job-main-details">
          <mat-card class="job-card">
            <mat-card-content>
              <h2>About NexHire</h2>
              <p>
                At NexHire, we are building the future of talent acquisition and corporate administration. Our platform streamlines the entire lifecycle—from finding top candidates to managing their onboarding and project allocations. We're a fast-paced, product-led organization looking for passionate builders.
              </p>

              <h2>The Role</h2>
              <p>
                We are looking for a Senior Full Stack Engineer to lead the architecture and development of our core web platform. You will work across the stack, building robust Angular frontends, highly scalable Node/Spring Boot microservices, and defining data architectures that power our analytics.
              </p>

              <h2>What You'll Do</h2>
              <ul>
                <li>Design, develop, and maintain high-performance web applications using modern web technologies.</li>
                <li>Collaborate closely with product managers, designers, and other engineers to deliver impactful features.</li>
                <li>Architect robust APIs and microservices that scale to millions of users.</li>
                <li>Mentor junior engineers and champion engineering best practices.</li>
                <li>Participate in code reviews, architectural discussions, and technical planning.</li>
              </ul>

              <h2>What We're Looking For</h2>
              <ul>
                <li>5+ years of experience in full-stack software development.</li>
                <li>Deep expertise in modern frontend frameworks (Angular preferred, or React/Vue).</li>
                <li>Strong backend experience in Node.js, Java, or Python.</li>
                <li>Experience with cloud platforms (AWS, GCP) and containerization (Docker, K8s).</li>
                <li>Excellent problem-solving skills and a product-focused mindset.</li>
              </ul>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Sidebar / Sticky Apply -->
        <div class="job-sidebar">
          <mat-card class="job-summary-card">
            <mat-card-content>
              <h3>Job Overview</h3>
              
              <div class="summary-item">
                <mat-icon>calendar_today</mat-icon>
                <div class="summary-text">
                  <span class="label">Posted Date</span>
                  <span class="value">Just now</span>
                </div>
              </div>
              
              <div class="summary-item">
                <mat-icon>work_outline</mat-icon>
                <div class="summary-text">
                  <span class="label">Experience</span>
                  <span class="value">5+ Years</span>
                </div>
              </div>

              <div class="summary-item">
                <mat-icon>school</mat-icon>
                <div class="summary-text">
                  <span class="label">Education</span>
                  <span class="value">Bachelors Degree</span>
                </div>
              </div>

              <div class="summary-item">
                <mat-icon>computer</mat-icon>
                <div class="summary-text">
                  <span class="label">Job ID</span>
                  <span class="value">NX-ENG-001</span>
                </div>
              </div>

              <button mat-raised-button class="apply-block-btn" (click)="applyNow()">
                Apply Now
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .single-job-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding-bottom: 40px;
    }
    
    .job-hero {
      background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
      border-radius: 16px;
      padding: 48px 40px;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(79, 70, 229, 0.2);
    }

    .job-hero::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="20" r="40" fill="rgba(255,255,255,0.05)"/></svg>') no-repeat right top;
      background-size: cover;
      pointer-events: none;
    }

    .job-hero-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 800px;
    }

    .company-logo {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .company-logo mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .job-hero h1 {
      font-size: 42px;
      font-weight: 800;
      margin: 0 0 16px 0;
      letter-spacing: -0.5px;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 32px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255,255,255,0.85);
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .apply-hero-btn {
      background: white !important;
      color: #4f46e5 !important;
      font-weight: 700 !important;
      padding: 0 32px !important;
      height: 48px !important;
      border-radius: 24px !important;
      font-size: 16px !important;
      letter-spacing: 0.3px !important;
    }

    .job-content-layout {
      display: flex;
      gap: 32px;
      align-items: flex-start;
    }

    .job-main-details {
      flex: 1;
    }

    .job-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 32px !important;
    }

    .job-card h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
      padding-top: 24px;
    }

    .job-card h2:first-child {
      padding-top: 0;
    }

    .job-card p {
      color: #475569;
      line-height: 1.7;
      font-size: 15px;
      margin: 0 0 16px 0;
    }

    .job-card ul {
      color: #475569;
      line-height: 1.7;
      font-size: 15px;
      padding-left: 20px;
      margin: 0 0 16px 0;
    }

    .job-card li {
      margin-bottom: 8px;
    }

    .job-sidebar {
      width: 320px;
      position: sticky;
      top: 24px;
    }

    .job-summary-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
      padding: 24px !important;
    }

    .job-summary-card h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 24px 0;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-item mat-icon {
      color: #818cf8;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .summary-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-text .label {
      font-size: 13px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .summary-text .value {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }

    .apply-block-btn {
      width: 100%;
      height: 48px !important;
      border-radius: 12px !important;
      font-weight: 700 !important;
      font-size: 16px !important;
      background: #4f46e5 !important;
      color: white !important;
      margin-top: 16px;
    }

    @media (max-width: 900px) {
      .job-content-layout {
        flex-direction: column;
      }
      .job-sidebar {
        width: 100%;
        position: static;
      }
      .job-hero h1 {
        font-size: 32px;
      }
      .job-hero {
        padding: 32px 24px;
      }
    }
  `],
    standalone: false
})
export class JobsListComponent implements OnInit {
  constructor(private router: Router) {}
  
  ngOnInit(): void {}

  applyNow(): void {
    // Navigate to the apply form for Job ID 1
    this.router.navigate(['/candidate/apply/1']);
  }
}
