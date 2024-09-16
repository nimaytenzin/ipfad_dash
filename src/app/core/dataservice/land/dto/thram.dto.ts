import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { OwnerDTO } from '../../owners/dto/owner.dto';
import { PlotDTO } from './plot.dto';

export interface ThramDTO {
    id: number;
    dzongkhagId: number;
    administrativeZoneId: number;
    subAdministrativeZoneId: number;

    thramNo: string;
    ownerId: number;

    dzongkhag?: DzongkhagDTO;
    administrativeZone: AdministrativeZoneDTO;
    subAdministrativeZone: SubAdministrativeZoneDTO;
    owner?: OwnerDTO;
    plots?: PlotDTO[];
}

export interface CreateThramDTO {
    dzongkhagId: number;
    administrativeZoneId: number;
    subAdministrativeZoneId: number;
    thramNo: string;
    ownerId: number;
}

export interface SearchThramDTO {
    dzongkhagId: number;
    administrativeZoneId: number;

    thramNo: string;
}
