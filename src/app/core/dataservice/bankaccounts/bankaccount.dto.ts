import { LandLordDTO } from '../../dto/users/landlord.dto';
import { UserDTO } from '../users-and-auth/dto/user.dto';

export interface BankAccountDto {
    id: number;
    adminId: number;
    ownerId?: number;

    bankName: string;
    accountName: string;
    accountNumber: number;

    remarks: string;

    admin: UserDTO;
    owner: UserDTO;
}

export interface CreateBankAccountDto {
    bankName: string;
    adminId: number;
    ownerId?: number;
    accountNumber: number;
    accountName: string;
    remarks: string;
}
