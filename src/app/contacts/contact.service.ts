import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Properties
  private contacts: Contact[] = [];
  maxContactId: number;

  // Constructor(s)
  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  // Emitters
  contactSelectedEvent = new EventEmitter<Contact>();

  contactListChangedSubject = new Subject<Contact[]>();

  // Methods
  // Set max ID for unique IDs.
  getMaxId(): number{
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId: number = +contact.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Init contact list
  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  // CRUD methods,
  // Create
  createContact(newContact: Contact){
    if(newContact == null){return;}
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.contactListChangedSubject.next(this.contacts.slice());
  }

  // Read
  getContact(id: string): Contact{
    for (const contact of this.contacts) {
      if (id === contact.id) {
        return contact;
      }
    }
    return null;
  }

  //Update
  updateContact(newContact: Contact, originalContact: Contact){
    // console.log(newContact);
    // console.log(originalContact);
    if (newContact == null || originalContact == null){return;}
    //console.log(this.contacts);
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0){
      console.log('error in handling indexOf(originalContact), index is less than 0. Please check contact service, line 70. Index: ' + pos);
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedSubject.next(this.contacts.slice());
  }

  // Delete
  deleteContact(contact: Contact){
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedSubject.next(this.contacts.slice());
  }
}
