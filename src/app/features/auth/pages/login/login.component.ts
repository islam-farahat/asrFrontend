import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login = this.fb.group({
    email: [''],
    password: [''],
  });

  constructor(
    private fb: FormBuilder,

    private router: Router
  ) {}

  ngOnInit(): void {}
  submit() {
    // this.router.navigate(['/user/home']);
  }
}
