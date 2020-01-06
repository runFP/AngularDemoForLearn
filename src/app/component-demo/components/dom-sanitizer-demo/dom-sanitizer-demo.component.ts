import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-dom-sanitizer-demo',
  templateUrl: './dom-sanitizer-demo.component.html',
  styleUrls: ['./dom-sanitizer-demo.component.scss']
})
export class DomSanitizerDemoComponent implements OnInit, AfterViewInit {
  @ViewChild(TemplateRef, {static: false}) insertTmp: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }


  console() {
    console.log('console actived');
  }

  ngAfterViewInit(): void {
    this.viewContainerRef.createEmbeddedView(this.insertTmp);
  }

}
