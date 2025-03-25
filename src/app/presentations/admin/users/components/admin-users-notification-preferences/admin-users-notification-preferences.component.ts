import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { NotificationPreferenceDTO } from 'src/app/core/dataservice/notifications/notification.dto';
import { NotificationService } from 'src/app/core/dataservice/notifications/notification.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-admin-users-notification-preferences',
    templateUrl: './admin-users-notification-preferences.component.html',
    styleUrls: ['./admin-users-notification-preferences.component.css'],
    standalone: true,
    imports: [CommonModule, TableModule, InputSwitchModule],
})
export class AdminUsersNotificationPreferencesComponent implements OnInit {
    user: UserDTO;
    userNotificationPreferences: NotificationPreferenceDTO[] = [];
    groupedNotificationPrefs: any[] = [];

    constructor(
        private notificationService: NotificationService,
        private config: DynamicDialogConfig
    ) {
        this.user = this.config.data;
    }

    ngOnInit() {
        console.log(this.user.id);
        this.notificationService
            .GetAllNotificationPreferencesByUser(this.user.id)
            .subscribe({
                next: (res) => {
                    this.userNotificationPreferences = res;
                    this.groupedNotificationPrefs = Object.values(
                        this.groupNotificationPreferences(res)
                    );
                    console.log(this.groupedNotificationPrefs);
                },
            });
    }

    groupNotificationPreferences(preferences: any[]) {
        return preferences.reduce((result, pref) => {
            const typeName = pref.notificationType.name;

            if (!result[typeName]) {
                result[typeName] = {
                    name: typeName,
                    description: pref.notificationType.description,
                    channels: [],
                };
            }

            // Check if channelId already exists before adding
            const exists = result[typeName].channels.some(
                (channel) => channel.channelId === pref.notificationChannel.id
            );

            if (!exists) {
                result[typeName].channels.push({
                    id: pref.id,
                    channelId: pref.notificationChannel.id,
                    channelName: pref.notificationChannel.name,
                    isSubscribed: pref.isSubscribed,
                });
            }

            return result;
        }, {});
    }

    updateSubscription(id: number, isSubscribed: boolean) {}
}
