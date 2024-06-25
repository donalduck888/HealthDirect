export interface Product {
    id?: string;
    productCode?: string;
    productName?: string;
    active?: boolean;
    productDesp?: string;
    expireDate?: string;
    mcatId?: string;
    subCatId?: string;
    retailPrice?: string;
    cost?: string;
    qty?: string;
    discountPrice?: string;
    priceIncludeTax?: boolean;
}


export interface ProductManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}



export class ProductSpec implements Product{
    constructor(
        public id?: string,
        public productCode?: string,
        public productName?: string,
        public active?: boolean,
        public productDesp?: string,
        public expireDate?: string,
        public mcatId?: string,
        public subCatId?: string,
        public retailPrice?: string,
        public cost?: string,
        public qty?: string,
        public discountPrice?: string,
        public priceIncludeTax?: boolean,
    ){}
}
