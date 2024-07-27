import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';

interface IOrganization {
    nameEng: string;
    nameDzo: string;
    thrams: IThram[];
}

interface IThram {
    organization?: IOrganization;
    thramNo: string;
    administrativeZone: string; //dzongkhag/thromde
    subAdministrativeZone: string; //gewog/thromde village
    plots: IPlot[];
}

interface IPlot {
    thramNo?: IThram;
    location: string; //R or U

    ownershipType: string;
    ownerNameEnglish: string;
    ownerNameDzongkha: string;
    ownerCid: string;

    plotId: string;

    netArea: number;

    administrativeZone: string; //dzongkhag/thromde
    subAdministrativeZone: string; //gewog/thromde village
    lapName: string;
    lapCode: string;

    precinctName: string;
    precinctCode: string;

    areaUnit: string;
    plotCategory: string;
    remarks: string;
    buildings: IBuilding[];
}
interface IBuilding {
    id: number;
    name: string;
}

@Component({
    selector: 'app-admin-property-listings',
    templateUrl: './admin-property-listings.component.html',
    styleUrls: ['./admin-property-listings.component.css'],
    standalone: true,
    imports: [TableModule, CommonModule],
})
export class AdminPropertyListingsComponent implements OnInit {
    data: IOrganization[] = [
        {
            nameEng: 'Central Monastic Body',
            nameDzo: 'གཞུང་གྲྭ་ཚང་།',
            thrams: [
                {
                    thramNo: '3062',
                    administrativeZone: 'Thimphu',
                    subAdministrativeZone: 'Simtokha',
                    plots: [
                        {
                            location: 'U',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Duemang Kugyer',
                            ownerNameDzongkha: 'བདུད་མང་སྒར་སྒྲོལ་གསུམ',
                            ownerCid: 'N/A',
                            plotId: 'SM1-8',
                            netArea: 7602,
                            administrativeZone: 'Thimphu',
                            subAdministrativeZone: 'Simtokha',
                            lapName: 'Urban Village Medium Density(UV-2(MD))',
                            lapCode: 'UV2-MD',
                            precinctName:
                                'Urban Village Medium Density(UV-2(MD))',
                            precinctCode: 'UV2-MD',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [
                                {
                                    id: 1,
                                    name: 'NN Building',
                                },
                            ],
                        },
                        {
                            location: 'U',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Duemang Kugyer',
                            ownerNameDzongkha: 'བདུད་མང་སྒར་སྒྲོལ་གསུམ',
                            ownerCid: 'N/A',
                            plotId: 'SM1-12',
                            netArea: 26156,
                            administrativeZone: 'Thimphu',
                            subAdministrativeZone: 'Simtokha',
                            lapName: 'Urban Village 1',
                            lapCode: 'UV1',
                            precinctName: 'Urban Village 1',
                            precinctCode: 'UV1',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                        {
                            location: 'U',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Duemang Kugyer',
                            ownerNameDzongkha: 'བདུད་མང་སྒར་སྒྲོལ་གསུམ',
                            ownerCid: 'N/A',
                            plotId: 'SM1-202',
                            netArea: 18748,
                            administrativeZone: 'Thimphu',
                            subAdministrativeZone: 'Simtokha',
                            lapName: 'Urban Village Medium Density(UV-2(MD))',
                            lapCode: 'UV2-MD',
                            precinctName:
                                'Urban Village Medium Density(UV-2(MD))',
                            precinctCode: 'UV2-MD',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'land',
                            remarks: '',
                            buildings: [],
                        },
                    ],
                },
                {
                    thramNo: '872',
                    administrativeZone: 'Phuentsholing',
                    subAdministrativeZone: 'Phuentsholing',
                    plots: [
                        {
                            location: 'Phuentsholing',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Dratshang Tewa',
                            ownerNameDzongkha: 'སྤུངས་ཐིམ་གྲྭ་ཚང་།',
                            ownerCid: 'N/A',
                            plotId: 'PGT-2590',
                            netArea: 31711,
                            administrativeZone: 'Phuentsholing',
                            subAdministrativeZone: 'Phuentsholing',
                            lapName: 'Ammochu LAP',
                            lapCode: 'CH102',
                            precinctName: 'Urban Village 1 SUB-A',
                            precinctCode: 'UV1-SUBA',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                        {
                            location: 'Phuentsholing',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Dratshang Tewa',
                            ownerNameDzongkha: 'སྤུངས་ཐིམ་གྲྭ་ཚང་།',
                            ownerCid: 'N/A',
                            plotId: 'PGT-3073',
                            netArea: 45143,
                            administrativeZone: 'Phuentsholing',
                            subAdministrativeZone: 'Phuentsholing',
                            lapName: 'Ammochu LAP',
                            lapCode: '',
                            precinctName: 'Urban Village 1 SUB-A',
                            precinctCode: 'UV1-SUBA',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                        {
                            location: 'Phuentsholing',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Dratshang Tewa',
                            ownerNameDzongkha: 'སྤུངས་ཐིམ་གྲྭ་ཚང་།',
                            ownerCid: 'N/A',
                            plotId: 'PGT-3074',
                            netArea: 29734,
                            administrativeZone: 'Phuentsholing',
                            subAdministrativeZone: 'Phuentsholing',
                            lapName: 'Ammochu LAP',
                            lapCode: 'CH102',
                            precinctName: 'Urban Village 1 SUB-A',
                            precinctCode: 'UV1-SUBA',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                        {
                            location: 'Phuentsholing',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Dratshang Tewa',
                            ownerNameDzongkha: 'སྤུངས་ཐིམ་གྲྭ་ཚང་།',
                            ownerCid: 'N/A',
                            plotId: 'PGT-3832',
                            netArea: 16075,
                            administrativeZone: 'Phuentsholing',
                            subAdministrativeZone: 'Phuentsholing',
                            lapName: 'Ammochu LAP',
                            lapCode: 'CH102',
                            precinctName: 'Urban Village 1 SUB-A',
                            precinctCode: 'UV1-SUBA',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                        {
                            location: 'Phuentsholing',
                            ownershipType: 'Gerab Dratshang',
                            ownerNameEnglish: 'Pungthim Dratshang Tewa',
                            ownerNameDzongkha: 'སྤུངས་ཐིམ་གྲྭ་ཚང་།',
                            ownerCid: 'N/A',
                            plotId: 'PGT-3833',
                            netArea: 29797,
                            administrativeZone: 'Phuentsholing',
                            subAdministrativeZone: 'Phuentsholing',
                            lapName: 'Ammochu LAP',
                            lapCode: 'CH102',
                            precinctName: 'Urban Village 1 SUB-A',
                            precinctCode: '',
                            areaUnit: 'Sq.Ft',
                            plotCategory: 'Normal',
                            remarks: '',
                            buildings: [],
                        },
                    ],
                },
            ],
        },
    ];
    constructor() {}

    ngOnInit() {}
}
