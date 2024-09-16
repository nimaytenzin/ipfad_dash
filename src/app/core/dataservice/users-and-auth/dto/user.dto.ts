import { ThramDTO } from '../../land/dto/thram.dto';

export interface UserDTO {
    hasLoginAccess: boolean;

    nameEnglish: string;
    nameDzongkha?: string;
    cid?: string;
    email?: string;
    phoneNumber?: number;
    password?: string;
    adminId?: number;

    thrams?: ThramDTO[];
}

export interface CreateUserDTO {
    hasLoginAccess: boolean;

    nameEnglish: string;
    nameDzongkha?: string;
    cid?: string;
    email?: string;
    phoneNumber?: number;
    password?: string;

    adminId?: number;

    role: string;
}
