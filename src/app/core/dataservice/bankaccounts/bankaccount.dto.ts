import { OwnerDTO } from '../../dto/users/owner.dto';

export interface BankAccountDto {
    id: number;

    bankName: string;
    accountName: string;
    accountNumber: number;

    landlordId: number;
    owner?: OwnerDTO;
}

export interface CreateBankAccountDto {
    landlordId: number;
    bankName: string;
    accountNumber: number;
    accountName: string;
}
