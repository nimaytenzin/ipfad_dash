import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SystemSettingService } from 'src/app/core/dataservice/system.setting.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';

@Component({
    selector: 'app-admin-system-settings',
    templateUrl: './admin-system-settings.component.html',
    styleUrls: ['./admin-system-settings.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, InputSwitchModule],
})
export class AdminSystemSettingsComponent implements OnInit {
    penaltyComputationEnabled: boolean = false;

    constructor(
        private systemSettingService: SystemSettingService,
        private authService: AuthService
    ) {}

    ngOnInit() {}

    getPenaltyComputationStatus(): void {
        this.systemSettingService.GetPenaltyStatusByAdmin(
            this.authService.GetCurrentRole().adminId
        );
    }

    updatePenaltyComputation(enabled: boolean): void {}
}
