// navigation.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  @Input() currentPage: 'home' | 'wordle' = 'home';
  @Output() onNavigate = new EventEmitter<'home' | 'wordle'>();
  @Output() onAddEvent = new EventEmitter<void>();
}

// navigation.component.html
<div class="fixed left-0 top-0 h-full w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4 shadow-lg">
  <button mat-icon-button 
    [class.active]="currentPage === 'home'"
    (click)="onNavigate.emit('home')"
    matTooltip="Home">
    <mat-icon>home</mat-icon>
  </button>
  
  <button mat-icon-button
    [class.active]="currentPage === 'wordle'"
    (click)="onNavigate.emit('wordle')"
    matTooltip="Wordle">
    <mat-icon>games</mat-icon>
  </button>

  <button mat-icon-button
    (click)="onAddEvent.emit()"
    matTooltip="Add Event"
    class="mt-auto mb-4">
    <mat-icon>add</mat-icon>
  </button>
</div>

// app.component.ts
import { Component } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavigationComponent,
    CommonModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentPage: 'home' | 'wordle' = 'home';

  setCurrentPage(page: 'home' | 'wordle'): void {
    this.currentPage = page;
  }

  openAddEventDialog(): void {
    // Dialog implementation
  }
}

// app.component.html
<div class="flex min-h-screen bg-gray-100">
  <app-navigation 
    [currentPage]="currentPage"
    (onNavigate)="setCurrentPage($event)"
    (onAddEvent)="openAddEventDialog()">
  </app-navigation>

  <main class="flex-1 ml-16 p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">
        {{currentPage === 'home' ? 'Event Tracker' : 'Wordle Game'}}
      </h1>
    </header>

    @if (currentPage === 'home') {
      <app-home />
    } @else if (currentPage === 'wordle') {
      <app-wordle />
    }
  </main>
</div>


// add-event.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-event.component.html'
})
export class AddEventComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEventComponent>,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.eventService.addEvent(this.eventForm.value);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// add-event.component.html
<h2 mat-dialog-title>Add New Event</h2>
<form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>
    <mat-form-field appearance="fill" class="w-full">
      <mat-label>Title</mat-label>
      <input matInput formControlName="title" required>
    </mat-form-field>

    <mat-form-field appearance="fill" class="w-full">
      <mat-label>Date</mat-label>
      <input matInput [matDatepicker]="picker" formControlName="date" required>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>

    <mat-form-field appearance="fill" class="w-full">
      <mat-label>Description</mat-label>
      <textarea matInput formControlName="description"></textarea>
    </mat-form-field>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="!eventForm.valid">
      Save
    </button>
  </mat-dialog-actions>
</form>


// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(private eventService: EventService) {
    this.events$ = this.eventService.getEvents();
  }

  ngOnInit(): void {}
}

// home.component.html
<div class="grid md:grid-cols-2 gap-6">
  <mat-card>
    <mat-card-header>
      <mat-card-title>Personal Info</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Email:</strong> john.doe@example.com</p>
    </mat-card-content>
  </mat-card>

  <mat-card>
    <mat-card-header>
      <mat-card-title>Upcoming Events</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      @if (events$ | async; as events) {
        @if (events.length === 0) {
          <div class="text-gray-500">No upcoming events</div>
        } @else {
          @for (event of events; track event.id) {
            <div class="mb-3 p-4 bg-gray-50 rounded">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{event.title}}</span>
                <span class="text-sm text-gray-500">
                  {{event.date | date:'longDate'}}
                </span>
              </div>
              @if (event.description) {
                <p class="text-sm text-gray-600 mt-1">
                  {{event.description}}
                </p>
              }
            </div>
          }
        }
      }
    </mat-card-content>
  </mat-card>
</div>


// wordle.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './wordle.component.html'
})
export class WordleComponent {}

// wordle.component.html
<div class="bg-white p-6 rounded-lg shadow-md">
  <p class="text-gray-600">Wordle game coming soon!</p>
</div>