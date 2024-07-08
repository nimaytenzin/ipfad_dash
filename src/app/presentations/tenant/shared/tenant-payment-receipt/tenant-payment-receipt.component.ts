import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-tenant-payment-receipt',
    templateUrl: './tenant-payment-receipt.component.html',
    styleUrls: ['./tenant-payment-receipt.component.scss'],
    standalone: true,
    imports: [DividerModule],
})
export class TenantPaymentReceiptComponent implements OnInit {
    paymentAdvice: PaymentAdviceDto;
    zhidhayContactDetails = ZHIDHAYCONTACTDETAILS;
    constructor(private paymentAdviceDataService: PaymentAdviceDataService) {
        this.paymentAdviceDataService.FindOne(1).subscribe((res) => {
            this.paymentAdvice = res;
        });
    }

    ngOnInit() {}
}
