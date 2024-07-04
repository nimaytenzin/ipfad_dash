import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import { PARSEFLOORLEVELS } from 'src/app/core/utility/helper.function';
import { AdminViewLeaseAgreementComponent } from 'src/app/presentations/admin/lease/admin-view-lease-agreement/admin-view-lease-agreement.component';
import { TenantViewLeaseDetailsComponent } from '../../../dashboard/components/tenant-view-lease-details/tenant-view-lease-details.component';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-tenant-lease-lease-history',
    templateUrl: './tenant-lease-lease-history.component.html',
    styleUrls: ['./tenant-lease-lease-history.component.scss'],
    standalone: true,
    imports: [CommonModule, DividerModule],
    providers: [DialogService],
})
export class TenantLeaseLeaseHistoryComponent implements OnInit {
    @Input({
        required: true,
    })
    tenantId: number;

    zhidhayContactDetails = ZHIDHAYCONTACTDETAILS;
    showLeasePaymentBreakdownModal: boolean = false;
    selectedLease: LeaseAgreementDTO;

    ref: DynamicDialogRef | undefined;
    leaseHistory: LeaseAgreementDTO[];
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
                // this.activeLeaseAgreements = res;
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

            width: '600px',

            data: {
                leaseAgreementId: leaeAgreement.id,
            },
        });
    }
    viewLeasePaymentBreakdown(item: LeaseAgreementDTO) {
        this.selectedLease = item;
        this.showLeasePaymentBreakdownModal = true;
    }

    openLeaseDetailedView(item: LeaseAgreementDTO) {
        this.ref = this.dialogService.open(TenantViewLeaseDetailsComponent, {
            header: 'Lease Details',
            width: '600px',
            data: { ...item },
        });
    }
}
