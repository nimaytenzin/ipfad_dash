import { UnitDTO } from '../../units/unit.dto';
import { TenantDTO } from '../../users/tenant.dto';

export interface CreatePaymentAdviceItemDto {
    paymentAdviseId?: number;
    particular: string;
    amount: number;
}

export interface CreatePaymentAdviceDto {
    unitId: number;
    buildingId: number;
    tenantId: number;
    leaseAgreementId: number;
    landlordId: number;
    title: string;
    month: number;
    year: number;
    totalAmount: number;
    amountDue: number;
    status: string;
    paymentAdviseItem: CreatePaymentAdviceItemDto[];
}

export interface PaymentAdviceItemDto {
    id: number;
    paymentAdviseId: number;
    particular: string;
    amount: number;
}

export interface PaymentAdviceDto {
    id: number;
    unitId: number;
    buildingId: number;
    tenantId: number;
    landlordId: number;

    title: string;
    month: number;
    year: number;

    totalAmount: number;
    amountDue: number;

    status: string;
    paymentAdviseItem: PaymentAdviceDto[];
    tenant: TenantDTO;
    unit: UnitDTO;
}

export interface GenerateBuildingPADto {
    buildingId: number;

    month: number;
    year: number;
}
