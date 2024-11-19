import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { AdminUnitLeaseListingsComponent } from '../listings/units/admin-unit-lease-listings/admin-unit-lease-listings.component';
import { AdminUnitLeasePaymentStatusComponent } from '../payment-statuses/admin-unit-lease-payment-status/admin-unit-lease-payment-status.component';
import { AdminUnitLeaseActiveListingsComponent } from '../listings/units/admin-unit-lease-active-listings/admin-unit-lease-active-listings.component';
import { AdminUnitLeasePendingListingsComponent } from '../listings/units/admin-unit-lease-pending-listings/admin-unit-lease-pending-listings.component';
import { AdminUnitLeaseUpcomingExpirationListingsComponent } from '../listings/units/admin-unit-lease-upcoming-expiration-listings/admin-unit-lease-upcoming-expiration-listings.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LEASETYPE } from 'src/app/core/constants/enums';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { AdminMasterLeaseTabPreferenceService } from 'src/app/core/preferences/admin.master-lease.tab.selection.preferences';

@Component({
    selector: 'app-admin-master-unit-lease',
    templateUrl: './admin-master-unit-lease.component.html',
    styleUrls: ['./admin-master-unit-lease.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        AdminUnitLeaseListingsComponent,
        AdminUnitLeasePaymentStatusComponent,
        AdminUnitLeaseActiveListingsComponent,
        AdminUnitLeasePendingListingsComponent,
        AdminUnitLeaseUpcomingExpirationListingsComponent,
        ButtonModule,
    ],
    providers: [DialogService],
})
export class AdminMasterUnitLeaseComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    refreshEvent = new EventEmitter<void>();
    activeIndex: number;

    constructor(
        public dialogService: DialogService,
        private adminMasterLeaseTabSelectionPreferenceService: AdminMasterLeaseTabPreferenceService
    ) {}

    ngOnInit() {
        this.adminMasterLeaseTabSelectionPreferenceService.adminUnitLeaseSelectedTabIndex$.subscribe(
            (tabIndex) => {
                this.activeIndex = tabIndex;
            }
        );
    }

    openCreateLeaseAgreementModal() {
        this.ref = this.dialogService.open(
            AdminCreateUnitLeaseAgreementStepperComponent,
            {
                header: 'Lease Creator',

                data: {
                    type: LEASETYPE.UNIT,
                },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.refreshEvent.emit();
            }
        });
    }

    handleTabChange(event: TabViewChangeEvent) {
        this.adminMasterLeaseTabSelectionPreferenceService.updateAdminUnitLeaseSelectedTab(
            event.index
        );
    }
}
