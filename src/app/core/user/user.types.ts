export interface User
{
    id?: string;
    login?:string;
    name?: string;
    firstName?:string;
    lastName?:string;
    email?: string;
    avatar?: string;
    status?: string;
    imageUrl?:string;
    activated?:boolean;
    langKey?:string;
    createdBy?:string;
    createDate?:string;
    lastModifiedBy?:string;
    lastModifiedDate?:Date;
    authorities?:string[]

}


export interface UserManagementPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


export class UserAccount implements User{
    constructor(
      public  id?: string,
      public  login?:string,
      public  name?: string,
      public  firstName?:string,
      public  lastName?:string,
      public  email?: string,
      public  avatar?: string,
      public  status?: string,
      public  imageUrl?:string,
      public  activated?:boolean,
      public  langKey?:string,
      public  createdBy?:string,
      public  createDate?:string,
      public  lastModifiedBy?:string,
      public  lastModifiedDate?:Date, 
      public  authorities?:string[]
    ){}
}
