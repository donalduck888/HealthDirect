export interface Supplier {
    id?: string
    supId?: string
    name?: string
    code?: string
    image?: string
    address?: string
    city?: string
    state?: string
    countryID?: number
    currencyCode?: string
    postalCode?: string
    contactPerson?: string
    contactEmail?: string
    contactPhone?: string
    contactFax?: string
    remarks?: string
    createdBy?: string
    creadtedOn?: string
    updatedOn?: string
    updatedBy?: string
    isActive?: boolean
    royaltyPercentage?: string
    isMaster?: boolean
  }

export interface SupplierManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class SupplierList implements Supplier{
    constructor(
        public id?: string,
        public supId?: string,
        public name?: string,
        public code?: string,
        public image?: string,
        public address?: string,
        public city?: string,
        public state?: string,
        public countryID?: number,
        public currencyCode?: string,
        public postalCode?: string,
        public contactPerson?: string,
        public contactEmail?: string,
        public contactPhone?: string,
        public contactFax?: string,
        public remarks?: string,
        public createdBy?: string,
        public creadtedOn?: string,
        public updatedOn?: string,
        public  updatedBy?: string,
        public isActive?: boolean,
        public royaltyPercentage?: string,
        public isMaster?: boolean,
    ){

    }
}
