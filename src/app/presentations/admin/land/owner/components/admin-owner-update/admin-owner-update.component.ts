import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';

@Component({
    selector: 'app-admin-owner-update',
    templateUrl: './admin-owner-update.component.html',
    styleUrls: ['./admin-owner-update.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
    ],
})
export class AdminOwnerUpdateComponent implements OnInit {
    updateOwnerForm: FormGroup;
    owner: OwnerDTO;
    constructor(
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private ownerDataService: OwnerDataService
    ) {}

    ngOnInit() {
        this.updateOwnerForm = this.fb.group({
            nameEnglish: [],
            nameDzongkha: [''],
            phoneNumber: [''],
            cid: [''],
            email: [''],
        });
        this.owner = this.config.data;
        this.updateOwnerForm.patchValue({ ...this.owner });
    }

    updateOwner() {
        console.log('UPDATE OWNER', this.owner.id, this.updateOwnerForm.value);
        this.ownerDataService
            .UpdateOwner({ ...this.updateOwnerForm.value }, this.owner.id)
            .subscribe({
                next: (res) => {
                    console.log(res, 'Owner updated');
                    this.ref.close({
                        status: 200,
                    });
                },
            });
    }
}
