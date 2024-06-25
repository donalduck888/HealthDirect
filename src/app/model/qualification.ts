export interface Qualification {
    id?: string
    doctorID?: string
    qualificationName?: string
    qualificationShortName?: string
    description?: string
    qualificationType?: string
    qualificationAttachment?: string
}


export interface DoctorQualificationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class QualificationPortal implements Qualification{
    constructor(
        public id?: string,
        public doctorID?: string,
        public qualificationName?: string,
        public qualificationShortName?: string,
        public description?: string,
        public qualificationType?: string,
        public qualificationAttachment?: string
    ){}

}

