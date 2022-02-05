import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Properties
  private contacts: Contact[] = [];
  
  // Constructor(s)
  constructor() { 
    this.contacts = MOCKCONTACTS;
  }

  // Emitters
  contactSelectedEvent = new EventEmitter<Contact>();

  // Methods
  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  getContact(id: string): Contact{
    for (const contact of this.contacts) {
      if (id === contact.id) {
        return contact;
      }
    }
    return null;
  }
}
