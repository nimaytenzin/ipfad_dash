import { ThramDTO } from '../../land/dto/thram.dto';
import { OrganiztionDTO } from '../../organization/organization.dto';

export interface UserDTO {
    id: number;
    hasLoginAccess: boolean;

    nameEnglish: string;
    nameDzongkha?: string;
    cid?: string;
    email?: string;
    phoneNumber?: number;
    password?: string;
    adminId?: number;
    permanentAddress?: string;

    thrams?: ThramDTO[];

    organizations?: OrganiztionDTO[];
}

export interface CreateUserDTO {
    hasLoginAccess: boolean;

    nameEnglish: string;
    nameDzongkha?: string;
    cid?: string;
    email?: string;
    permanentAddress?: string;
    phoneNumber?: number;
    password?: string;

    adminId?: number;

    role: string;
}

export interface UpdateUserDetailsDTO {
    hasLoginAccess: boolean;

    nameEnglish: string;
    nameDzongkha?: string;
    cid?: string;
    email?: string;
    phoneNumber?: number;
    password?: string;

    adminId?: number;
}
