import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder, FormArray} from '@angular/forms';

@Component({
  selector: 'app-form-validator-demo',
  templateUrl: './form-validator-demo.component.html',
  styleUrls: ['./form-validator-demo.component.scss']
})
export class FormValidatorDemoComponent implements OnInit {
  formGroup: FormGroup;

  get arr() {
    return this.formGroup.get('0') as FormArray;
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
        name: [null, Validators.required],
        0: this.fb.array([this.fb.control('', Validators.required)]),
      }
    );
  }


  submit() {
    console.log(this.formGroup);
  }

  get() {
    console.log(this.formGroup.get('name'));
    console.log(this.formGroup);
  }
}
