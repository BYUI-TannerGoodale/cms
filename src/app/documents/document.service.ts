import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // Properties
  private documents: Document[] = [];
  maxDocumentId: number;

  // Constructor(s)
  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  // Emitters
  documentSelectedEvent = new EventEmitter<Document>();

  documentListChangedEvent = new Subject<Document[]>();

  // Methods

  // Create unique ID
  getMaxId(): number{
    let maxId = 0;
    for (let document of this.documents) {
      let currentId: number = +document.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Init list
  getDocuments(){
    return this.documents.slice();
  }

  // CRUD methods,
  // Create
  addDocument(newDoc: Document){
    // Check the input param to make sure it is valid, otherwise return.
    if(newDoc == null){
      return;
    }
    // Update the max ID
    this.maxDocumentId++;
    // Assign new max ID to new document
    newDoc.id = this.maxDocumentId.toString();
    // Push the new document onto the documents array
    this.documents.push(newDoc);
    // Create a clone of the documents array and emit it to subscribed objects
    let docListClone = this.documents.slice();
    this.documentListChangedEvent.next(docListClone);
  }

  // Read
  getDocument(id: string){
    for (const document of this.documents) {
      if (id === document.id) {
        return document;
      }
    }
    return null;
  }

  // Update
  updateDocument(originalDocument: Document, newDocument: Document){
    if(originalDocument == null || newDocument == null){
      return;
    }
    let position = this.documents.indexOf(originalDocument);
    if (position < 0){
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[position] = newDocument;
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  // Delete
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
