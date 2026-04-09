import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatCreationResponse } from '../models/api-response';

export interface ChatRoom {
  room_id: number;
  listing_id?: number;
  buyer_id: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
  buyer?: {
    name: string;
  };
  seller?: {
    name: string;
  };
  messages?: ChatMessage[];
  listing?: {
    listing_id: number;
    title: string;
    image_urls?: string[];
  };
}

export interface ChatMessage {
  message_id: number;
  room_id: number;
  sender_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    name: string;
  };
}

export interface CreateChatRequest {
  listing_id: number;
  message: string;
}

export interface SendMessageResponse {
  message: string;
  data: ChatMessage;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/chats`;

  getChats(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(this.apiUrl);
  }

  getChat(roomId: number): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`${this.apiUrl}/${roomId}`);
  }

  createChat(chatData: CreateChatRequest): Observable<ChatCreationResponse> {
    return this.http.post<ChatCreationResponse>(this.apiUrl, chatData);
  }

  sendMessage(roomId: number, message: string): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${this.apiUrl}/${roomId}/messages`, { message });
  }
}
