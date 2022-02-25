import {Component, OnInit, ViewChild} from '@angular/core';
import {Document} from "../document.model";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DocumentService} from "../document.service";

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('f') signupForm: NgForm;
  editMode: boolean = false; // false by default, made true if document is selected and loaded
  document: Document; // The edited or new document object to be populated through the form
  originalDocument: Document; // The OG document if one is loaded into the form

  constructor(private route: ActivatedRoute,
              private router: Router,
              private docService: DocumentService) { }

  ngOnInit(): void {
    let params = this.route.params;
    //console.log(params);
    params.subscribe(
      (params: Params) => {
        let id = params['id'];
        if(id == null){
          this.editMode = false;
          return;
        }
        this.originalDocument = this.docService.getDocument(id);
        //console.log(this.originalDocument);
        if(this.originalDocument == null){
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
        //console.log(this.document);
      }
    )
  }

  onCancel() {
    this.router.navigate(['/documents'], {relativeTo: this.route});
  }

  onSubmit(f: NgForm) {
    //console.log(f); Had issues using after importing DnD for some reason (broken code down the pipeline?) Don't use --force next time...
    // Map the values to the document object. A bit hacky, but the only way to get this to work at the moment.
    // Had to use ViewChild to get form element...
    this.document = new Document('temp', this.signupForm.value.name, this.signupForm.value.description,this.signupForm.value.url,
      null);
    if(this.editMode){
      this.docService.updateDocument(this.originalDocument, this.document);
    } else {
      this.docService.addDocument(this.document);
    }
    this.router.navigate(['/documents'], {relativeTo: this.route});
  }
}
