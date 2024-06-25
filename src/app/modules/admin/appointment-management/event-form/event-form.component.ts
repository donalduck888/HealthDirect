import { AfterViewInit, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarEventModel } from '../event.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { MatColors } from '@fuse/mat-colors';
import { Appointment, AppointmentType } from 'app/model/appointment';
import { Doctor, DoctorAccount } from 'app/model/doctor';
import { DoctorManagementService } from 'app/services/doctor-management.service';
import moment from 'moment';
import { AppointmentManagementService } from 'app/services/appointment-management.service';
import { Patient } from 'app/model/patient';
import { PatientManagementService } from 'app/services/patient-service.service';
import { Observable, map, startWith } from 'rxjs';

interface IDiagData {
  event?: string, 
  appointment: Appointment
}

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventFormComponent implements OnInit, AfterViewInit {
  filteredNames: Observable<Patient[]>;
  action: string;
  eventForm: FormGroup;
  dialogTitle: string;
  presetColors = MatColors.presets;
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  selectedDoctor: Doctor | undefined = new DoctorAccount();
  isButtonClicked: boolean = false;
  isButtonClickedtwo: boolean = false;
  avaDates: string[] = [];
  patients: Patient[] = []

  /**
   * Constructor
   *
   * @param {MatDialogRef<EventFormComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: IDiagData,
    private _formBuilder: FormBuilder,
    private _userManagementService: DoctorManagementService,
    private _appManagementService: AppointmentManagementService,
    private _patientService: PatientManagementService
  ) {
    this.action = _data.event!;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit this Appointment ' + _data.appointment.doctorName;
    }
    else {
      this.dialogTitle = 'Add New Appointment';
    }

    this.eventForm = this.createEventForm();

    this.eventForm.get(['patientName']).valueChanges.subscribe(e => {
      this._filterNames(e);
    })

    console.log(this.eventForm.getRawValue())
  }


  ngOnInit(): void {

    this._userManagementService.getDoctors().subscribe(
      (response) => {
        this.doctors = response.body;


        const appDate = new Date(this._data.appointment.appDate);
        const dayOfWeek = appDate.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysOfWeek[dayOfWeek];



        // this.eventForm.get(['doctorName']).patchValue(this._data.appointment.doctorId);    
        //     this.eventForm.get(['doctorId']).patchValue(this._data.appointment.doctorId);

        this.onDoctorSelection(this._data.appointment.doctorId)

        // this.eventForm.get(['patientName']).patchValue(this._data.appointment.patientName);
        this._filterNames(this._data.appointment.patientName, () => {
          this.eventForm.get(['patientName']).patchValue(this.patients.find(f => f.id === this._data.appointment.patientId))
        });

        this.eventForm.get(['appointmentType']).patchValue(this._data.appointment.appointmentType);      
          this.eventForm.get(['id']).patchValue(this._data.appointment.id);
          this.eventForm.get(['appTimeFrom']).patchValue(this._data.appointment.appTimeFrom);
          this.eventForm.get(['appTimeTo']).patchValue(this._data.appointment.appTimeTo); 

        // this.onDoctorSelection(this._data.appointment.doctorId)
        this.eventForm.get(['dayOfWeek']).patchValue(dayName.toLowerCase());

        this.onDaySelect(moment(this._data.appointment.appDate.toString()) .toString())
        this.eventForm.get(['appDate']).patchValue(moment(this._data.appointment.appDate.toString()).format('DD-MM-yyyy')); 


      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {

  }

  onDoctorSelection(doc: string) {
    this._userManagementService.getDoctorById(doc).subscribe(
      (selectedDoctor) => {
        this.selectedDoctor = selectedDoctor;
        this.eventForm.get(['doctorId']).patchValue(
          this.selectedDoctor.id
        );
        this.eventForm.get(['doctorName']).patchValue(
          this.selectedDoctor.name
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }


  onDaySelect(event: string) {

    if (moment().toDate().getDate() > moment(event, 'dddd').toDate().getDate()) {

      this.avaDates = [moment(event, 'dddd').add(7, 'd').format('DD-MM-yyyy'), moment(event, 'dddd').add(14, 'd').format('DD-MM-yyyy'), moment(event, 'dddd').add(21, 'd').format('DD-MM-yyyy')]

    } else {
      this.avaDates = [moment(event, 'dddd').format('DD-MM-yyyy'), moment(event, 'dddd').add(7, 'd').format('DD-MM-yyyy'), moment(event, 'dddd').add(14, 'd').format('DD-MM-yyyy')]

      console.log(this.eventForm.getRawValue())
    }

  }

  onDateSelect(date: string) {
    this._appManagementService.searchAppointments('(doctorId:' + this.selectedDoctor.id + ')AND(appDate:' + moment(date, 'DD-MM-yyyy').format('YYYY-MM-DD') + ')', 0, 1).subscribe(e => {
      this.eventForm.get(['appDate']).patchValue(date);
      if (e.body.length === 0) {
        this.eventForm.get(['waitingNumber']).patchValue(1);
        const d = moment(date, 'DD-MM-yyyy').format('YYYY-MM-DD') + (this.getDocotrAvaTime(moment(date, 'DD-MM-yyyy').format('dddd'), 0))
        const d2 = moment(date, 'DD-MM-yyyy').format('YYYY-MM-DD') + (this.getDocotrAvaEndTime(moment(date, 'DD-MM-yyyy').format('dddd'), 0))
        this.eventForm.get(['appTimeFrom']).patchValue(d)
        this.eventForm.get(['appTimeTo']).patchValue(d2)
      } else {
        const wNo = ++e.body[0].waitingNumber;
        this.eventForm.get(['waitingNumber']).patchValue(wNo);
        const factor = wNo * 10;
        const d = moment(date, 'DD-MM-yyyy').format('YYYY-MM-DD') + (this.getDocotrAvaTime(moment(date, 'DD-MM-yyyy').format('dddd'), factor))
        const d2 = moment(date, 'DD-MM-yyyy').format('YYYY-MM-DD') + (this.getDocotrAvaEndTime(moment(date, 'DD-MM-yyyy').format('dddd'), factor))
        this.eventForm.get(['appTimeFrom']).patchValue(d)
        this.eventForm.get(['appTimeTo']).patchValue(d2)

      }
    })
  }
  getDocotrAvaTime(arg0: string, factor: number): string {
    switch (arg0.toLowerCase()) {
      case 'monday':
        return moment(String(this.selectedDoctor.monfrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'tuesday':
        return moment(String(this.selectedDoctor.tuefrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'wednesday':
        return moment(String(this.selectedDoctor.wedfrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'thursday':
        return moment(String(this.selectedDoctor.thufrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'friday':
        return moment(String(this.selectedDoctor.frifrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'saturday':
        return moment(String(this.selectedDoctor.satfrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';

      case 'sunday':
        return moment(String(this.selectedDoctor.sunfrom), 'HHmm').add(factor, 'minutes').format('THH:mm:ss.000') + 'Z';
      default:
        break;
    }
    return '';
  }
  getDocotrAvaEndTime(arg0: string, factor: number): string {
    switch (arg0.toLowerCase()) {
      case 'monday':
        return moment(String(this.selectedDoctor.monfrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'tuesday':
        return moment(String(this.selectedDoctor.tuefrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'wednesday':
        return moment(String(this.selectedDoctor.wedfrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'thursday':
        return moment(String(this.selectedDoctor.thufrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'friday':
        return moment(String(this.selectedDoctor.frifrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'saturday':
        return moment(String(this.selectedDoctor.satfrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      case 'sunday':
        return moment(String(this.selectedDoctor.sunfrom), 'HHmm').add(factor + 10, 'minutes').format('THH:mm:ss.000') + 'Z';
      default:
        break;

    }
    return '';
  }

  getvaliddata() {

  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create the event form
   *
   * @returns {FormGroup}
   */
  createEventForm(): FormGroup {
    return new FormGroup({
      extraInfo: new FormControl(),
      appTimeFrom: new FormControl(),
      appTimeTo: new FormControl(),
      clinicName: new FormControl(),
      clinicId: new FormControl(),
      appDate: new FormControl(),
      doctorId: new FormControl(),
      doctorName: new FormControl(),
      appointmentType: new FormControl(),
      start: new FormControl(),
      waitingNumber: new FormControl(),
      patientId: new FormControl(),
      patientName: new FormControl(),
      dayOfWeek: new FormControl(),      
      id: new FormControl(),
    });
  }


  private _filterNames(value: string | Patient, callback?: Function) {
    if (typeof value !== typeof ' ') {
      console.log('object detected')
      return;
    }

    this._patientService.searchPatients(value !== undefined ? value.toString().toLowerCase() + '*' : '*').subscribe(e => {
      this.patients = e.body;
      if (typeof callback == typeof function () { }) {
        callback()
      }
    });
    // this._patientSer.searchPatients(value).pipe(map((d:Patient[])=>{ return d; }));


    // return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  displayFn(user: Patient): string {
    return user && user.patientName ? user.patientName : '';
  }

}
