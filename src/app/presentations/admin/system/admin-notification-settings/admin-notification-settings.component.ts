import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    NotificationChannelDTO,
    NotificationTypeDTO,
} from 'src/app/core/dataservice/notifications/notification.dto';
import { NotificationService } from 'src/app/core/dataservice/notifications/notification.service';

@Component({
    selector: 'app-admin-notification-settings',
    templateUrl: './admin-notification-settings.component.html',
    styleUrls: ['./admin-notification-settings.component.css'],
    standalone: true,
    imports: [CommonModule],
})
export class AdminNotificationSettingsComponent implements OnInit {
    notificationTypes: NotificationTypeDTO[] = [];
    notificationChannels: NotificationChannelDTO[] = [];
    constructor(private notificationDataService: NotificationService) {}

    ngOnInit() {
        this.notificationDataService.GetAllNotificationTypes().subscribe({
            next: (res) => {
                this.notificationTypes = res;
            },
        });
        this.notificationDataService.GetAllNotificationChannels().subscribe({
            next: (res) => {
                this.notificationChannels = res;
            },
        });
    }
}
