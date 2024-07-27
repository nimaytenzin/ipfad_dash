import { BuildingDTO } from '../../dto/properties/building.dto';

export interface OwnerSummaryStatsDTO {
    buildingCount: number;
    unitCount: number;

    activeLeaseCount: number;
    totalRentalIncome: number;
    pendingPaymentAmount: number;

    buildings: BuildingDTO[];
}
