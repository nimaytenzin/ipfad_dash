import { BuildingType } from '../../constants/enums';
import { PlotDTO } from '../../dataservice/land/dto/plot.dto';
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
    zhicharBuildingId: number;
    zhicharQrUuid: string;

    name: string;
    buildingNumber: string;
    buildingType: string;

    basementCount: number;
    stiltCount: number;
    regularFloorCount: number;
    atticCount: number;
    jamthogCount: number;

    latitude: number;
    longitude: number;
    address: string;
    landmark: string;
    areaSqM: number;

    dzongkhagId: number;
    administrativeZoneId: number;
    subadministrativeZoneId: number;

    plots: PlotDTO[];
}

export interface BuildingDTO {
    id: number;
    isActive: number;
    zhicharBuildingId: number;
    zhicharQrUuid: string;

    name: string;
    buildingNumber: string;
    buildingType: string;

    basementCount: number;
    stiltCount: number;
    regularFloorCount: number;
    atticCount: number;
    jamthogCount: number;

    latitude: number;
    longitude: number;
    address: string;
    landmark: string;
    areaSqM: number;

    dzongkhagId: number;
    administrativeZoneId: number;
    subadministrativeZoneId: number;

    dzongkhag: DzongkhagDTO;
    administrativeZone: AdministrativeZoneDTO;
    subadministrativeZone: SubAdministrativeZoneDTO;

    buildingAmenities: BuildingAmenityDTO[];
    buildingRules: BuildingRuleDTO[];
    buildingImages: BuildingImageDTO[];
    buildingSurcharges: BuildingSurchargeDTO[];
    units: UnitDTO[];
    plots: PlotDTO[];
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
