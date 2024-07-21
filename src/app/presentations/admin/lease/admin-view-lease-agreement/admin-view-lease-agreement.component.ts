import { Component, OnInit } from '@angular/core';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GETMONTHNAME } from 'src/app/core/utility/date.helper';
import { CommonModule } from '@angular/common';
import { API_URL } from 'src/app/core/constants/constants';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-admin-view-lease-agreement',
    templateUrl: './admin-view-lease-agreement.component.html',
    styleUrls: ['./admin-view-lease-agreement.component.scss'],
    standalone: true,
    imports: [ButtonModule, DividerModule, CommonModule],
})
export class AdminViewLeaseAgreementComponent implements OnInit {
    leaseAgreement: LeaseAgreementDTO;
    leaseAgreementId: number;
    getMonthName = GETMONTHNAME;

    tenantSignatureUri: string;

    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private config: DynamicDialogConfig
    ) {
        console.log('Openeingn lease agreement view modal');
        console.log(this.config.data);

        this.leaseAgreement = this.config.data;
        this.tenantSignatureUri =
            API_URL + '/' + this.leaseAgreement.tenant.signatureUri;
    }
    generatePdf() {
        const data = [
            ['Name', 'Email', 'Country'],
            ['John Doe', 'johndoe@example.com', 'USA'],
            ['Jane Smith', 'janesmith@example.com', 'Canada'],
            ['Bob Johnson', 'bobjohnson@example.com', 'UK'],
        ];

        const docDefinition = {
            content: [
                { text: 'User Data', style: 'header' },
                { table: { body: data } },
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
            },
        };

        pdfMake.createPdf(docDefinition).download('userdata.pdf');
    }

    ngOnInit() {}
}
