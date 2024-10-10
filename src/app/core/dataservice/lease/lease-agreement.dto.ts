import {
    LEASESTATUS,
    LEASETYPE,
    LEASEUSES,
    LESSEETYPE,
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
import { OrganiztionDTO } from '../organization/organization.dto';
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
    lesseeType: LESSEETYPE;
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

    organizationId?: number;
    organization?: OrganiztionDTO;
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

    terminationRemarks?: string;
    terminationDate?: string;
}

export interface CreateLeaseAgreementDTO {
    type: LEASETYPE;
    bankAccountId: number;

    status: LEASESTATUS;
    lesseeType: LESSEETYPE;
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
    organizationId?: number;

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
    lesseeType: LESSEETYPE;

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
    organizationId?: number;

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
    lesseeType: LESSEETYPE;

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
    organizationId?: number;

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

export interface TerminateLeaseAgreementDTO {
    terminationRemarks: string;
    terminationDate: string;
    leaseAgreementId: number;
}

//OLD MODELS
