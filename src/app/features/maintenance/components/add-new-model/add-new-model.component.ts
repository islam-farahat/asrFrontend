import { ModelService } from './../../services/model.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-new-model',
  templateUrl: './add-new-model.component.html',
  styleUrls: ['./add-new-model.component.scss'],
})
export class AddNewModelComponent {
  modelName = this.fb.group({
    name_ar: ['', Validators.required],
  });
  constructor(private fb: FormBuilder, private model: ModelService) {}
  saveName() {
    this.model
      .addModelName({
        name_en: this.modelName.value.name_ar!,
        name_ar: this.modelName.value.name_ar!,
        company_id: 1,
      })
      .subscribe((data) => console.log(data));
  }
}
