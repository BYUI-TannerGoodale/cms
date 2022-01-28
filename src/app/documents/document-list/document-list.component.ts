import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [new Document(1, 'Logs', 'Recent log data', '#', null),
                           new Document(2, 'Taxes', 'A list of taxes to be payed', '#', null),
                           new Document(3, 'Name', 'Pointless filler data', '#', null),
                           new Document(4, 'Test', 'This is test data', '#', null)];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }
}
