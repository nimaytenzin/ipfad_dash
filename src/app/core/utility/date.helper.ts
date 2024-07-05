export function GETMONTHDIFF(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
}

export function GETDMYFROMDATE(date: Date) {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    return { day: day, month: month, year: year };
}

export function GETMONTHYEARSTRING(date: Date) {
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    const monthName = GETMONTHNAME(month);

    return monthName + ',' + year;
}

export function GETMONTHNAME(monthNumber) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return monthNames[monthNumber - 1];
}

export function ExtractMonthAndYear(dateString: string): {
    month: number;
    year: number;
} {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { month, year };
}
