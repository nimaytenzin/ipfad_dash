import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';

@Component({
    selector: 'app-admin-lease-terminate-lease',
    templateUrl: './admin-lease-terminate-lease.component.html',
    styleUrls: ['./admin-lease-terminate-lease.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        CalendarModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
    ],
})
export class AdminLeaseTerminateLeaseComponent implements OnInit {
    leaseModificationDate: Date = new Date();
    leaseModificationRemarks: string;
    leaseAgreement: LeaseAgreeementDTO;

    constructor(
        private leaseAgreementDataService: LeaseAgreementDataService,
        private config: DynamicDialogConfig,
        private closingRef: DynamicDialogRef,
        private messageService: MessageService
    ) {
        this.leaseAgreement = this.config.data;
    }

    ngOnInit() {}

    confirmLeaseTermination() {
        if (!this.leaseModificationDate || !this.leaseModificationRemarks) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Input',
                detail: 'Please enter both lease termination date and remarks',
                life: 3000,
            });
            return;
        }
        this.messageService.add({
            severity: 'info',
            summary: 'Terminating Lease',
            detail: 'terminating lease...',
            life: 3000,
        });

        this.leaseAgreementDataService
            .OwnerTerminateLeaseAgreement({
                leaseModificationRemarks: this.leaseModificationRemarks,
                leaseModificationDate:
                    this.leaseModificationDate.toDateString(),
                leaseAgreementId: this.leaseAgreement.id,
            })
            .subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Lease Terminated',
                        detail: 'Lease has been Terminated',
                        life: 3000,
                    });
                    this.closingRef.close({
                        status: 200,
                    });
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'error',
                        detail: err.error.message,
                        life: 3000,
                    });
                },
            });
    }
    close() {
        this.closingRef.close();
    }
}
