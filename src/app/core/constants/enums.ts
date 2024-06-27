export enum USERROLESENUM {
    'LANDLORD' = 'LANDLORD',
    'TENANT' = 'TENANT',
}

export enum ADMINROLES {
    'ADMIN' = 'SYSADMIN',
    'FINANCE' = 'FINANCEADMIN',
}

export enum BUILDINGSTATUS {
    'ACTIVE' = 'ACTIVE',
    'INACTIVE' = 'INACTIVE',
}

export enum FLOORLEVELS {
    'BASEMENT 3' = '3B',
    'BASEMENT 2' = '2B',
    'BASEMENT 1' = 'B',
    'STILT' = 'S',
    'GROUND FLOOR' = 'G',
    '1st Floor' = '1',
}

export enum BuildingType {
    'CONTEMPORARY' = 'Contemporary',
    'Traditional' = 'Traditional',
}

export const UNITNUMBERS = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
];

export enum UnitOccupancyStatus {
    'VACANT' = 'Vacant',

    'UNDER_MAINTENANCE' = 'Under Maintenance',
    'UNDER_CONSTRUCTION' = 'Under Construction',

    'OWNER_OCCUPIED' = 'Owner Occupied',
    'RENTED' = 'Rented',
    'SHORT_TERM_RENTAL' = 'Short Term Rental',
    'OTHERS' = 'Others',
}

export const NumberDropDownOptions = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
export const NumberDropDownOptionsAsString = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
].map((number) => number.toString());

export enum LocationTypes {
    'Rural' = 'R',
    'Urban' = 'U',
}
export enum AdministrativeZoneTypes {
    'Gewog' = 'Gewog',
    'Thromde' = 'Thromde',
}

export enum SubAdministrativeZoneTypes {
    'Chiwog' = 'Chiwog',
    'Locality' = 'Locality',
}

export enum LeaseAgreementSurchargeSource {
    BUILDING = 'Building',
    UNIT = 'Unit',
    ADDITIONAL = 'Additional',
}

export enum INVOICESTATUS {
    'Due' = 'DUE',
    'Paid' = 'PAID',
    'Remitted' = 'REMITTED',
}

export enum LEASESTATUS {
    'ACTIVE' = 'ACTIVE',
    'EXPIRED' = 'EXPIRED',
}

export enum INVOICETRANSACTIONTYPES {
    'TENANTPAYMENT' = 'TENANTPAYMENT',
    'LANDLORDPAYMENT' = 'LANDLORDPAYMENT',
}

export enum INVOICETRANSACTIONMODES {
    'RMAPG' = 'RMAPG',
    'MBOB' = 'MBOB',
}
export enum BUILDINGOWNERSHIPTYPES {
    'SOLE' = 'SOLE',
    'JOINT' = 'JOINT',
}
