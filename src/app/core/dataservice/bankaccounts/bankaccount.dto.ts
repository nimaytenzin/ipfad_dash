import { LandLordDTO } from '../../dto/users/landlord.dto';

export interface BankAccountDto {
    id: number;

    bankName: string;
    accountName: string;
    accountNumber: number;

    remarks: string;
}

export interface CreateBankAccountDto {
    bankName: string;
    accountNumber: number;
    accountName: string;
    remarks: string;
}
