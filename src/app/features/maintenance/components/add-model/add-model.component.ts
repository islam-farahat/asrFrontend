import { Model } from './../../models/model';
import { ModelService } from './../../services/model.service';
import { AddNewModelComponent } from './../add-new-model/add-new-model.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProductModel } from '../../models/product-model';
@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
})
export class AddModelComponent implements OnInit {
  modelForm = this.fb.group({
    model: ['', Validators.required],
    description: ['', Validators.required],
    attachment: [''],
  });

  @ViewChild('attachmentInput') attachmentInput!: ElementRef<HTMLInputElement>;

  filteredModels!: Observable<string[]>;
  filteredAttachments!: Observable<string[]>;
  models!: string[];
  attachments: string[] = [];

  separatorKeysCodes: number[] = [ENTER];
  allAttachments: string[] = ['ماوس', 'كيبورد', 'شاشة', 'سماعات', 'كارت شاشة'];

  ngOnInit() {
    this.model.getModelsNames().subscribe((data: Model[]) => {
      this.models = data.map((model) => model.name_ar);
      this.filteredModels = this.modelForm.controls['model'].valueChanges.pipe(
        startWith(''),
        map((value) => this.filterModels(value || ''))
      );
    });

    this.filteredAttachments = this.modelForm.controls[
      'attachment'
    ].valueChanges.pipe(
      startWith(null),
      map((attachment: string | null) =>
        attachment
          ? this.filterAttachment(attachment)
          : this.allAttachments.slice()
      )
    );
  }
  constructor(
    private dialog: MatDialog,
    private model: ModelService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddModelComponent>
  ) {}

  addAttachment(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.attachments.push(value);
    }
    event.chipInput!.clear();
    this.modelForm.controls['attachment'].setValue(null);
  }

  removeAttachment(attachment: string): void {
    const index = this.attachments.indexOf(attachment);

    if (index >= 0) {
      this.attachments.splice(index, 1);
    }
  }

  selectedAttachment(event: MatAutocompleteSelectedEvent): void {
    this.attachments.push(event.option.viewValue);
    this.attachmentInput.nativeElement.value = '';
    this.modelForm.controls['attachment'].setValue(null);
  }

  filterModels(value: string): string[] {
    return this.models.filter((model) => model.includes(value));
  }
  filterAttachment(value: string): string[] {
    return this.allAttachments.filter((attachment) =>
      attachment.includes(value)
    );
  }

  addNewModel() {
    this.dialog.open(AddNewModelComponent, {
      width: '500px',
      height: '200px',
      disableClose: true,
    });
  }
  saveModel() {
    const model = this.modelForm.value;
    const modelData: ProductModel = {
      model: model.model!,
      description: model.description!,
      attachment: String(this.attachments),
    };
    this.dialogRef.close({
      modelData,
    });
  }
}
