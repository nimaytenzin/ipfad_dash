import { Component, OnInit } from '@angular/core';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-tenant-payment-receipt',
    templateUrl: './tenant-payment-receipt.component.html',
    styleUrls: ['./tenant-payment-receipt.component.scss'],
    standalone: true,
})
export class TenantPaymentReceiptComponent implements OnInit {
    paymentAdvice: PaymentAdviceDto;
    constructor(private paymentAdviceDataService: PaymentAdviceDataService) {
        this.paymentAdviceDataService.FindOne(1).subscribe((res) => {
            this.paymentAdvice = res;
        });
    }

    ngOnInit() {}
}
