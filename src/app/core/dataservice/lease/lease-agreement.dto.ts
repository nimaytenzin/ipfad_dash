import { PaymentAdviceDto } from '../../dto/payments/payment-advice/payment-advice.dto';
import { BuildingDTO } from '../../dto/properties/building.dto';
import { UnitDTO } from '../../dto/units/unit.dto';
import { AdminDTO } from '../../dto/users/admin.dto';
import { LandLordDTO } from '../../dto/users/landlord.dto';
import { TenantDTO } from '../../dto/users/tenant.dto';
import { OwnerDTO } from '../owners/dto/owner.dto';
import { LeaseRuleDTO } from './lease-rule.dto';
import { LeaseSurchargeDTO } from './lease-surcharge.dto';

export interface LeaseAgreementDTO {
    id: number;
    entryDamageReportSubmitted: boolean;

    leaseStatus: string;
    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    tenantId: number;
    tenant?: TenantDTO;
    ownerId: number;
    owner?: OwnerDTO;
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

    vacationNoticePeriod: number;
    evictionNoticePeriod: number;
    rentIncreaseNoticePeriod: number;

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
    entryDamageReportSubmitted: boolean;

    tenantId: number;
    ownerId: number;
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
