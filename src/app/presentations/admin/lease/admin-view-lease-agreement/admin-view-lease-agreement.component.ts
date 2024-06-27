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
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-admin-view-lease-agreement',
    templateUrl: './admin-view-lease-agreement.component.html',
    styleUrls: ['./admin-view-lease-agreement.component.scss'],
    standalone: true,
    imports: [ButtonModule],
})
export class AdminViewLeaseAgreementComponent implements OnInit {
    leaseAgreement: LeaseAgreementDTO;
    instance: DynamicDialogComponent | undefined;
    leaseAgreementId: number;

    constructor(
        private leaseAgreementDataService: LeaseAgreementDataService,
        private ref: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);

        if (this.instance && this.instance.data) {
            this.leaseAgreementId = this.instance.data.leaseAgreementId;
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

    ngOnInit() {
        this.leaseAgreementDataService
            .FindLeaseAgreement(this.leaseAgreementId)
            .subscribe((res) => {
                console.log(res);
                this.leaseAgreement = res;
            });
    }
}
