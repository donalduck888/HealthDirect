export interface Patient {

    id?: string;
    patientId?: string;
    patientName?: string;
    contactPerson?: string;
    dob?: string;
    phoneNo?: string;
    gender?: string;
    address?: string;
    fax?: string;
    postalCode?: string;
    remarks?: string;
    referenceNo?: string;
    city?: string;
    state?: string;
    country?: string;
    currencyType?: string;
    active?: boolean;
}

export interface PatientManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class PatientAccount implements Patient {
    constructor(
        public id?: string,
        public patientId?: string,
        public patientName?: string,
        public contactPerson?: string,
        public dob?: string,
        public phoneNo?: string,
        public gender?: string,
        public designation?: string,
        public address?: string,
        public fax?: string,
        public postalCode?: string,
        public remarks?: string,
        public referenceNo?: string,
        public country?: string,
        public currencyType?: string,
        public facebook?: string,
        public viber?: string,
        public profileImg?: string,
        public active?: boolean,

    ) { }
}
