import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { endOfMonth, isSameDay, isSameMonth, startOfDay, startOfMonth } from 'date-fns';
import { Subject, switchMap } from 'rxjs';
import { CalendarService } from './calendar.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { EventFormComponent } from './event-form/event-form.component';
import { FormGroup } from '@angular/forms';
import { Appointment } from 'app/model/appointment';
import { AppointmentManagementService } from 'app/services/appointment-management.service';
import * as moment from 'moment'; 
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CompleteAppointmentComponent } from './complete-appointment/complete-appointment.component';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html', 
  styleUrls: ['./appointment-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AppointmentManagementComponent implements OnInit, AfterViewInit {

  actions: CalendarEventAction[];
  activeDayIsOpen: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  events: CalendarEvent[]; 
  refresh: Subject<any> = new Subject();
  selectedDay: any;
  selectedMonth: any;
  view: string; 
  viewDate: Date;
  currentView: string = 'month';

  constructor(
    private _matDialog: MatDialog,
    private _calendarService: CalendarService, 
    private _umService: AppointmentManagementService, 
  ) {
    // Set the defaults
    this.view = 'day';
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
    this.selectedDay = { date: startOfDay(new Date()) };
    this.selectedMonth = { date: startOfMonth(new Date()) }

  }
  ngAfterViewInit(): void {


  }
  ngOnInit(): void {

    this.selectMonth(startOfMonth(new Date()), endOfMonth(new Date()));

  }

  selectMonth(start: Date, end: Date) {
    this._umService.searchAppointments('(appTimeFrom:[' + moment(start).format('yyyy-MM-DD') + ' TO ' + moment(end).format('yyyy-MM-DD') + ' ])').subscribe(
      (response: any) => {
        const newResp: CalendarEvent[] = response.body.map((obj: Appointment) => {
          const newObj: CalendarEvent = {
            start: new Date(obj.appTimeFrom),
            end: new Date(obj.appTimeTo),
            id: obj.id,
            color: { primary: obj.isApp ? 'blue' : 'green', secondary: 'green', secondaryText: 'white' },
            title: obj.doctorName + ' ,' + obj.appointmentType + ' ' + 'Appointment From' + ' ' + obj.patientName + ' ' + 'From :' + moment(obj.appTimeFrom).parseZone().format('hh:mm A') + ' To: ' + moment(obj.appTimeTo).parseZone().format('hh:mm A') + ', Urgent: ' + (Boolean(obj.urgent) ? 'YES' : 'NO') + ', Waiting Number: ' + obj.waitingNumber,
            actions: [
              {
                label: '<i class="material-icons">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => { 
                  this.editEvent('edit', obj.id!);
                }
              },
              {
                label: '<i class="material-icons">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.deleteEvent(event as Appointment);
                }
              }
            ]
          }
          return newObj
        })
        this.events = newResp;
      }
    );
  }

  switchToMonthView() {
    this.currentView = 'month';
  }

  switchToWeekView() {
    this.currentView = 'week';
  }

  switchToDayView() {
    this.currentView = 'day';
  }



  dayClicked(day: CalendarMonthViewDay): void {
    const date: Date = day.date;
    const events: CalendarEvent[] = day.events;

    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
    this.selectedDay = day;
    this.refresh.next(null);
  }


  addEvent(): void {
    this.events = this.events || [];

    this.dialogRef = this._matDialog.open(EventFormComponent, {
      width: '51%',
      panelClass: 'event-form-dialog',

      data: {
        event: 'new',
        date: this.selectedDay.date
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      const newEvent = response.getRawValue();
      console.log(newEvent, 'new data');

      const newEventDataModified: Appointment = {

        appTimeFrom: newEvent.appTimeFrom,
        appTimeTo: newEvent.appTimeTo,
        appDate: moment(newEvent.appDate, 'DD-MM-YYYY').add(1, 'd').toDate(),
        note: newEvent.title,
        doctorName: newEvent.doctorName,
        doctorId: newEvent.doctorId,
        waitingNumber: newEvent.waitingNumber,
        appointmentType: newEvent.appointmentType,
        patientId: newEvent.patientName.id,
        patientName: newEvent.patientName.patientName,


      };

      newEvent.actions = this.actions;


      this._umService.createUser(newEventDataModified).subscribe((createdEvent: Appointment) => {
        console.log(createdEvent)
        const newACalEvent: CalendarEvent = {
          start: createdEvent.appTimeFrom,
          end: createdEvent.appTimeTo,
          id: createdEvent.id,
          title: createdEvent.doctorName + ', Appointment Time From: ' + new Date(createdEvent.appTimeFrom).toLocaleTimeString() + ' To: ' + new Date(createdEvent.appTimeTo).toLocaleTimeString() + ', Urgent: ' + (Boolean(createdEvent.urgent) ? 'YES' : 'NO') + ', Waiting Number: ' + createdEvent.waitingNumber
        }
        this.events.push(newEvent);
        this.refresh.next(true);
      });
    });
  }


  deleteEvent(event): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this appointment?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const eventIndex = this.events.indexOf(event);
        this.events.splice(eventIndex, 1);
        this.refresh.next(true);

        this._umService.deleteProduct(event.id).subscribe(
          (isDeleted: Appointment) => {

          },
          (error: any) => {

          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  appointEvent(id: string): void {
    this._umService.getAppById(id).subscribe(
      (appointment: Appointment) => {

        const dialogRef = this._matDialog.open(CompleteAppointmentComponent, { data: appointment, width: '80%' });

        // Optional: You can subscribe to the dialog's afterClosed event if you want to handle any result after the dialog is closed.
        dialogRef.afterClosed().subscribe(result => {
        });
      },
      (error: any) => {
        // Handle error, e.g., show an error message
      }
    );
  }


  editEvent(action: string, id: string): void {
    this.events = this.events || [];
    // const eventIndex = this.events.indexOf(event); 
    this._umService.getAppById(id).subscribe(e => {
      this.dialogRef = this._matDialog.open(EventFormComponent, {
        width: '51%',
        panelClass: 'event-form-dialog',
        data: { event: 'edit', appointment: e } 
      });


      this.dialogRef.afterClosed().subscribe(response => {
        //  const formData: FormGroup = response[1];
        const newEvent = response[1].getRawValue();
        console.log(newEvent, 'new data');

        const toBeUpdated: Appointment = {
          appTimeFrom: newEvent.appTimeFrom,
          id: newEvent.id,
          appTimeTo: newEvent.appTimeTo,
          appDate: moment(newEvent.appDate, 'DD-MM-YYYY').add(1, 'd').toDate(),
          note: newEvent.title,
          doctorName: newEvent.doctorName,
          doctorId: newEvent.doctorId,
          waitingNumber: newEvent.waitingNumber,
          appointmentType: newEvent.appointmentType,
          patientId: newEvent.patientName.id,
          patientName: newEvent.patientName.patientName,
        };

        newEvent.actions = this.actions;
        // alert(JSON.stringify(toBeUpdated));
        this._umService.updateApp(toBeUpdated).subscribe((createdEvent: Appointment) => {
          console.log(createdEvent)
          const newACalEvent: CalendarEvent = {
            start: createdEvent.appTimeFrom,
            end: createdEvent.appTimeTo,
            id: createdEvent.id,
            title: createdEvent.doctorName + ', Appointment Time From: ' + new Date(createdEvent.appTimeFrom).toLocaleTimeString() + ' To: ' + new Date(createdEvent.appTimeTo).toLocaleTimeString() + ', Urgent: ' + (Boolean(createdEvent.urgent) ? 'YES' : 'NO') + ', Waiting Number: ' + createdEvent.waitingNumber
          }
          this.events.push(newEvent); 
          this.refresh.next(true);
        });

      });
    });

  }

  beforeMonthViewRender({ header, body }): void {
    /**
     * Get the selected day
     */
    const _selectedDay = body.find((_day) => {
      return _day.date.getTime() === this.selectedDay.date.getTime();
    });

    if (_selectedDay) {
      /**
       * Set selected day style 
       * @type {string}
       */
      _selectedDay.cssClass = 'bg-teal-600 drop-shadow-xl';
    }

  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    // console.warn('Dropped or resized', event);
    this.refresh.next(true);
  }
  dateChange(d: any) {
    this.selectedMonth = d;
    // alert(JSON.stringify(d))
    this.selectMonth(startOfMonth(new Date(d.date)), endOfMonth(new Date(d.date)));

  }
}