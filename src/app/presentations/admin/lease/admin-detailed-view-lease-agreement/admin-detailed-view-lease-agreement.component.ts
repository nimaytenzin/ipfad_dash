import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    DynamicDialogRef,
    DynamicDialogConfig,
    DialogService,
} from 'primeng/dynamicdialog';
import {
    LEASESTATUS,
    LEASETYPE,
    LESSEETYPE,
    LESSORTYPE,
    NOTIFICATIONTYPES,
} from 'src/app/core/constants/enums';
import { DamageItemService } from 'src/app/core/dataservice/damage-item/damage-item.dataservice';
import { DamageItemDTO } from 'src/app/core/dataservice/damage-item/damage.item.dto';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { NotificationService } from 'src/app/core/dataservice/notification/notification.service';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';
import {
    AuthenticatedUserDTO,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';
import { GETMONTHNAME, GETMONTHDIFF } from 'src/app/core/utility/date.helper';
import { GETUNITCONFIGSTRING } from 'src/app/core/utility/helper.function';
import { ToWords } from 'to-words';
import { AdminLeaseCreateEntryDamageItemModalComponent } from '../components/admin-lease-create-entry-damage-item-modal/admin-lease-create-entry-damage-item-modal.component';
import { AdminLeaseResolveDamageItemModalComponent } from '../components/admin-lease-resolve-damage-item-modal/admin-lease-resolve-damage-item-modal.component';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { ActivatedRoute } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { image } from 'html2canvas/dist/types/css/types/image';
import { DamageItemChatBoxComponent } from '../components/damage-item-chat-box/damage-item-chat-box.component';
import { AdminTabPreferenceService } from 'src/app/core/preferences/admin.tab.selection.preferences';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-admin-detailed-view-lease-agreement',
    templateUrl: './admin-detailed-view-lease-agreement.component.html',
    styleUrls: ['./admin-detailed-view-lease-agreement.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        DividerModule,
        CommonModule,
        TabViewModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextareaModule,
        FormsModule,
        GalleriaModule,
        DamageItemChatBoxComponent,
        CalendarModule,
        ImageModule,
    ],
    providers: [ConfirmationService, DialogService],
})
export class AdminDetailedViewLeaseAgreementComponent implements OnInit {
    ref: DynamicDialogRef | undefined;

    leaseTypeEnums = LEASETYPE;
    lesseeTypeEnums = LESSEETYPE;

    lessorTypes = LESSORTYPE;
    leaseAgreement: LeaseAgreeementDTO;
    leaseAgreementId: number;
    leaseCharges: LeaseSurchargeDTO[] = [];
    totalMonthlyPayable = 0;

    showTerminateLeaseModal: boolean = false;
    terminationDate = new Date();
    leaseTerminationRemarks: string;

    showRenewLeaseModal: boolean = false;
    newLeaseEndDate = new Date();

    getUnitConfigString = GETUNITCONFIGSTRING;
    getMonthName = GETMONTHNAME;
    calculateMonthsDifference = GETMONTHDIFF;
    tenantSignatureUri: string;
    admin: AuthenticatedUserDTO;

    entryDamageReportItems: DamageItemDTO[] = [];
    maintenanceRequestItems: DamageItemDTO[] = [];

    activeIndex: number;

    selectedDamageItem: DamageItemDTO | null = null;
    leaseTerminated: boolean = false;

    constructor(
        private pdfGeneratorDataService: PDFGeneratorDataService,
        private messageService: MessageService,
        private authService: AuthService,
        private leaseAgreemenetDataService: LeaseAgreementDataService,
        private notificationService: NotificationService,
        private dialogService: DialogService,
        private damageItemService: DamageItemService,
        private route: ActivatedRoute,
        private adminTabSelectionPreferenceService: AdminTabPreferenceService,
        private confirmationService: ConfirmationService
    ) {
        this.admin = this.authService.GetAuthenticatedUser();

        this.leaseAgreementId = Number(
            this.route.snapshot.paramMap.get('leaseAgreementId')
        );
        this.adminTabSelectionPreferenceService.adminViewLeaseDetailedSelectedTabIndex$.subscribe(
            (tabIndex) => {
                this.activeIndex = tabIndex;
            }
        );
    }

    ngOnInit() {
        this.leaseAgreemenetDataService
            .GetLeaseAgreementDetailed(this.leaseAgreementId)
            .subscribe({
                next: (res) => {
                    this.leaseAgreement = res;
                    this.leaseCharges = this.leaseAgreement.leaseSurcharges;
                    this.newLeaseEndDate = new Date(
                        this.leaseAgreement.leaseEndDate
                    );

                    this.totalMonthlyPayable = Number(this.leaseAgreement.rent);
                    this.leaseCharges.forEach((item) => {
                        this.totalMonthlyPayable += item.amount;
                    });
                    if (
                        this.leaseAgreement.status ===
                            LEASESTATUS.TERMINATED_BY_OWNER ||
                        LEASESTATUS.TERMINATED_BY_TENANT ||
                        LEASESTATUS.SUSPENDED ||
                        LEASESTATUS.CANCELLED
                    ) {
                        this.leaseTerminated = true;
                    }
                },
            });
        this.getEntryDamageItems();
        this.getMaintenanceRequestItems();
    }

    getEntryDamageItems() {
        this.damageItemService
            .GetEntryDamageItemsBylease(this.leaseAgreementId)
            .subscribe({
                next: (res) => {
                    this.entryDamageReportItems = res;

                    this.entryDamageReportItems.forEach((item) => {
                        item.images = this.parseEntryDamageItemImages(item);
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    loadChat(item: DamageItemDTO) {
        this.selectedDamageItem = item;
    }

    parseEntryDamageItemImages(item: DamageItemDTO) {
        let images = [];

        // Loop through damageItemImages and construct the objects
        for (let image of item.damageItemImages) {
            let obj = {
                itemImageSrc: 'http://localhost:3002/' + image.uri, // Adjust URL as necessary
            };
            images.push(obj);
        }

        // Return the array of image objects
        return images;
    }
    getMaintenanceRequestItems() {
        this.damageItemService
            .GetMaintenanceItemsBylease(this.leaseAgreementId)
            .subscribe({
                next: (res) => {
                    this.maintenanceRequestItems = res;
                    this.maintenanceRequestItems.forEach((item) => {
                        item.images = this.parseEntryDamageItemImages(item);
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    formatDateString(d: string) {
        return new Date(d);
    }

    getWords(number: number) {
        const toWords = new ToWords({
            localeCode: 'en-IN',
            converterOptions: {
                currency: true,
                ignoreDecimal: false,
                ignoreZeroCurrency: false,
                doNotAddOnly: false,
                currencyOptions: {
                    name: 'Ngultrum',
                    plural: 'Ngultrum',
                    symbol: 'Nu.',
                    fractionalUnit: {
                        name: 'Chetrum',
                        plural: 'Chetrums',
                        symbol: '',
                    },
                },
            },
        });

        return toWords.convert(number);
    }

    notifyEntryDamageReportSubmission() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Notify Tenant?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.notificationService
                    .SendNotification({
                        fromUserId: this.authService.GetAuthenticatedUser().id,
                        toUserId: this.leaseAgreement.tenantId,
                        notificationType:
                            NOTIFICATIONTYPES.ENTRYDAMAGEREPORT_SUBMISSION_REMINDER,
                        leaseAgreementId: this.leaseAgreement.id,
                    })
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Success',
                                detail: 'Notification Reminder Sent',
                            });
                        },
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }
    notifyLeaseSigning() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Notify Tenant?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.notificationService
                    .SendNotification({
                        fromUserId: this.authService.GetAuthenticatedUser().id,
                        toUserId: this.leaseAgreement.tenantId,
                        notificationType:
                            NOTIFICATIONTYPES.LEASE_SIGNING_REMINDER,
                        leaseAgreementId: this.leaseAgreement.id,
                    })
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Success',
                                detail: 'Notification Reminder Sent',
                            });
                        },
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }
    notifySecurityDepositPayment() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Notify Tenant?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.notificationService
                    .SendNotification({
                        fromUserId: this.authService.GetAuthenticatedUser().id,
                        toUserId: this.leaseAgreement.tenantId,
                        notificationType:
                            NOTIFICATIONTYPES.SECUTIRYDEPOSIT_PAYMENT_REMINDER,
                        leaseAgreementId: this.leaseAgreement.id,
                    })
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Success',
                                detail: 'Notification Reminder Sent',
                            });
                        },
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    openConfirmLeaseTerminationModal() {
        this.showTerminateLeaseModal = true;
    }
    confirmLeaseTermination() {
        this.messageService.add({
            severity: 'info',
            summary: 'Terminating Lease',
            detail: 'terminating lease...',
            life: 3000,
        });
        this.leaseAgreemenetDataService
            .OwnerTerminateLeaseAgreement({
                terminationRemarks: this.leaseTerminationRemarks,
                terminationDate: this.terminationDate.toDateString(),
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
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sending Notification',
                        detail: 'Sending Lease Termination Notification....',
                        life: 3000,
                    });

                    this.notificationService
                        .SendNotification({
                            fromUserId:
                                this.authService.GetAuthenticatedUser().id,
                            toUserId: this.leaseAgreement.tenantId,
                            notificationType:
                                NOTIFICATIONTYPES.LEASE_TERMINATION,
                            leaseAgreementId: this.leaseAgreement.id,
                        })
                        .subscribe({
                            next: (res) => {
                                if (res) {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Sent',
                                        detail: 'Lease Termination Notification Sent.',
                                        life: 3000,
                                    });
                                }
                            },
                            error: (err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: err.error.message,
                                    life: 3000,
                                });
                            },
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

        this.showTerminateLeaseModal = false;
    }
    openRenewLeaseModal() {
        this.showRenewLeaseModal = true;
    }
    confirmLeaseRenewal() {
        const leaseDuationMonths = this.calculateMonthsDifference(
            new Date(this.leaseAgreement.leaseStartDate),
            this.newLeaseEndDate
        );
        this.messageService.add({
            severity: 'info',
            summary: 'Renewing',
            detail: 'Renweing lease...',
            life: 3000,
        });

        this.leaseAgreemenetDataService
            .RenewLeaseAgreementWithSameTerms(
                this.leaseAgreement.id,
                this.formatDate(this.newLeaseEndDate),
                leaseDuationMonths.toString()
            )
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Lease Renewed',
                        detail: 'Lease has been Renewed',
                        life: 3000,
                    });
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sending Notification',
                        detail: 'Sending Lease Renewal Notification....',
                        life: 3000,
                    });

                    this.notificationService
                        .SendNotification({
                            fromUserId:
                                this.authService.GetAuthenticatedUser().id,
                            toUserId: this.leaseAgreement.tenantId,
                            notificationType: NOTIFICATIONTYPES.LEASE_RENEWAL,
                            leaseAgreementId: this.leaseAgreement.id,
                        })
                        .subscribe({
                            next: (res) => {
                                if (res) {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Sent',
                                        detail: 'Lease Renewal Sent.',
                                        life: 3000,
                                    });
                                }
                            },
                            error: (err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: err.error.message,
                                    life: 3000,
                                });
                            },
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
        this.showRenewLeaseModal = false;
    }

    formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    };

    downloadLeasePdf() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.pdfGeneratorDataService
            .DownloadLeaseAgreementPdf(this.leaseAgreement.id)
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lease-agreement.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Lease has been downloaded.Please check your downloads.',
                    life: 3000,
                });
            });
    }

    openCreateEntryDamageItem() {
        this.ref = this.dialogService.open(
            AdminLeaseCreateEntryDamageItemModalComponent,
            {
                header: 'Entry Damage report',
                data: { ...this.leaseAgreement },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                console.log('GETTING OK');
                this.getEntryDamageItems();
            }
        });
    }

    openResolveDamageItemModal(item: DamageItemDTO) {
        this.ref = this.dialogService.open(
            AdminLeaseResolveDamageItemModalComponent,
            {
                header: 'Resolve Damage Item',
                data: {
                    ...item,
                },
            }
        );
        this.ref.onClose.subscribe((res) => {
            console.log('CLOSE', res);
            if (res && res.status === 200) {
                this.notificationService.SendNotification({
                    fromUserId: this.authService.GetAuthenticatedUser().id,
                    toUserId: this.leaseAgreement.tenantId,
                    damageItemId: item.id,
                    notificationType: NOTIFICATIONTYPES.DAMAGEITEM_RESOLUTION,
                });
                this.getMaintenanceRequestItems();
            }
        });
    }

    handleTabChange(event: TabViewChangeEvent) {
        this.adminTabSelectionPreferenceService.updateAdminDetailedLeaseSelectedTab(
            event.index
        );
    }
}
