'use client';
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  PlusIcon, 
  HomeIcon, 
  GamepadIcon 
} from "lucide-react";

// Event Type Definition
interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

// Navigation Component
const AppNavigation = ({ 
  currentPage, 
  onNavigate,
  onAddEvent
}: { 
  currentPage: 'home' | 'wordle', 
  onNavigate: (page: 'home' | 'wordle') => void,
  onAddEvent: () => void 
}) => {
  return (
    <TooltipProvider>
      <div className="fixed left-0 top-0 h-full w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4 shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="w-12 h-12"
              size="icon"
            >
              <HomeIcon className="w-6 h-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={currentPage === 'wordle' ? 'default' : 'ghost'}
              onClick={() => onNavigate('wordle')}
              className="w-12 h-12"
              size="icon"
            >
              <GamepadIcon className="w-6 h-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Wordle Game</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline"
              onClick={onAddEvent}
              className="w-12 h-12 mt-auto mb-4"
              size="icon"
            >
              <PlusIcon className="w-6 h-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Event</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

// Add Event Form Component
const AddEventForm = ({ 
  onAddEvent,
  onCancel
}: { 
  onAddEvent: (event: Omit<Event, 'id'>) => void,
  onCancel: () => void 
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAddEvent({ 
        title, 
        date, 
        description 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
          placeholder="Enter event title"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="date">Event Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Input 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add event details"
          className="mt-1.5"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Event</Button>
      </div>
    </form>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'wordle'>('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const eventWithId = {
      ...newEvent,
      id: `event-${Date.now()}`
    };
    setEvents(prev => [...prev, eventWithId]);
    setIsAddEventModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AppNavigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onAddEvent={() => setIsAddEventModalOpen(true)}
      />

      <main className="flex-1 ml-16 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {currentPage === 'home' ? 'Event Tracker' : 'Wordle Game'}
          </h1>
        </header>

        {currentPage === 'home' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Info</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> John Doe
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> john.doe@example.com
                </p>
              </div>
            </div>

            {/* Events Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Events</h2>
              {events.length === 0 ? (
                <p className="text-gray-500">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-gray-50 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {event.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.date.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentPage === 'wordle' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Wordle game coming soon!</p>
          </div>
        )}
      </main>

      <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <AddEventForm 
            onAddEvent={addEvent}
            onCancel={() => setIsAddEventModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;