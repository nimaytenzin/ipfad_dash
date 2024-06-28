import { Component, OnInit } from '@angular/core';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GETMONTHNAME } from 'src/app/core/utility/date.helper';
import { CommonModule } from '@angular/common';
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
    instance: DynamicDialogComponent | undefined;
    leaseAgreementId: number;
    getMonthName = GETMONTHNAME;
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);

        if (this.instance && this.instance.data) {
            this.leaseAgreement = this.instance.data;

            console.log('PASED LEASE AGREEMENT', this.leaseAgreement);
        }
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
