import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';

@Component({
    selector: 'app-admin-owner-create',
    templateUrl: './admin-owner-create.component.html',
    styleUrls: ['./admin-owner-create.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
})
export class AdminOwnerCreateComponent implements OnInit {
    createOwnerForm: FormGroup;
    ref: DynamicDialogComponent;
    constructor(
        private fb: FormBuilder,
        private ownerDataService: OwnerDataService
    ) {}

    ngOnInit() {
        this.createOwnerForm = this.fb.group({
            nameEnglish: [],
            nameDzongkha: [''],
            phoneNumber: [''],
            cid: [''],
            email: [''],
        });
    }

    createOwner() {
        console.log(this.createOwnerForm.value);
        this.ownerDataService
            .CreateOwner(this.createOwnerForm.value)
            .subscribe({
                next: (res) => {
                    console.log(res);
                },
            });
    }
}
