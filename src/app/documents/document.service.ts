import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // Properties
  private documents: Document[] = [];

  // Constructor(s)
  constructor() {
    this.documents = MOCKDOCUMENTS;
  }
  
  // Emitters
  documentSelectedEvent = new EventEmitter<Document>();

  // Methods
  getDocuments(){
    return this.documents.slice();
  }

  getDocument(id: string){
    for (const document of this.documents) {
      if (id === document.id) {
        return document;
      }
    }
    return null;
  }

}
