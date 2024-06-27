import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sample-lease',
    standalone: true,
    templateUrl: './sample-lease.component.html',
    styleUrls: ['./sample-lease.component.css'],
})
export class SampleLeaseComponent {
    agreementDay = '15';
    agreementMonth = 'April';
    agreementYear = '2024';
    tenantName = 'John Doe';
    tenantCid = '123456789';
    tenantVillage = 'Thimphu';
    tenantGewog = 'Thimphu';
    tenantDzongkhag = 'Thimphu';
    tenantPresentAddress = '123 Main St, Thimphu';
    ownerName = 'Jane Smith';
    ownerCid = '987654321';
    ownerVillage = 'Paro';
    ownerGewog = 'Paro';
    ownerDzongkhag = 'Paro';
    ownerAddress = '456 High St, Paro';
    buildingNo = '1';
    plotNo = '2';
    unitName = '1-01';
    unitId = '23';
    buildingNumber = '319';
    plotNumber = 'TA1-231';
    leasePeriod = '12 Months';
    leaseStartDate = 'April 15, 2024';
    leaseEndDate = 'April 15, 2025';
    rent = '10,000';
    leasePurpose = 'Residential';
    paymentDueDay = '5';
    securityDepositAmount = '20,000';
    agreementSigningLocation = 'Thimphu';
    ownerPhoneNumber = '+975 12345678';
    tenantPhoneNumber = '+975 87654321';
    witnessName = 'John Witness';
    witnessCid = '1122334455';
    witnessAddress = '789 Witness St, Thimphu';
    witnessPhoneNumber = '+975 55555555'; // Exa
}
