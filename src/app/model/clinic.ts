export interface Clinic {

    id?: string;
    clinicName?: string;
    patientId?: string;
    doctorId?: string;
    clnicRegistrationID?: string;
    clinicAddress?: string;
    clinicCity?: string;
    hotline1?: string;
    hotline2?: string;
    createdDate?: string;
    remark?: string;
} 


export interface ClinicManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class ClinicAccount implements Clinic {
    constructor(
        public id?: string,
        public patientId?: string,
        public clinicName?: string,
        public doctorId?: string,
        public clnicRegistrationID?: string,
        public clinicAddress?: string,
        public clinicCity?: string,
        public hotline1?: string,
        public hotline2?: string,
        public createdDate?: string,
        public postalCode?: string,
        public remark?: string

    ) { }
}
