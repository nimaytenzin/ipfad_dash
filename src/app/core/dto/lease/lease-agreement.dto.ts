import { PaymentAdviceDto } from '../payments/payment-advice/payment-advice.dto';
import { BuildingDTO } from '../properties/building.dto';
import { UnitDTO } from '../units/unit.dto';
import { AdminDTO } from '../users/admin.dto';
import { LandLordDTO } from '../users/landlord.dto';
import { OwnerDTO } from '../users/owner.dto';
import { TenantDTO } from '../users/tenant.dto';
import { LeaseRuleDTO } from './lease-rule.dto';
import { LeaseSurchargeDTO } from './lease-surcharge.dto';

export interface LeaseAgreementDTO {
    id: number;

    leaseStatus: string;
    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    tenantId: number;
    tenant?: TenantDTO;
    landlordId: number;
    landlord?: OwnerDTO;
    witnessId: number;
    witness: AdminDTO;

    buildingId: number;
    building: BuildingDTO;
    unitId: number;
    unit: UnitDTO;

    rent: number;
    leaseSurcharges: LeaseSurchargeDTO[];
    securityDepositAmount: string;
    paymentDueDay: number;
    applyLatePaymentFee: boolean;

    use: string;
    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;
    leaseRules?: LeaseRuleDTO[];

    paymentAdvise?: PaymentAdviceDto[];
}

export interface LeaseAgreementPartiesDTO {
    tenantId: number;
    landlordId: number;
    witnessId: number;

    tenant: TenantDTO;
    landlord: LandLordDTO;

    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;
}

export interface LeaseAgreementPropertiesDTO {
    buildingId: number;
    building: BuildingDTO;
    unit: UnitDTO;
    unitId: number;
    use: string;
}

export interface LeaseAgreementDurationDTO {
    leaseDurationMonths: number;
    leaseStartDate: Date;
    leaseEndDate: Date;
}
export interface LeaseAgreementChargesDTO {
    rent: number;
    leaseSurcharges: LeaseSurchargeDTO[];
    securityDepositAmount: number;
}

export interface LeaseAgreementTermsDTO {
    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;
    rentIncreaseNoticePeriod: number;
    evictionNoticePeriod: number;
    vacationNoticePeriod: number;
    leaseRules: LeaseRuleDTO[];
    paymentDueDay: number;
    applyLatePaymentFee: boolean;
}

export interface GroupedLeaseAgreementDTO {
    parties: LeaseAgreementPartiesDTO;
    properties: LeaseAgreementPropertiesDTO;
    terms: LeaseAgreementTermsDTO;
    charges: LeaseAgreementChargesDTO;
    duration: LeaseAgreementDurationDTO;
}

export interface CreateLeaseAgreementDTO {
    leaseStatus: string;
    tenantId: number;
    landlordId: number;
    witnessId: number;
    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    buildingId: number;
    unitId: number;
    use: string;

    leaseDurationMonths: number;
    leaseStartDate: Date;
    leaseEndDate: Date;

    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;
    rentIncreaseNoticePeriod: number;
    evictionNoticePeriod: number;
    vacationNoticePeriod: number;
    leaseRules: LeaseRuleDTO[];
    paymentDueDay: number;
    applyLatePaymentFee: boolean;
    rent: number;
    leaseSurcharges: LeaseSurchargeDTO[];
    securityDepositAmount: number;
}
