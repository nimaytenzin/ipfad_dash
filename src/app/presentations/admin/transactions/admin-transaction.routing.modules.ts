import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterTransactionsComponent } from './admin-master-transactions/admin-master-transactions.component';

const routes: Routes = [
    {
        path: '',
        component: AdminMasterTransactionsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterTransactionRoutingModule {}
