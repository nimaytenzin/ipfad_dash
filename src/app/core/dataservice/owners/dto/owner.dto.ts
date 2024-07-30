export interface OwnerDTO {
    id: number;
    nameEnglish: string;
    nameDzongkha: string;
    cid: string;
    phoneNumber: number;
    email: string;
}

export interface CreateOwnerDTO {
    nameEnglish: string;
    nameDzongkha: string;
    cid: string;
    phoneNumber: number;
    email: string;
}
