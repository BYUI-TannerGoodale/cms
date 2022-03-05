import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import {Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {resolve} from "@angular/compiler-cli";




@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // Properties
  private documents: Document[] = [];
  maxDocumentId: number;

  // Constructor(s)
  constructor(private http : HttpClient) {
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
  // getDocuments() {
  //   return this.http.get('https://cmst-ac8c8-default-rtdb.firebaseio.com/documents',
  //     {
  //       responseType: 'json'
  //     }).subscribe(res => {
  //     (documents: Document[]) => {
  //       this.documents = documents;
  //       this.maxDocumentId = this.getMaxId();
  //       let documentList = this.documents.sort().slice();
  //       this.documentListChangedEvent.next(documentList);
  //     }
  //   }, error => {
  //       console.log(error);
  //   })
  // }
  documentCompare(documentA: Document, documentB: Document):number{
    if(documentA.name < documentB.name){
      return -1
    }
    if(documentA.name > documentB.name){
      return 1
    }
    return 0
  }

  getDocuments() {
    let documentList
    return this.http.get('https://cmst-ac8c8-default-rtdb.firebaseio.com/documents.json').subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        documentList = this.documents.sort((a,b) => this.documentCompare(a,b)).slice();
        this.documentListChangedEvent.next(documentList);
      }, error => {
        console.log(error);
      }
    )
    return documentList;
  }

  storeDocuments() {
    let bufferContactList = JSON.stringify(this.documents);
    let headers = new HttpHeaders({"Content-Type" : "application/json"});
    this.http.put("https://cmst-ac8c8-default-rtdb.firebaseio.com/documents.json", bufferContactList, {headers}).subscribe(
      (res) => {
        let tempDocArr = this.documents.slice();
        let respo = res.toString();
        console.log(respo);
        this.documentListChangedEvent.next(tempDocArr);
      }, error => {
        console.log(error);
      }
    )
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
    // let docListClone = this.documents.slice();
    this.storeDocuments();
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
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
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
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }
}
