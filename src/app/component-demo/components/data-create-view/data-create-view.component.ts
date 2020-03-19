import {Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {NameMapComponent, RegisterNMC} from '../../NameMapComponent';
import {of} from 'rxjs';

@Component({
  selector: 'app-data-create-view',
  templateUrl: './data-create-view.component.html',
  styleUrls: ['./data-create-view.component.scss']
})
export class DataCreateViewComponent implements OnInit {
  @ViewChild('insert', {read: ViewContainerRef, static: true}) insert: ViewContainerRef;

  nmc: NameMapComponent;
  remoteData = [
    {name: 'WillBeCreateComponent', options: '123', pos: '100,100'},
  ];

  constructor(
    private resolve: ComponentFactoryResolver,
  ) {
    this.nmc = RegisterNMC.getNmc('component-demo');

  }

  ngOnInit() {
    of(this.remoteData).subscribe(data => {
      data.forEach(d => {
        const component = this.nmc.getComponent(d.name);
        const componentFactory = this.resolve.resolveComponentFactory(component);
        const componentRef = this.insert.createComponent(componentFactory);
        componentRef.instance.options = d.options;
        componentRef.instance.left = 200;
        console.log(componentRef.hostView);
        console.log(componentRef.instance);
      });
      console.log('data:', data);
    });
  }

}
