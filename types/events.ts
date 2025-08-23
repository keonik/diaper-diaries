export type EventType = 'diaper' | 'breastfeed' | 'bottle' | 'measurement' | 'note' | 'sleep';

export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  createdAt: Date;
}

export interface BaseEvent {
  id: string;
  childId: string;
  type: EventType;
  timestamp: Date;
  note?: string;
}

export interface DiaperEvent extends BaseEvent {
  type: 'diaper';
  diaperType: 'pee' | 'poop' | 'both';
}

export interface BreastfeedEvent extends BaseEvent {
  type: 'breastfeed';
  leftDuration: number; // seconds
  rightDuration: number; // seconds
  startSide?: 'left' | 'right';
}

export interface BottleEvent extends BaseEvent {
  type: 'bottle';
  ounces: number;
  formulaType?: string;
}

export interface MeasurementEvent extends BaseEvent {
  type: 'measurement';
  weight?: number; // pounds
  height?: number; // inches
}

export interface NoteEvent extends BaseEvent {
  type: 'note';
  title?: string;
}

export interface SleepEvent extends BaseEvent {
  type: 'sleep';
  status: 'asleep' | 'awake';
  duration?: number; // seconds, calculated when status changes from asleep to awake
}

export type BabyEvent = DiaperEvent | BreastfeedEvent | BottleEvent | MeasurementEvent | NoteEvent | SleepEvent;