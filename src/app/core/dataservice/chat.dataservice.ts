import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/constants';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class ChatDataService {
    chatApiUrl = API_URL;

    constructor(private http: HttpClient, private socket: Socket) {}

    GetChatHistory(uuid: string) {
        return this.http.get(`${this.chatApiUrl}/damage-topic/chat/${uuid}`);
    }

    JoinRoom(uuid: string, userId: string): void {
        this.socket.emit('join_topic', { roomId: uuid, user: { id: userId } });
    }

    // Send a message to the chat room
    SendMessage(uuid: string, message: string): void {
        this.socket.emit('chat', {
            roomId: uuid,
            message: message,
            type: 'text',
        });
        this.socket.fromEvent('message_sent').subscribe((response) => {
            console.log('Message sent:', response);
        });
    }

    ListenForMessages(): Observable<any> {
        return this.socket.fromEvent('chat');
    }

    // Optionally leave the room or disconnect from the server
    LeaveRoom(): void {
        this.socket.disconnect();
    }
}
