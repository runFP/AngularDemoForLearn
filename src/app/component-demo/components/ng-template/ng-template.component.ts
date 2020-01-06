import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-ng-template',
  templateUrl: './ng-template.component.html',
  styleUrls: ['./ng-template.component.scss']
})
export class NgTemplateComponent implements OnInit {
  @ViewChild('templateRefAsElement', {static: false}) templateRefAsElement;
  @ViewChild('templateRefAsComponent', {static: false}) templateRefAsComponent;
  @ViewChild('templateRefAsDirective', {static: false}) templateRefAsDirective;

  linkstr = '<strong style="color: red">321123123</strong>hahahahahah';

  myContext: object = {$implicit: 'World', localSk: 'Svet'};

  container: number = 1;
  show: boolean = true;

  inputVariable: string = 'I \'m a inputVariable';

  names: any[] = [{name: 'name1'}, {name: 'name2'}];
  names2: any[] = [{name: 'name3'}, {name: 'name4'}];

  constructor(
    public domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  update() {
  }

  showTemplateReferToElement() {
    console.log(this.templateRefAsElement);
  }

  showTemplateReferToComponent() {
    console.log(this.templateRefAsComponent);
  }

  showTemplateReferToDirective() {
    console.log(this.templateRefAsDirective);
  }

}
