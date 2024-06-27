import { BankAccountDto } from '../bankaccounts/bankaccount.dto';
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
