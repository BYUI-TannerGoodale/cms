import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import {Document} from "../documents/document.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // Properties
  private messages: Message[] = [];
  maxMessageId: number;

  // Constructor(s)
  constructor(private http : HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  // Emitters
  messageChangedEvent = new EventEmitter<Message[]>();

  messageListChangedEvent = new Subject<Message[]>();

  // Methods
  getMessages(){
    let messageList
    return this.http.get('https://cmst-ac8c8-default-rtdb.firebaseio.com/messages.json').subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        messageList = this.messages.sort((a,b) => this.comparinator(a,b)).slice();
        this.messageListChangedEvent.next(messageList);
      }, error => {
        console.log(error);
      }
    )
    return messageList;
  }

  storeMessages() {
    let bufferMessageList = JSON.stringify(this.messages);
    let headers = new HttpHeaders({"Content-Type" : "application/json"});
    this.http.put("https://cmst-ac8c8-default-rtdb.firebaseio.com/messages.json", bufferMessageList, {headers}).subscribe(
      (res) => {
        let tempArr = this.messages.slice();
        this.messageListChangedEvent.next(tempArr);
      }, error => {
        console.log(error);
      }
    )
  }

  comparinator(a: Message, b: Message):number{
    if(a.id < b.id){
      return -1
    }
    if(a.id > b.id){
      return 1
    }
    return 0
  }

  getMaxId(){
    let maxId = 0;
    for (let message of this.messages) {
      let currentId: number = +message.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessage(id: string){
    for (const message of this.messages) {
      if (id === message.id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.storeMessages();
  }
}
