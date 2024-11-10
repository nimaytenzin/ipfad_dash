import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterTransactionsComponent } from './admin-master-transactions/admin-master-transactions.component';
import { AdminSearchPaymentAdviceComponent } from './admin-search-payment-advice/admin-search-payment-advice.component';

const routes: Routes = [
    {
        path: '',
        component: AdminMasterTransactionsComponent,
    },
    {
        path: 'search',
        component: AdminSearchPaymentAdviceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterTransactionRoutingModule {}
