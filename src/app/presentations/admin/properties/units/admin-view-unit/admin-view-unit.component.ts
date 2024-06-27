import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import {
    PARSEFLOORLEVELS,
    PARSEFULLNAME,
} from 'src/app/core/utility/helper.function';
import { AdminUnitDetailsCardComponent } from '../components/admin-unit-details-card/admin-unit-details-card.component';
import { AdminUnitRulesCardComponent } from '../components/admin-unit-rules-card/admin-unit-rules-card.component';
import { AdminUnitSurchargesCardComponent } from '../components/admin-unit-surcharges-card/admin-unit-surcharges-card.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminEditUnitComponent } from '../crud-modals/admin-edit-unit/admin-edit-unit.component';
import { AdminCreateUnitBankLinkageComponent } from '../../../bankaccounts/admin-create-unit-bank-linkage/admin-create-unit-bank-linkage.component';
import { CommonModule } from '@angular/common';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { TableModule } from 'primeng/table';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { LeaseAgreementDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import { PaginatorModule } from 'primeng/paginator';
import { AdminViewLeaseAgreementComponent } from '../../../lease/admin-view-lease-agreement/admin-view-lease-agreement.component';
import {
    CreatePaymentAdviceDto,
    PaymentAdviceDto,
} from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { INVOICESTATUS, LEASESTATUS } from 'src/app/core/constants/enums';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AdminPgPaymentStepperComponent } from '../../../payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';
import { TagModule } from 'primeng/tag';
import { AdminUnitActiveLeaseComponent } from '../components/admin-unit-active-lease/admin-unit-active-lease.component';
import { DividerModule } from 'primeng/divider';
import { AdminUnitLeaseHistoryComponent } from '../components/admin-unit-lease-history/admin-unit-lease-history.component';

@Component({
    selector: 'app-admin-view-unit',
    standalone: true,
    imports: [
        ButtonModule,
        TabViewModule,
        QRCodeModule,
        AdminUnitDetailsCardComponent,
        AdminUnitRulesCardComponent,
        AdminUnitSurchargesCardComponent,
        BreadcrumbModule,
        CommonModule,
        ConfirmDialogModule,
        TableModule,
        PaginatorModule,
        TagModule,
        DividerModule,
        AdminUnitActiveLeaseComponent,
        AdminUnitLeaseHistoryComponent,
        TagModule,
    ],

    templateUrl: './admin-view-unit.component.html',
    styleUrl: './admin-view-unit.component.scss',
    providers: [DialogService, ConfirmationService],
})
export class AdminViewUnitComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    unitId: number;
    buildingId: number;

    unit: UnitDTO = {} as UnitDTO;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    bankList = [];

    pendingPaymentAdvice: PaymentAdviceDto[] = [];

    parseFloorLevel = PARSEFLOORLEVELS;

    totalAmountDue: number = 0;

    constructor(
        private route: ActivatedRoute,
        private unitDataService: UnitDataService,
        private router: Router,
        private dialogService: DialogService,
        private bankAccountDataService: BankAccountDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private paymentAdviceDataService: PaymentAdviceDataService
    ) {
        this.unitId = Number(this.route.snapshot.paramMap.get('unitId'));
        this.buildingId = Number(
            this.route.snapshot.paramMap.get('buildingId')
        );
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        this.bankList = this.bankAccountDataService.BankListWithLogo;

        this.getUnit();

        console.log('VIEW UINT PARENT COMPOT UNIT ID', this.unitId);
    }

    ngOnInit(): void {
        this.findAllPendingByUnit();
    }

    getBankLogo(shorthand: string) {
        let result = this.bankList.find((item) => item.shorthand === shorthand);
        return result ? result.logourl : '';
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

    getUnit() {
        this.unitDataService.GetUnit(this.unitId).subscribe((res) => {
            this.unit = res;
            this.items = [
                { label: 'Building' },
                { label: 'Units' },
                { label: this.unit.floorLevel + '-' + this.unit.unitNumber },
            ];
        });
    }

    goBack() {
        this.router.navigate(['/admin/master-properties/building/' + 3]);
    }

    openEditUnitModal() {
        this.ref = this.dialogService.open(AdminEditUnitComponent, {
            header: 'Edit Unit',
            data: { ...this.unit },
            width: '600px',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.getUnit();
            }
        });
    }

    openCreateUnitBankLinkageModal(unit: UnitDTO) {
        this.ref = this.dialogService.open(
            AdminCreateUnitBankLinkageComponent,
            {
                header: 'Link Bank Account',
                data: { ...unit },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Bank Account Linked',
                });
                this.getUnit();
            }
        });
    }

    unlinkBankAccount(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.unitDataService
                    .UpdateUnit(
                        {
                            bankAccountId: null,
                        },
                        this.unitId
                    )
                    .subscribe({
                        next: (res) => {
                            if (res) {
                                this.getUnit();
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Confirmed',
                                    detail: 'Bank Account Unlinked',
                                });
                            }
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Server Error',
                                life: 3000,
                            });
                        },
                    });
            },
        });
    }

    findAllPendingByUnit() {
        this.paymentAdviceDataService.GetAllPendingAdviceByUnit(18).subscribe({
            next: (res) => {
                console.log('PENDING AdVICE');
                console.log(res);
                this.pendingPaymentAdvice = res;
                this.pendingPaymentAdvice.forEach((item) => {
                    this.totalAmountDue += item.amountDue;
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
