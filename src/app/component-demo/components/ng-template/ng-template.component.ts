import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-ng-template',
  templateUrl: './ng-template.component.html',
  styleUrls: ['./ng-template.component.scss']
})
export class NgTemplateComponent implements OnInit {
  @ViewChild('templateRefAsElement') templateRefAsElement;
  @ViewChild('templateRefAsComponent') templateRefAsComponent;
  @ViewChild('templateRefAsDirective') templateRefAsDirective;


  myContext: object = {$implicit: 'World', localSk: 'Svet'};

  container: number = 1;
  show: boolean = true;

  inputVariable: string = 'I \'m a inputVariable';

  names: any[] = [{name: 'name1'}, {name: 'name2'}];
  names2: any[] = [{name: 'name3'}, {name: 'name4'}];

  constructor() {
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
