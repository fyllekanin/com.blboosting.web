import { SlimUser } from '../../classes/slim-user.class';

export enum TimeTableTypes {
    EVENTS = 'events',
    RADIO = 'radio'
}

export interface TimetableEvent {
    eventId: number;
    name: string;
    createdAt: number;
    updatedAt: number;
}

export interface BookingResult {
    proceed: boolean;
    event: TimetableEvent;
    username: string;
    isUnbooking: boolean;
}

export interface Slot {
    timetableId: number;
    user: SlimUser;
    day: number;
    hour: number;
    event: TimetableEvent;
    isBooked: boolean;
    isCurrentSlot: boolean;
    displayHour: string;
}

export interface Timetable {
    current: Array<Slot>;
    all: Array<Slot>;
    type: string;
}
