import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; // Add FormsModule for [(ngModel)]
import { CommonModule } from '@angular/common';
import { DamageItemDTO } from 'src/app/core/dataservice/damage-item/damage.item.dto';

@Component({
    selector: 'app-damage-item-chat-box',
    templateUrl: './damage-item-chat-box.component.html',
    styleUrls: ['./damage-item-chat-box.component.css'],
    standalone: true,
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ButtonModule,
        DividerModule,
        FormsModule,
        CommonModule,
    ],
})
export class DamageItemChatBoxComponent implements OnInit {
    @Input() damageItem!: DamageItemDTO;
    messages: { text: string; sender: string; timestamp: Date }[] = [];
    newMessage: string = '';

    recipientName = 'Kinley Wangyel';
    recipentPhoneNumber = '17263764';
    constructor() {}

    ngOnInit() {
        this.messages = [
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'Hi! How can I help you with the damage report?',
                sender: 'admin',
                timestamp: new Date(),
            },
            {
                text: 'I noticed a water leakage in the kitchen.',
                sender: 'user',
                timestamp: new Date(),
            },
            {
                text: 'Thanks for reporting, we will send a technician.',
                sender: 'admin',
                timestamp: new Date(),
            },
        ];
    }

    sendMessage() {
        if (this.newMessage.trim()) {
            // Add the user message with the current timestamp
            this.messages.push({
                text: this.newMessage,
                sender: 'admin',
                timestamp: new Date(),
            });

            this.newMessage = '';
        }
    }
}
