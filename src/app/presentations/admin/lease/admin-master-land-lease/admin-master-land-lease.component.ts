import { Component, EventEmitter, OnInit } from '@angular/core';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { AdminLandLeaseListingsComponent } from '../listings/plots/admin-land-lease-listings/admin-land-lease-listings.component';
import { AdminLandLeasePaymentStatusComponent } from '../payment-statuses/admin-land-lease-payment-status/admin-land-lease-payment-status.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { LEASETYPE } from 'src/app/core/constants/enums';
import { AdminLandLeaseActiveListingsComponent } from '../listings/plots/admin-land-lease-active-listings/admin-land-lease-active-listings.component';
import { AdminLandLeasePendingListingsComponent } from '../listings/plots/admin-land-lease-pending-listings/admin-land-lease-pending-listings.component';
import { AdminLandLeaseUpcomingExpirationListingsComponent } from '../listings/plots/admin-land-lease-upcoming-expiration-listings/admin-land-lease-upcoming-expiration-listings.component';
import { AdminMasterLeaseTabPreferenceService } from 'src/app/core/preferences/admin.master-lease.tab.selection.preferences';

@Component({
    selector: 'app-admin-master-land-lease',
    templateUrl: './admin-master-land-lease.component.html',
    styleUrls: ['./admin-master-land-lease.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        AdminLandLeaseListingsComponent,
        AdminLandLeasePaymentStatusComponent,
        ButtonModule,
        AdminLandLeaseActiveListingsComponent,
        AdminLandLeasePendingListingsComponent,
        AdminLandLeaseUpcomingExpirationListingsComponent,
    ],
    providers: [DialogService],
})
export class AdminMasterLandLeaseComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    refreshEvent = new EventEmitter<void>();
    activeIndex: number;

    constructor(
        private dialogService: DialogService,
        private adminMasterLeaseTabSelectionPreferenceService: AdminMasterLeaseTabPreferenceService
    ) {}

    ngOnInit() {
        this.adminMasterLeaseTabSelectionPreferenceService.adminLandLeaseSelectedTabIndex$.subscribe(
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
                width: 'max-content',
                data: {
                    type: LEASETYPE.LAND,
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
        this.adminMasterLeaseTabSelectionPreferenceService.updateAdminLandLeaseSelectedTab(
            event.index
        );
    }
}
