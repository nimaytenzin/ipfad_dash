import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { AdminViewLeaseAgreementComponent } from 'src/app/presentations/admin/lease/admin-view-lease-agreement/admin-view-lease-agreement.component';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from 'src/app/presentations/admin/payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';
import { TagModule } from 'primeng/tag';
import { AdminGenerateUnitPaymentAdviceComponent } from 'src/app/presentations/admin/payment/admin-generate-unit-payment-advice/admin-generate-unit-payment-advice.component';

@Component({
    selector: 'app-admin-unit-active-lease',
    templateUrl: './admin-unit-active-lease.component.html',
    styleUrls: ['./admin-unit-active-lease.component.scss'],
    standalone: true,
    imports: [CommonModule, ButtonModule, ChipModule, DividerModule, TagModule],
})
export class AdminUnitActiveLeaseComponent implements OnInit {
    @Input({
        required: true,
    })
    unitId: number;

    ref: DynamicDialogRef | undefined;
    activeLeaseAgreement: LeaseAgreementDTO = {} as LeaseAgreementDTO;

    constructor(
        private leaseAgreementDataService: LeaseAgreementDataService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.getActiveLeaseByUnit();

        console.log('PASSED UNIT ID', this.unitId);

        this.leaseAgreementDataService
            .GetActiveLeaseAgreementByUnit(this.unitId)
            .subscribe((res) => {
                console.log('ACTIVE LEASE AGREEMNT', res);
                this.activeLeaseAgreement = res;
            });
    }

    getActiveLeaseByUnit() {
        // this.leaseAgreementDataService
        //     .GetActiveLeaseAgreementByUnit(18)
        //     .subscribe((res) => {
        //         console.log('ACTIVE LEASE AGREEMNT', res);
        //         this.activeLeaseAgreement = res;
        //     });
    }
    computeMonthlyPayable(item: LeaseAgreementDTO) {
        // let total = item.rent;
        // for (let i = 0; i < item.leaseSurcharges.length; i++) {
        //     total += item.leaseSurcharges[i].amount;
        // }
        // return total;
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

    openPaymentGatewayPaymentModal(paymentAdvice: PaymentAdviceDto) {
        this.ref = this.dialogService.open(AdminPgPaymentStepperComponent, {
            header: 'Process Payment',
            width: '600px',
            data: { ...paymentAdvice },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.getActiveLeaseByUnit();
            }
        });
    }
    openGeneratePAModal() {
        this.ref = this.dialogService.open(
            AdminGenerateUnitPaymentAdviceComponent,
            {
                header: 'Generate Payment advice',
                data: { ...this.activeLeaseAgreement },
            }
        );
    }
}
