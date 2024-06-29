import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import { AdminViewLeaseAgreementComponent } from 'src/app/presentations/admin/lease/admin-view-lease-agreement/admin-view-lease-agreement.component';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from 'src/app/presentations/admin/payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';
import { TagModule } from 'primeng/tag';
import { PARSEFLOORLEVELS } from 'src/app/core/utility/helper.function';

@Component({
    selector: 'app-tenant-active-lease',
    templateUrl: './tenant-active-lease.component.html',
    styleUrls: ['./tenant-active-lease.component.scss'],
    standalone: true,
    imports: [CommonModule, ButtonModule, ChipModule, DividerModule, TagModule],
    providers: [DialogService],
})
export class TenantActiveLeasecomponent implements OnInit {
    @Input({
        required: true,
    })
    tenantId: number;

    ref: DynamicDialogRef | undefined;
    activeLeaseAgreements: LeaseAgreementDTO[];
    parseFloorLevel = PARSEFLOORLEVELS;
    constructor(
        private leaseAgreementDataService: LeaseAgreementDataService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.getActiveLeaseAgreements();
    }

    getActiveLeaseAgreements() {
        this.leaseAgreementDataService
            .GetActiveLeaseAgreementsByTenant(this.tenantId)
            .subscribe((res) => {
                this.activeLeaseAgreements = res;
                console.log('ACTIVE LEASE AGREEMNT', res);
            });
    }
    computeMonthlyPayable(item: LeaseAgreementDTO) {
        let total = item.rent;
        for (let i = 0; i < item.leaseSurcharges.length; i++) {
            total += item.leaseSurcharges[i].amount;
        }
        return total;
    }

    getReadableDate(date: string) {
        return new Date(date).toDateString();
    }

    viewLease(leaeAgreement: LeaseAgreementDTO) {
        this.ref = this.dialogService.open(AdminViewLeaseAgreementComponent, {
            header: 'View Lease',

            width: '70vw',
            data: {
                leaseAgreementId: leaeAgreement.id,
            },
        });
    }
}
