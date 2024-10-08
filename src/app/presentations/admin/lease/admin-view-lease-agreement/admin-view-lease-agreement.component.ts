import { Component, OnInit } from '@angular/core';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GETMONTHNAME } from 'src/app/core/utility/date.helper';
import { CommonModule } from '@angular/common';
import { API_URL } from 'src/app/core/constants/constants';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';
import { TabViewModule } from 'primeng/tabview';
import {
    LEASETYPE,
    LESSEETYPE,
    LESSORTYPE,
} from 'src/app/core/constants/enums';
import { GETUNITCONFIGSTRING } from 'src/app/core/utility/helper.function';

import { ToWords } from 'to-words';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import {
    AuthenticatedUser,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';

@Component({
    selector: 'app-admin-view-lease-agreement',
    templateUrl: './admin-view-lease-agreement.component.html',
    styleUrls: ['./admin-view-lease-agreement.component.scss'],
    standalone: true,
    imports: [
        ButtonModule,
        DividerModule,
        CommonModule,
        TabViewModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextareaModule,
        FormsModule,
        CalendarModule,
    ],
    providers: [ConfirmationService],
})
export class AdminViewLeaseAgreementComponent implements OnInit {
    leaseTypeEnums = LEASETYPE;
    lesseeTypeEnums = LESSEETYPE;

    lessorTypes = LESSORTYPE;
    leaseAgreement: LeaseAgreeementDTO = {
        plot: {
            thram: {
                owners: [],
            },
        },
    } as LeaseAgreeementDTO;
    leaseAgreementId: number;
    leaseCharges: LeaseSurchargeDTO[] = [];
    totalMonthlyPayable = 0;

    showTerminateLeaseModal: boolean = false;
    terminationDate = new Date();
    leaseTerminationRemarks: string;

    showRenewLeaseModal: boolean = false;
    newLeaseEndDate = new Date();

    getUnitConfigString = GETUNITCONFIGSTRING;
    getMonthName = GETMONTHNAME;

    tenantSignatureUri: string;
    admin: AuthenticatedUser;

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private pdfGeneratorDataService: PDFGeneratorDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private authService: AuthService
    ) {
        console.log('Openeingn lease agreement view modal');
        console.log(this.config.data);

        this.admin = this.authService.GetAuthenticatedUser();

        this.leaseAgreement = this.config.data;
        this.leaseCharges = this.leaseAgreement.leaseSurcharges;

        this.totalMonthlyPayable = Number(this.leaseAgreement.rent);
        this.leaseCharges.forEach((item) => {
            this.totalMonthlyPayable += item.amount;
        });

        // this.tenantSignatureUri =
        //     API_URL + '/' + this.leaseAgreement.tenant.signatureUri;
    }

    ngOnInit() {}

    getWords(number: number) {
        const toWords = new ToWords({
            localeCode: 'en-IN',
            converterOptions: {
                currency: true,
                ignoreDecimal: false,
                ignoreZeroCurrency: false,
                doNotAddOnly: false,
                currencyOptions: {
                    name: 'Ngultrum',
                    plural: 'Ngultrum',
                    symbol: 'Nu.',
                    fractionalUnit: {
                        name: 'Chetrum',
                        plural: 'Chetrums',
                        symbol: '',
                    },
                },
            },
        });

        return toWords.convert(number);
    }

    notifyEntryDamageReportSubmission() {}
    openConfirmLeaseTerminationModal() {
        this.showTerminateLeaseModal = true;
    }
    confirmLeaseTermination() {
        this.messageService.add({
            severity: 'info',
            summary: 'Lease Terminated',
            detail: 'Lease has been terminated and tenants have been notified',
            life: 3000,
        });
        this.showTerminateLeaseModal = false;
    }
    openRenewLeaseModal() {
        this.showRenewLeaseModal = true;
    }
    confirmLeaseRenewal() {
        this.messageService.add({
            severity: 'info',
            summary: 'Lease Renewed',
            detail: 'Lease has been renewed and tenants have been notified',
            life: 3000,
        });
        this.showRenewLeaseModal = false;
    }

    downloadLeasePdf() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.pdfGeneratorDataService
            .DownloadLeaseAgreementPdf(this.leaseAgreement.id)
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lease-agreement.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Lease has been downloaded.Please check your downloads.',
                    life: 3000,
                });
            });
    }
}
