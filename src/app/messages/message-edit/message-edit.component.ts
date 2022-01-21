import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText', {static: true}) msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: string = 'Tanner'

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage(){
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;
    let newMessage = new Message(1, subject, msgText, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }
  onClear(){
    this.msgText.nativeElement.value = '';
    this.subject.nativeElement.value = '';
  }
}
