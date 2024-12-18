// app.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationComponent } from './navigation/navigation.component';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentPage: 'home' | 'wordle' = 'home';

  constructor(private dialog: MatDialog) {}

  setCurrentPage(page: 'home' | 'wordle'): void {
    this.currentPage = page;
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the new event data
        console.log('New event:', result);
      }
    });
  }
}



// add-event-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}



<!-- add-event-dialog.component.html -->
<h2 mat-dialog-title>Add New Event</h2>
<form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
  <div mat-dialog-content>
    <mat-form-field appearance="fill" class="form-field">
      <mat-label>Title</mat-label>
      <input matInput formControlName="title" required>
    </mat-form-field>

    <mat-form-field appearance="fill" class="form-field">
      <mat-label>Date</mat-label>
      <input matInput [matDatepicker]="picker" formControlName="date" required>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>

    <mat-form-field appearance="fill" class="form-field">
      <mat-label>Description</mat-label>
      <textarea matInput formControlName="description"></textarea>
    </mat-form-field>
  </div>

  <div mat-dialog-actions>
    <button mat-button type="button" (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="!eventForm.valid">Save</button>
  </div>
</form>



// add-event-dialog.component.scss
.form-field {
    width: 100%;
    margin-bottom: 16px;
  }
  
  [mat-dialog-actions] {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }


  // app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations()
    // ... other providers
  ]
};


// event.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events = new BehaviorSubject<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date('2024-03-20'),
      description: 'Weekly team sync to discuss project progress'
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date('2024-03-25'),
      description: 'Final submission for Q1 project'
    },
    {
      id: '3',
      title: 'Client Presentation',
      date: new Date('2024-03-22'),
      description: 'Present new features to client stakeholders'
    },
    {
      id: '4',
      title: 'Training Session',
      date: new Date('2024-03-28'),
      description: 'New tool training for the development team'
    }
  ]);

  getEvents(): Observable<Event[]> {
    return this.events.asObservable();
  }

  addEvent(event: Omit<Event, 'id'>): void {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    const currentEvents = this.events.getValue();
    this.events.next([...currentEvents, newEvent]);
  }
}

// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, EventService } from '../services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-container">
      <!-- Personal Info Card -->
      <div class="card">
        <h2>Personal Info</h2>
        <div class="info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
        </div>
      </div>

      <!-- Events Card -->
      <div class="card">
        <h2>Upcoming Events</h2>
        @if (events$ | async; as events) {
          @if (events.length === 0) {
            <p class="no-events">No upcoming events</p>
          } @else {
            @for (event of events; track event.id) {
              <div class="event-item">
                <div class="event-header">
                  <span class="event-title">{{ event.title }}</span>
                  <span class="event-date">{{ event.date | date:'mediumDate' }}</span>
                </div>
                @if (event.description) {
                  <p class="event-description">{{ event.description }}</p>
                }
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(private eventService: EventService) {
    this.events$ = this.eventService.getEvents();
  }

  ngOnInit(): void {}
}


// home.component.scss
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
    h2 {
      margin-bottom: 16px;
      font-size: 1.5rem;
      color: #333;
    }
  }
  
  .info {
    p {
      margin: 8px 0;
      color: #666;
      
      strong {
        color: #333;
        margin-right: 8px;
      }
    }
  }
  
  .event-item {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 12px;
  
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
  
    .event-title {
      font-weight: 500;
      color: #333;
    }
  
    .event-date {
      color: #666;
      font-size: 0.9rem;
    }
  
    .event-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
  }
  
  .no-events {
    color: #666;
    font-style: italic;
  }