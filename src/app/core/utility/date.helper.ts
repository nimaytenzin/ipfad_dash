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

export function GETELAPSEDTIME(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const elapsed = now.getTime() - date.getTime();

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years + ' year' + (years > 1 ? 's' : '') + ' ago';
    }
    if (months > 0) {
        return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    }
    if (weeks > 0) {
        return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
    }
    if (days > 0) {
        return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    }
    if (hours > 0) {
        return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    }
    if (minutes > 0) {
        return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    }
    return seconds + ' second' + (seconds > 1 ? 's' : '') + ' ago';
}
