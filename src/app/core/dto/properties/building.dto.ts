import { BuildingType } from '../../constants/enums';
import { AdministrativeZoneDTO } from '../locations/administrative-zone.dto';
import { DzongkhagDTO } from '../locations/dzongkhag.dto';
import { LocalityDTO } from '../locations/locality.dto';
import { SubAdministrativeZoneDTO } from '../locations/sub-administrative-zone.dto';
import { ThromdeDTO } from '../locations/thromde.dto';
import { BuildingPlotDTO } from '../ownership/buildingplot.dto';
import { UnitDTO } from '../units/unit.dto';
import { LandLordDTO } from '../users/landlord.dto';
import { BuildingAmenityDTO } from './building-amenity.dto';
import { BuildingImageDTO } from './building-image.dto';
import { BuildingOwnershipDto } from './building-ownership.dto';
import { BuildingRuleDTO } from './building-rule.dto';
import { BuildingSurchargeDTO } from './building-surcharge.dto';

export interface CreateBuildingDTO {
    isActive: number;
    zhicharBuildingId: number | null;
    zhicharQrUuid: string | null;

    buildingType: BuildingType | null;
    regularFloorCount: number;
    basementCount: number;
    stiltCount: number;
    atticCount: number;
    jamthogCount: number;
    areaSqM: number | null;

    latitude: number;
    longitude: number;

    name: string | null;
    buildingNumber: string | null;
    streetName: string | null;
    quadrant: string | null;
    landmark: string | null;

    dzongkhagId: number;
    administrativeZoneId: number;
    subadministrativeZoneId: number;
}

export interface BuildingDTO {
    id: number;

    isActive: number;
    zhicharBuildingId: number | null;
    zhicharQrUuid: number | null;

    buildingType: BuildingType | null;
    regularFloorCount: number | null;
    basementCount: number;
    stiltCount: number;
    atticCount: number;
    jamthogCount: number;
    areaSqM: number | null;

    latitude: number;
    longitude: number;

    name: string | null;
    buildingNumber: string | null;
    streetName: string | null;
    quadrant: string | null;
    landmark: string | null;

    dzongkhagId: number;
    dzongkhag: DzongkhagDTO;
    administrativeZoneId: number;
    administrativeZone: AdministrativeZoneDTO;
    subadministrativeZoneId: number;
    subadministrativeZone: SubAdministrativeZoneDTO;

    buildingAmenities: BuildingAmenityDTO[];
    buildingRules: BuildingRuleDTO[];
    buildingImages: BuildingImageDTO[];
    buildingSurcharges: BuildingSurchargeDTO[];
    units: UnitDTO[];
    BuildingOwnership?: BuildingOwnershipDto;
    owners: LandLordDTO[];
    plots: BuildingPlotDTO[];
}

export interface UpdateBuildingDto {
    isActive: number;
    zhicharBuildingId: number | null;
    zhicharQrUuid: string | null;

    buildingType: BuildingType | null;
    regularFloorCount: number;
    basementCount: number;
    stiltCount: number;
    atticCount: number;
    jamthogCount: number;
    areaSqM: number | null;

    latitude: number;
    longitude: number;

    name: string | null;
    buildingNumber: string | null;
    streetName: string | null;
    quadrant: string | null;
    landmark: string | null;

    dzongkhagId: number;
    administrativeZoneId: number;
    subadministrativeZoneId: number;
}
