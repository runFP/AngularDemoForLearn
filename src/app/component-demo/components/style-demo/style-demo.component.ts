import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-style-demo',
  templateUrl: './style-demo.component.html',
  styleUrls: ['./style-demo.component.scss']
})
export class StyleDemoComponent implements OnInit {
  resetClasses: string = 'newClass';

  canSave: boolean = false;
  isUnchanged: boolean = true;
  isSpecial: boolean = true;

  currentClasses: {};
  currentStyles: {};

  setCurrentClasses() {
    this.currentClasses = {
      'saveable': this.canSave,
      'modified': !this.isUnchanged,
      'special': this.isSpecial
    };
  }

  setCurrentStyles() {
    this.currentStyles = {
      'font-style': this.canSave ? 'italic' : 'normal',
      'font-weight': !this.isUnchanged ? 'bold' : 'normal',
      'font-size': this.isSpecial ? '24px' : '12px'
    };
  }

  constructor() {
    this.setCurrentClasses();
    this.setCurrentStyles();
  }

  ngOnInit() {
  }

}
