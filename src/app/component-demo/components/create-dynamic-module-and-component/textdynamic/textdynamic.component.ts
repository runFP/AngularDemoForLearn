import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-textdynamic',
  templateUrl: './textdynamic.component.html',
  styleUrls: ['./textdynamic.component.scss']
})
export class TextdynamicComponent implements OnInit {
  @ContentChild(TemplateRef, {static: false})
  template: TemplateRef<any>;

  @Input()
  items: any[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}
