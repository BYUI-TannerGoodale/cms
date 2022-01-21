import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [new Message(2, "Tests", "It is important to test code", "Maan"),
                         new Message(3, "Bad Tests", "A bad test is one that fails to consider the context", "WoDow"),
                         new Message(4, "What?", "What was I supposed to do again?", "Catfish")]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
