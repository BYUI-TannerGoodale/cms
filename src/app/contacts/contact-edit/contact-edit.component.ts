import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Contact} from "../contact.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ContactService} from "../contact.service";
import {DragDropData} from "ng2-dnd";

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  groupContacts: Contact[] = [];
  contact: Contact;
  originalContact: Contact;
  editMode: boolean = false;
  id: string;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) { }

  isInvalidContact(newContact: Contact){
    if(!newContact){
      // @ts-ignore
      return;
    }
    if (this.contact && newContact.id === this.contact.id){
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }


  ngOnInit(): void {

    let params = this.route.params;
    params.subscribe((params: Params) => {
      let id = params['id'];
      if(id == null){
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(id);
      if(this.originalContact == null){
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if(this.contact.group){
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    })
  }

  onCancel() {
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }

  onSubmit(f: NgForm) {
    let signupForm = f;
    // Also hacky, forced instance to be made adn then populate it with input fields... Dang it...
    this.contact = new Contact(null, null, null, null, null, null)
    // Map the values to the document object.
    this.contact.name = signupForm.value.name;
    this.contact.email = signupForm.value.email;
    this.contact.phone = signupForm.value.phone;
    this.contact.imageUrl = signupForm.value.imageUrl;
    // console.log(signupForm.value.name);
    //console.log(this.contact);
    //console.log(this.editMode);
    if(this.editMode){
      this.contactService.updateContact(this.contact, this.originalContact);
    } else {
      this.contactService.createContact(this.contact);
    }
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
