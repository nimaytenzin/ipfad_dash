import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { OwnerDataService } from 'src/app/core/dataservice/users-and-auth/owner.dataservice';
import { TenantDataService } from 'src/app/core/dataservice/users-and-auth/tenant.dataservice';
import { LeaseAgreementPartiesDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { GETDMYFROMDATE, GETMONTHNAME } from 'src/app/core/utility/date.helper';

@Component({
    selector: 'app-admin-create-lease-parties',
    standalone: true,
    imports: [
        CardModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        InputGroupAddonModule,
        InputGroupModule,
        ToastModule,
        CalendarModule,
    ],
    providers: [MessageService],
    templateUrl: './admin-create-lease-parties.component.html',
    styleUrls: ['./admin-create-lease-parties.component.scss'],
})
export class AdminCreateLeasePartiesComponent implements OnInit {
    tenantPhoneNumber: number;
    landlordPhoneNumber: number;

    selectedTenant: TenantDTO;
    selectedLandlord: LandLordDTO;

    agreementDate: Date = new Date();
    extractDMY = GETDMYFROMDATE;
    getMonthName = GETMONTHNAME;

    constructor(
        private createLeaseService: CreateLeaseService,
        private router: Router,
        private messageService: MessageService,
        private tenantDataService: TenantDataService,
        private landlordDataService: OwnerDataService
    ) {}

    ngOnInit() {
        this.restoreStateIfExists();
    }

    restoreStateIfExists() {
        const parties = this.getPartiesInformation();
        if (parties) {
            this.selectedLandlord = parties.landlord;
            this.selectedTenant = parties.tenant;
        }
    }

    getPartiesInformation(): LeaseAgreementPartiesDTO | undefined {
        return this.createLeaseService.getLeaseInformation().parties;
    }

    nextPage() {
        const dmyObject = this.extractDMY(this.agreementDate);
        const leaseParties: LeaseAgreementPartiesDTO = {
            tenantId: this.selectedTenant.id,
            landlordId: this.selectedLandlord.id,
            tenant: this.selectedTenant,
            landlord: this.selectedLandlord,
            witnessId: 1,
            agreementDay: dmyObject.day,
            agreementMonth: dmyObject.month,
            agreementYear: dmyObject.year,
        };
        this.createLeaseService.saveLeaseParties(leaseParties);

        this.messageService.add({
            severity: 'success',
            summary: 'Information Verified',
            detail: 'Check all fields',
        });
        this.createLeaseService.navigateToProperties();
    }

    prevPage() {
        // this.router.navigate(['steps/seat']);
    }

    searchTenantByPhoneNumber() {
        this.tenantDataService
            .SearchTenant({
                phoneNumber: this.tenantPhoneNumber,
            })
            .subscribe({
                next: (res) => {
                    console.log(res);
                    if (res) {
                        this.selectedTenant = res;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Tenant Found',
                            detail:
                                'Tenant with Phone Number ' +
                                this.tenantPhoneNumber +
                                ' found',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'No Tenant Found',
                            detail:
                                'No Tenant with Phone number ' +
                                this.tenantPhoneNumber,
                        });
                        this.tenantPhoneNumber = null;
                    }
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Message Content',
                    });
                    this.tenantPhoneNumber = null;
                },
            });
    }
    clearTenant() {
        this.selectedTenant = null;
    }
    clearLandlord() {
        this.selectedLandlord = null;
    }
    searchLandlordByPhoneNumber() {
        this.landlordDataService
            .SearchLandLord({
                phoneNumber: this.landlordPhoneNumber,
            })
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.selectedLandlord = res;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Landlord Found',
                            detail:
                                'Landlord with Phone Number ' +
                                this.landlordPhoneNumber +
                                ' found',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'No Landlord Found',
                            detail:
                                'No Landlord with Phone number ' +
                                this.landlordPhoneNumber,
                        });
                        this.landlordPhoneNumber = null;
                    }
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No Landlord Found',
                        detail:
                            'No Landlord with Phone number ' +
                            this.tenantPhoneNumber,
                    });
                    this.landlordPhoneNumber = null;
                },
            });
    }
}
