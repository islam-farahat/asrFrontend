import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
})
export class AddAgentComponent {
  agentForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}
  addAgent() {
    console.log(this.agentForm.value);
  }
}
