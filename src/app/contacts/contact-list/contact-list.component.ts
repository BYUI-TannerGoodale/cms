import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from '../contact.model';
import {ContactService} from '../contact.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  // Properties
  contacts: Contact[] = [];
  subscription: Subscription;
  term: string;

  constructor(private contactService: ContactService) {
  }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();

    this.subscription = this.contactService.contactListChangedSubject.subscribe((contactList: Contact[]) => {
      this.contacts = contactList;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Methods


  search(value: string) {

    this.term = value;

  }
}
