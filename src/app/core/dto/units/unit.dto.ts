import { BankAccountDto } from '../../dataservice/bankaccounts/bankaccount.dto';
import { LeaseAgreementDTO } from '../../dataservice/lease/lease-agreement.dto';
import { BuildingDTO } from '../properties/building.dto';

export interface UnitDTO {
    id: number;
    buildingId: number;
    bankAccountId: number;

    zhicharUnitId: number;
    zhicharQrUuid: string;
    floorLevel: string;
    unitNumber: string;
    bedroomCount: number;
    toiletCount: number;
    balconyCount: number;
    floorArea: number;
    powerConsumerId: string;

    building?: BuildingDTO;
    bankAccount?: BankAccountDto;

    activeLeaseAgreement?: LeaseAgreementDTO;
}

export interface CreateUnitDTO {
    buildingId: number;
    bankAccountId?: number;
    zhicharUnitId: number;
    zhicharQrUuid: string;
    floorLevel: string;
    unitNumber: string;
    bedroomCount: number;
    toiletCount: number;
    balconyCount: number;
    floorArea?: number;

    powerConsumerId?: string;
}

export interface UpdateUnitDto {
    buildingId?: number;
    bankAccountId?: number;
    zhicharUnitId?: number;
    zhicharQrUuid?: string;
    floorLevel?: string;
    unitNumber?: string;
    bedroomCount?: number;
    toiletCount?: number;
    balconyCount?: number;
    floorArea?: number;

    powerConsumerId?: string;
}
