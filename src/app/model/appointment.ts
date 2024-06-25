import { CalendarEvent } from "angular-calendar";

export interface Appointment {
    id?: string;
    doctorId?: string;
    doctorName?: string;
    appointmentType?: string;
    patientId?: string;
    appDate?: Date;
    appTimeFrom?: Date;
    appTimeTo?: Date;
    repeat?: boolean;
    note?: string;
    isComplete?: boolean;
    createdOn?: string;
    isCall?: boolean;
    callId?: string;
    clinicId?: string;
    clinicName?: string;
    removeOn?: string;
    urgent?: boolean;
    extraInfo?: string;
    isApp?: boolean;
    waitingNumber?: number;
    patientName?: string;
  
}

export interface AppointmentType {
    id: number;
    viewValue: string;
}

export interface EventAction {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent, }: {
        event: CalendarEvent;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}


export interface AppointmentManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class AppointmentSpec implements Appointment {
    constructor(
        public doctorId?: string,
        public doctorName?: string,
        public appointmentType?: string,
        public patientId?: string,
        public patientName?: string,

        public appDate?: Date,
        public appTimeFrom?: Date,
        public appTimeTo?: Date,
        public repeat?: boolean,
        public note?: string,
        public isComplete?: boolean,
        public createdOn?: string,
        public isCall?: boolean,
        public callId?: string,
        public clinicId?: string,
        public clinicName?: string,
        public removeOn?: string,
        public urgent?: boolean,
        public extraInfo?: string,
        public isApp?: boolean,
        public waitingNumber?: number

    ) { }
}
