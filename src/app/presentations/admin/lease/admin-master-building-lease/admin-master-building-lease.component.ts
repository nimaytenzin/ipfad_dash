import { Component, EventEmitter, OnInit } from '@angular/core';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { AdminBuildingLeaseListingsComponent } from '../listings/buildings/admin-building-lease-listings/admin-building-lease-listings.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { LEASETYPE } from 'src/app/core/constants/enums';
import { AdminMasterLeaseTabPreferenceService } from 'src/app/core/preferences/admin.master-lease.tab.selection.preferences';
import { AdminBuildingLeaseActiveListingsComponent } from '../listings/buildings/admin-building-lease-active-listings/admin-building-lease-active-listings.component';
import { AdminBuildingLeasePendingListingsComponent } from '../listings/buildings/admin-building-lease-pending-listings/admin-building-lease-pending-listings.component';
import { AdminBuildingLeaseUpcomingExpirationListingsComponent } from '../listings/buildings/admin-building-lease-upcoming-expiration-listings/admin-building-lease-upcoming-expiration-listings.component';
import { AdminBuildingLeasePaymentStatusComponent } from '../payment-statuses/admin-building-lease-payment-status/admin-building-lease-payment-status.component';

@Component({
    selector: 'app-admin-master-building-lease',
    templateUrl: './admin-master-building-lease.component.html',
    styleUrls: ['./admin-master-building-lease.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        AdminBuildingLeaseListingsComponent,
        ButtonModule,
        AdminBuildingLeaseActiveListingsComponent,
        AdminBuildingLeasePendingListingsComponent,
        AdminBuildingLeaseUpcomingExpirationListingsComponent,
        AdminBuildingLeasePaymentStatusComponent,
    ],
    providers: [DialogService],
})
export class AdminMasterBuildingLeaseComponent implements OnInit {
    refreshEvent = new EventEmitter<void>();
    ref: DynamicDialogRef | undefined;
    activeIndex: number;

    constructor(
        private dialogService: DialogService,
        private adminMasterLeaseTabSelectionPreferenceService: AdminMasterLeaseTabPreferenceService
    ) {}

    ngOnInit() {
        this.adminMasterLeaseTabSelectionPreferenceService.adminBuildingLeaseSelectedTabIndex$.subscribe(
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
                    type: LEASETYPE.BUILDING,
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
        this.adminMasterLeaseTabSelectionPreferenceService.updateAdminBuildingLeaseSelectedTab(
            event.index
        );
    }
}
