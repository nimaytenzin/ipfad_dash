import {
    LEASESTATUS,
    LEASETYPE,
    LEASEUSES,
    LESSORTYPE,
} from '../../constants/enums';
import { PaymentAdviceDto } from '../../dto/payments/payment-advice/payment-advice.dto';
import { BuildingDTO } from '../../dto/properties/building.dto';
import { UnitDTO } from '../../dto/units/unit.dto';
import { AdminDTO } from '../../dto/users/admin.dto';
import { LandLordDTO } from '../../dto/users/landlord.dto';
import { TenantDTO } from '../../dto/users/tenant.dto';
import { BankAccountDto } from '../bankaccounts/bankaccount.dto';
import { PlotDTO } from '../land/dto/plot.dto';
import { OwnerDTO } from '../owners/dto/owner.dto';
import { UserDTO } from '../users-and-auth/dto/user.dto';
import { LeaseRuleDTO } from './lease-rule.dto';
import { LeaseSurchargeDTO } from './lease-surcharge.dto';

export interface LeaseAgreeementDTO {
    id: number;
    type: LEASETYPE;
    bankAccountId: number;
    bankAccount: BankAccountDto;

    status: LEASESTATUS;
    lessorType: LESSORTYPE;

    entryDamageReportSubmitted: boolean;
    securityDepositPaid: boolean;

    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    plotId: number;
    plot: PlotDTO;

    tenantId: number;
    tenant: UserDTO;
    buildingId?: number;
    building?: BuildingDTO;
    unitId?: number;
    unit?: UnitDTO;

    rent: number;
    use: LEASEUSES;

    securityDepositAmount: string;
    paymentDueDay: number;
    applyLatePaymentFee: boolean;

    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;

    vacationNoticePeriod: number;
    evictionNoticePeriod: number;
    rentIncreaseNoticePeriod: number;

    leaseSurcharges: LeaseSurchargeDTO[];
    leaseRules: LeaseRuleDTO[];
    paymentAdvise?: PaymentAdviceDto[];

    areaLeased?: number;
    areaUnit?: string;
    ratePerArea?: number;
}

export interface CreateLeaseAgreementDTO {
    type: LEASETYPE;
    bankAccountId: number;

    status: LEASESTATUS;
    lessorType: LESSORTYPE;

    entryDamageReportSubmitted: boolean;
    securityDepositPaid: boolean;

    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    plotId: number;
    tenantId: number;
    buildingId?: number;
    unitId?: number;

    rent: number;
    use: LEASEUSES;

    securityDepositAmount: number;
    paymentDueDay: number;
    applyLatePaymentFee: boolean;

    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;

    vacationNoticePeriod: number;
    evictionNoticePeriod: number;
    rentIncreaseNoticePeriod: number;

    areaLeased?: number;
    areaUnit?: string;
    ratePerArea?: number;

    leaseSurcharges: LeaseSurchargeDTO[];
    leaseRules: LeaseRuleDTO[];
}

export interface CreateBuildingLeaseAgreementDTO {
    type: LEASETYPE;
    bankAccountId: number;

    status: LEASESTATUS;
    lessorType: LESSORTYPE;

    entryDamageReportSubmitted: boolean;
    securityDepositPaid: boolean;

    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    plotId: number;
    tenantId: number;
    buildingId: number;
    rent: number;
    use: LEASEUSES;

    securityDepositAmount: number;
    paymentDueDay: number;
    applyLatePaymentFee: boolean;

    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;

    vacationNoticePeriod: number;
    evictionNoticePeriod: number;
    rentIncreaseNoticePeriod: number;

    leaseSurcharges: LeaseSurchargeDTO[];
    leaseRules: LeaseRuleDTO[];
}

export interface CreatePlotLeaseAgreementDTO {
    type: LEASETYPE;
    bankAccountId: number;

    status: LEASESTATUS;
    lessorType: LESSORTYPE;

    entryDamageReportSubmitted: boolean;
    securityDepositPaid: boolean;

    agreementDay: number;
    agreementMonth: number;
    agreementYear: number;

    leaseDurationMonths: number;
    leaseStartDate: string;
    leaseEndDate: string;

    plotId: number;
    tenantId: number;
    areaLeased: number;
    areaUnit: string;
    ratePerArea: number;

    rent: number;
    use: LEASEUSES;

    securityDepositAmount: string;
    paymentDueDay: number;
    applyLatePaymentFee: boolean;

    tenantSubletAuthority: boolean;
    tenantPrematureTermination: boolean;
    ownerPrematureTermination: boolean;

    vacationNoticePeriod: number;
    evictionNoticePeriod: number;
    rentIncreaseNoticePeriod: number;

    leaseSurcharges: LeaseSurchargeDTO[];
    leaseRules: LeaseRuleDTO[];
}

//OLD MODELS

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
