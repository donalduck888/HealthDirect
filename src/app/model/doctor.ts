import { Moment } from "moment";

export interface Doctor
{ 
    id?: string;
    doctorId?: string;
    name?: string;
    licenseNo?: string;  
    phone?: string; 
    dob?: string;
    gender?: string; 
    designation?: string;         
    address?: string;  
    email?: string;  
    website?: string;
    qualificationID?: string;
    qualificationName?: string;
    qualificationShortName?: string;
    whatsapp?: string;   
    facebook?: string;
    viber?: string;  
    profileImg?: string;
    remarks?: string;
    isActive?: boolean;
    createdDate?: Moment;
    updatedDate?: string;
    clinicId?: string;
    monfrom?: number;
    monto?: number;
    monava?: boolean;
    tuefrom?: number;
    tueto?: number;
    tueava?: boolean;
    wedfrom?: number;
    wedto?: number;
    wedava?: boolean;
    thuto?: number;
    thufrom?: number;
    thuava?: boolean;
    frifrom?: number;
    frito?: number;
    friava?: boolean; 
    satfrom?: number;
    satto?: number;
    satava?: boolean;
    sunfrom?: number;
    sunto?: number; 
    sunava?: boolean;
}

export interface DoctorManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}






export class DoctorAccount implements Doctor{
    constructor(
        public id?: string,
        public doctorId?: string,
        public name?: string,
        public licenseNo?: string,
        public phone?: string,
        public dob?: string,
        public gender?: string,
        public designation?: string,
        public address?: string,
        public email?: string,
        public website?: string,
        public qualificationID?: string,
        public qualificationName?: string,
        public qualificationShortName?: string,
        public whatsapp?: string,
        public facebook?: string,
        public viber?: string,
        public profileImg?: string,
        public remarks?: string,
        public isActive?: boolean,
        public createdDate?: Moment,  
        public updatedDate?: string,
        public clinicId?: string,
        public monfrom?: number,
        public monto?: number,
        public monava: boolean=false,
        public tuefrom?: number,
        public tueto?: number,
        public tueava: boolean=false,
        public wedfrom?: number,
        public wedto?: number,
        public wedava: boolean=false,
        public thufrom?: number,
        public thuto?: number,
        public thuava: boolean=false,
        public frifrom?: number,
        public frito?: number,
        public friava: boolean=false,
        public satfrom?: number,
        public satto?: number,
        public satava: boolean=false,
        public sunfrom?: number,
        public sunto?: number, 
        public sunava: boolean=false,
    ){

    }
}
