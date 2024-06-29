import { FLOORLEVELS } from '../constants/enums';

export function PARSEBUILDINGFLOORS(
    regularFloorCount: number,
    basementCount: number,
    stiltCount: number,
    atticCount: number,
    jamthogCount: number
): string {
    const basementLabel = basementCount
        ? basementCount === 1
            ? 'B+'
            : `${basementCount}B+`
        : '';
    const stiltLabel = stiltCount
        ? stiltCount === 1
            ? 'S+'
            : `${stiltCount}S+`
        : '';
    const regularFloorLabel =
        regularFloorCount > 0
            ? regularFloorCount - 1 === 0
                ? `G`
                : `G+${regularFloorCount - 1}`
            : 'G';

    const atticLabel = atticCount
        ? atticCount === 1
            ? 'A'
            : `${atticCount}A`
        : '';
    const jamthogLabel = jamthogCount
        ? jamthogCount === 1
            ? 'J'
            : `${jamthogCount}J`
        : '';

    return `${basementLabel}${stiltLabel}${regularFloorLabel}${
        atticLabel ? `+${atticLabel}` : ''
    }${jamthogLabel ? `+${jamthogLabel}` : ''}`;
}

export function PARSEFLOORLEVELS(floorLevel: string) {
    if (!floorLevel) return null;
    switch (floorLevel.toUpperCase()) {
        case '3B':
            return 'Sub Basement 2';
        case '2B':
            return 'Sub Basement';
        case 'B':
            return 'Basemement';
        case 'S':
            return 'STILT';
        case 'G':
            return 'Ground Floor';
        case '1':
            return '1st Floor';
        case 'A':
            return 'Attic';
        case 'J':
            return 'Jamthog';
        default:
            return null; // Or handle invalid input as needed
    }
}

export function PARSEFULLNAME(firstName, middleName, lastName) {
    let fullName = '';

    if (firstName) {
        fullName += firstName + ' ';
    }

    if (middleName) {
        fullName += middleName + ' ';
    }

    if (lastName) {
        fullName += lastName;
    }

    return fullName.trim();
}
