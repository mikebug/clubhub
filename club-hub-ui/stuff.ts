npm install @angular/material lucide-angular

export interface Event {
    id: string;
    title: string;
    date: Date;
    description?: string;
  }
  
  export interface User {
    name: string;
    email: string;
  }

  import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events = new BehaviorSubject<Event[]>([]);

  getEvents(): Observable<Event[]> {
    return this.events.asObservable();
  }

  addEvent(event: Omit<Event, 'id'>): void {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    const currentEvents = this.events.getValue();
    this.events.next([...currentEvents, newEvent]);
  }
}

import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
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
  `
})
export class NavigationComponent {
  @Input() currentPage: 'home' | 'wordle' = 'home';
  @Output() onNavigate = new EventEmitter<'home' | 'wordle'>();
  @Output() onAddEvent = new EventEmitter<void>();
}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-add-event',
  template: `
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
  `
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

import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
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
          <ng-container *ngIf="events$ | async as events">
            <div *ngIf="events.length === 0" class="text-gray-500">
              No upcoming events
            </div>
            <div *ngFor="let event of events" class="mb-3 p-4 bg-gray-50 rounded">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{event.title}}</span>
                <span class="text-sm text-gray-500">
                  {{event.date | date:'longDate'}}
                </span>
              </div>
              <p *ngIf="event.description" class="text-sm text-gray-600 mt-1">
                {{event.description}}
              </p>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class HomeComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(private eventService: EventService) {
    this.events$ = this.eventService.getEvents();
  }

  ngOnInit(): void {}
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from './components/add-event/add-event.component';

@Component({
  selector: 'app-root',
  template: `
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

        <app-home *ngIf="currentPage === 'home'"></app-home>
        <app-wordle *ngIf="currentPage === 'wordle'"></app-wordle>
      </main>
    </div>
  `
})
export class AppComponent {
  currentPage: 'home' | 'wordle' = 'home';

  constructor(private dialog: MatDialog) {}

  setCurrentPage(page: 'home' | 'wordle'): void {
    this.currentPage = page;
  }

  openAddEventDialog(): void {
    this.dialog.open(AddEventComponent, {
      width: '500px'
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { HomeComponent } from './components/home/home.component';
import { WordleComponent } from './components/wordle/wordle.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AddEventComponent,
    HomeComponent,
    WordleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }