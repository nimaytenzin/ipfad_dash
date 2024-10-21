import { DamageStatus, DamageType } from '../../constants/enums';
import { LeaseAgreeementDTO } from '../lease/lease-agreement.dto';

export interface DamageItemDTO {
    id: number;
    leaseAgreementId: number;
    type: DamageType;
    status: DamageStatus;
    uuId: string;
    title: string;
    location: string;
    description: string;
    submissionDate: string;
    resolutionDate?: string;
    resolutionRemarks?: string;
    resolvedBy?: string;
    resolutionCharges?: number;

    leaseAgreement?: LeaseAgreeementDTO;
    damageItemImages?: DamageItemImageDTO[];

    images?: any[]; //additinoa for galleria module
}
export interface DamageItemImageDTO {
    id: number;
    damageId: number;

    uri: string;
}

export interface CreateDamageItemDTO {
    leaseAgreementId: number;
    type: DamageType;
    title: string;
    location: string;
    description: string;
    images: File[];
}

export interface ResolveDamageItemDTO {
    damageItemId: number;
    resolutionRemarks: string;
    resolvedBy: string;
    resolutionCharges?: number;
}
