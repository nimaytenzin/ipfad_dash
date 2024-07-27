export const API_URL = 'http://localhost:3002';
export const COMPANY_NAME = 'zhidhay.com';
export const ZHICHAR_API_URL = 'https://zhichar.bt/dev';

interface IZhidhayContactDetails {
    name: string;
    phoneNumber: number;
    email: string;
    address: string;
    webAppName: string;
}

export const ZHIDHAYCONTACTDETAILS: IZhidhayContactDetails = {
    name: '',
    webAppName: 'Gerab Nyed',
    phoneNumber: 17263764,
    email: 'info@zhidhay.com',
    address: 'Babesa, Thim Throm',
};
