import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
    LEASETYPE,
    LESSEETYPE,
    LESSORTYPE,
} from 'src/app/core/constants/enums';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';
import { AdminReviseLeaseDurationComponent } from './sub-components/admin-revise-lease-duration/admin-revise-lease-duration.component';
import { ToWords } from 'to-words';
import { AdminReviseLeasePaymentsComponent } from './sub-components/admin-revise-lease-payments/admin-revise-lease-payments.component';

@Component({
    selector: 'app-admin-revise-lease',
    templateUrl: './admin-revise-lease.component.html',
    styleUrls: ['./admin-revise-lease.component.css'],
    standalone: true,
    imports: [CommonModule, DividerModule, ButtonModule],
    providers: [MessageService, DialogService],
})
export class AdminReviseLeaseComponent implements OnInit {
    leaseAgreement: LeaseAgreeementDTO;
    lessorTypes = LESSORTYPE;
    lesseeTypes = LESSEETYPE;
    totalMonthlyPayable: number = 0;
    ref: DynamicDialogRef | undefined;

    constructor(
        private config: DynamicDialogConfig,
        private messageService: MessageService,
        private pdfGeneratorDataService: PDFGeneratorDataService,
        private dialogService: DialogService,
        public closingRef: DynamicDialogRef
    ) {
        this.leaseAgreement = this.config.data;

        console.log(this.config.data);

        this.totalMonthlyPayable = Number(this.leaseAgreement.rent);
        this.leaseAgreement.leaseSurcharges.forEach((item) => {
            this.totalMonthlyPayable += item.amount;
        });
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

    ngOnInit() {}

    openReviseLeaseDurationModal() {
        this.ref = this.dialogService.open(AdminReviseLeaseDurationComponent, {
            header: 'Revise General Terms',
            data: {
                ...this.leaseAgreement,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.closingRef.close({
                    status: 200,
                });
            }
        });
    }
    openRevisePaymentsModal() {
        this.ref = this.dialogService.open(AdminReviseLeasePaymentsComponent, {
            header: 'Revise Payments',
            data: {
                ...this.leaseAgreement,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.closingRef.close({
                    status: 200,
                });
            }
        });
    }
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
}
