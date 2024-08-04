import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { ViewPaymentAdviceComponent } from 'src/app/presentations/shared-components/view-payment-advice/view-payment-advice.component';

@Component({
    selector: 'app-admin-building-unit-payment-details',
    templateUrl: './admin-building-unit-payment-details.component.html',
    styleUrls: ['./admin-building-unit-payment-details.component.css'],
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        TabViewModule,
        CommonModule,
        ViewPaymentAdviceComponent,
        DividerModule,
    ],
})
export class AdminBuildingUnitPaymentDetailsComponent implements OnInit {
    companyDetails = ZHIDHAYCONTACTDETAILS;
    paymentAdvice: PaymentAdviceDto;
    constructor(private paymentAdviceDataService: PaymentAdviceDataService) {}

    ngOnInit() {
        this.paymentAdviceDataService
            .GetPaidPaymentsByTenant(1)
            .subscribe((res) => {
                console.log('PENDING PA BY UNIT PAYMENT');
                console.log(res);
                this.paymentAdvice = res[0];
            });
    }
}
