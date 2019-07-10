import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-demo',
  templateUrl: './form-demo.component.html',
  styleUrls: ['./form-demo.component.scss']
})
export class FormDemoComponent implements OnInit {

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    abc: ['', Validators.required],
  });

  anotherForm = this.fb.group(
    {
      abc: ['', Validators.required],
    }
  );

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }

  show() {
    console.log(this.profileForm);
  }

  showA() {
    console.log(this.anotherForm);
  }
}
