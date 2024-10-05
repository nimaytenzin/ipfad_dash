import { Component, OnInit } from '@angular/core';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GETMONTHNAME } from 'src/app/core/utility/date.helper';
import { CommonModule } from '@angular/common';
import { API_URL } from 'src/app/core/constants/constants';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-admin-view-lease-agreement',
    templateUrl: './admin-view-lease-agreement.component.html',
    styleUrls: ['./admin-view-lease-agreement.component.scss'],
    standalone: true,
    imports: [ButtonModule, DividerModule, CommonModule],
})
export class AdminViewLeaseAgreementComponent implements OnInit {
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

    getMonthName = GETMONTHNAME;

    tenantSignatureUri: string;

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private pdfGeneratorDataService: PDFGeneratorDataService
    ) {
        console.log('Openeingn lease agreement view modal');
        console.log(this.config.data);

        this.leaseAgreement = this.config.data;
        this.leaseCharges = this.leaseAgreement.leaseSurcharges;

        this.totalMonthlyPayable = Number(this.leaseAgreement.rent);
        // this.leaseCharges.forEach((item) => {
        //     this.totalMonthlyPayable += item.amount;
        // });

        // this.tenantSignatureUri =
        //     API_URL + '/' + this.leaseAgreement.tenant.signatureUri;
    }

    ngOnInit() {}

    downloadLeasePdf() {
        this.pdfGeneratorDataService
            .DownloadLeaseAgreementPdf(this.leaseAgreement.id)
            .subscribe({
                next: (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lease-agreement.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
            });
    }
}
