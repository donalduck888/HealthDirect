export interface TreatmentNote {
    id?: string
    issueDate?: string
    doctorId?: string
    doctorName?: string
    note?: string
    remarks?: string
    fileUrl?: string
    productName?: string
    prescription?: string
    qty?: string
    unit?: string
    patientId?: string
    patientName?: string
    products?: Product[]
  }
  
  export interface Product {
    productId?: string
    productCode?: string
    productName?: string
    active?: boolean
    productDesp?: string
    expireDate?: string
    mcatId?: string
    subCatId?: string
    retailPrice?: string
    cost?: string
    qty?: string
    discountPrice?: string
    priceIncludeTax?: boolean
    treatmentNotes?: string
  }

  export class TreatmentNoteClass implements TreatmentNote {
    public id?: string;
    public issueDate?: string;
    public doctorId?: string;
    public doctorName?: string;
    public note?: string;
    public remarks?: string;
    public fileUrl?: string;
    public productName?: string;
    public prescription?: string;
    public qty?: string;
    public unit?: string;
    public patientId?: string;
    public patientName?: string;
    public products?: Product[];
  }

  export interface TreatmentNotePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number; 
    startIndex: number;
    endIndex: number;
}
  
  export class ProductClass implements Product {
    public productId?: string;
    public productCode?: string;
    public productName?: string;
    public active?: boolean;
    public productDesp?: string;
    public expireDate?: string;
    public mcatId?: string;
    public subCatId?: string;
    public retailPrice?: string;
    public cost?: string;
    public qty?: string;
    public discountPrice?: string;
    public priceIncludeTax?: boolean;
    public treatmentNotes?: string;
  }