export const TENANTSIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/tenant'],
            },
            {
                label: 'Lease',
                icon: 'pi pi-fw pi-file-o',
                routerLink: ['/tenant/lease'],
            },
            {
                label: 'Payments',
                icon: 'pi pi-fw pi-money-bill',
                routerLink: ['/tenant/payments'],
            },
            {
                label: 'Notifications',
                icon: 'pi pi-fw pi-bell',
                routerLink: ['/tenant/notifications'],
            },

            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/tenant/profile'],
            },
        ],
    },
];

export const ADMINSIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/admin'],
            },
        ],
    },

    {
        label: 'Properties',
        items: [
            {
                label: 'Owners',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-users/owners'],
            },
            {
                label: 'Thrams',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/thrams'],
            },
            {
                label: 'Plots',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/plots'],
            },
            {
                label: 'Buildings',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/list-buildings'],
            },
        ],
    },

    {
        label: 'Lease',
        items: [
            {
                label: 'Land Lease',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-lease/lands'],
            },
            {
                label: 'Building Lease',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-lease/buildings'],
            },
            {
                label: 'Unit Lease',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-lease/units'],
            },
        ],
    },
    {
        label: 'Search Module',
        items: [
            {
                label: 'Search',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/search/plots'],
            },
            {
                label: 'Map View',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/map-view'],
            },
        ],
    },

    {
        label: 'Users',
        items: [
            {
                label: 'Managers',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-users/managers'],
            },

            {
                label: 'Tenants',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-users/tenants'],
            },
            // {
            //     label: 'Admins',
            //     icon: 'pi pi-fw pi-th-large',
            //     routerLink: ['/admin/master-users/admins'],
            // },
        ],
    },
    {
        label: 'Transactions',
        items: [
            {
                label: 'Advice',
                icon: 'pi pi-fw pi-building',
                routerLink: ['/admin/master-transactions'],
            },
            {
                label: 'Receipts',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-transactions/invoices'],
            },
            {
                label: 'Remittance',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-transactions/invoices'],
            },
        ],
    },

    {
        label: 'Locations',
        items: [
            {
                label: 'Dzongkhags',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-locations/dzongkhags'],
            },
            {
                label: 'Administrative Zones',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-locations/adm-zones'],
            },
            {
                label: 'SubAdministrative Zones',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-locations/subadm-zones'],
            },
        ],
    },

    {
        label: 'System',
        items: [
            {
                label: 'Roles',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-roles'],
            },
            {
                label: 'Bank Accounts',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-bank-accounts'],
            },
        ],
    },
];

export const OWNERSIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/owner'],
            },
        ],
    },
    {
        label: 'Properties',
        items: [
            {
                label: 'Listings',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/owner/properties'],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/search'],
            },
            {
                label: 'Map View',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-properties/map'],
            },
        ],
    },

    {
        label: 'Tenants',
        items: [
            {
                label: 'Listing',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-users/tenants'],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-users/admins'],
            },
        ],
    },
    {
        label: 'Lease',
        items: [
            {
                label: 'Lease Agreements',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-lease'],
            },
        ],
    },
    {
        label: 'Transactions',
        items: [
            {
                label: 'Rental Payments',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-transactions/invoices'],
            },
        ],
    },
    {
        label: 'Tools',
        items: [
            {
                label: 'Rental Income Report Generator',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/master-dzongkhags'],
            },
            {
                label: 'Property Tax Report Generator',
                icon: 'pi pi-fw pi-building',
                routerLink: ['/admin/master-admzones'],
            },
        ],
    },
];
