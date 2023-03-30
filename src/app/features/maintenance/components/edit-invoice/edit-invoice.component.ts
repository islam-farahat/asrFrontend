import { Invoice } from './../../models/invoice';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss'],
})
export class EditInvoiceComponent {
  toppings = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: Invoice,
    private _formBuilder: FormBuilder
  ) {
    console.log(invoice);
  }
}
