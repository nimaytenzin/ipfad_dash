import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PA_GENERATION_STATUS } from 'src/app/core/constants/enums';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import {
    AuthenticatedUserDTO,
    CurrentRoleDTO,
} from 'src/app/core/dataservice/users-and-auth/dto/auth.dto';
import { PaymentAdviseGenerationResultMessage } from 'src/app/core/dto/payments/payment-advice.dto';
import { ExtractMonthAndYear } from 'src/app/core/utility/date.helper';

@Component({
    selector: 'app-admin-building-generate-monthly-payment-advices',
    templateUrl:
        './admin-building-generate-monthly-payment-advices.component.html',
    styleUrls: [
        './admin-building-generate-monthly-payment-advices.component.css',
    ],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        ProgressSpinnerModule,
    ],
})
export class AdminBuildingGenerateMonthlyPaymentAdvicesComponent
    implements OnInit
{
    extractMonthYear = ExtractMonthAndYear;

    selectedDate: Date;
    isGenerating: boolean = false;
    results: PaymentAdviseGenerationResultMessage[] = [];
    paGenerationStatus = PA_GENERATION_STATUS;
    error: any;
    currentRole: CurrentRoleDTO;
    triggeredGeneration: boolean = false;

    constructor(
        private config: DynamicDialogConfig,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private ref: DynamicDialogRef,
        private authService: AuthService
    ) {
        this.selectedDate = this.config.data.selectedDate;
        this.currentRole = this.authService.GetCurrentRole();
    }

    ngOnInit() {}

    close() {
        this.ref.close({
            status: this.triggeredGeneration ? 200 : null,
        });
    }
    getParsedDate(): string {
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(
            this.selectedDate,
            'MMMM yyyy'
        );
        return formattedDate;
    }

    generatePaymentAdvice() {
        this.isGenerating = true;

        const monthYear = this.extractMonthYear(
            this.selectedDate.toDateString()
        );

        this.paymentAdviceDataService
            .GenerateMonthlyPaymentAdviceForActiveBuildingAndUnitLeaseByAdmin(
                this.currentRole.adminId,
                monthYear.month,
                monthYear.year
            )
            .subscribe({
                next: (res: any) => {
                    this.results = res;
                    this.isGenerating = false;
                    this.triggeredGeneration = true;
                },
                error: (err) => {
                    this.isGenerating = false;
                    this.triggeredGeneration = true;
                    this.error = err;
                },
            });
    }
}
