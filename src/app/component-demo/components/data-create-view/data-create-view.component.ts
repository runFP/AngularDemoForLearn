import {Component, ComponentFactoryResolver, Inject, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {NameMapComponent, RegisterNMC} from '../../NameMapComponent';
import {of} from 'rxjs';
import {ReactDndDirective} from '../../../share/directives/react-dnd/react-dnd.directive';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AComponentComponent} from './acomponent/acomponent.component';
import {BComponentComponent} from './bcomponent/bcomponent.component';
import {CComponentComponent} from './ccomponent/ccomponent.component';

@Component({
  selector: 'app-data-create-view',
  templateUrl: './data-create-view.component.html',
  styleUrls: ['./data-create-view.component.scss']
})
export class DataCreateViewComponent implements OnInit {
  @ViewChild('insert', {read: ViewContainerRef, static: true}) insert: ViewContainerRef;
  @ViewChild('dnd', {static: false}) dnd: ReactDndDirective;

  private nmc: NameMapComponent;
  actived = false;
  remoteData = [
    {name: 'WillBeCreateComponent', options: '123', pos: '0,100'},
    {name: 'WillBeCreateComponent', options: '321', pos: '0,200'},
    {name: 'WillBeCreateComponent', options: '666', pos: '100,300'},
  ];

  constructor(
    private resolve: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    this.nmc = RegisterNMC.getNmc('component-demo');
  }

  ngOnInit() {

  }

  view2data() {

  }

  data2view() {
    this.insert.clear();

    of(this.remoteData).subscribe(data => {
      data.forEach(d => {
        const component = this.nmc.getComponent(d.name);
        const componentFactory = this.resolve.resolveComponentFactory(component);
        const componentRef = this.insert.createComponent(componentFactory);
        componentRef.instance.options = d.options;
        componentRef.instance.name = d.name;
        const pos = d.pos.split(',');
        componentRef.instance.transform = `translate3d(${pos[0]}px,${pos[1]}px,0)`;
      });
    });
  }

  activeDnd(): void {
    if (this.actived) {
      return;
    }
    this.actived = true;
    this.dnd.activeDnd();
  }

  addNewView(): void {
    const dialogRef = this.dialog.open(AddViewComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      const component = this.nmc.getComponent(result);
      const componentFactory = this.resolve.resolveComponentFactory(component);
      const componentRef = this.insert.createComponent(componentFactory);
      componentRef.instance.options = result;
      componentRef.instance.name = result;
      const transform = this.dnd.addElement(componentRef.location.nativeElement);
      componentRef.instance.transform = transform;

    });
  }

  destroyDnd(): void {
    this.dnd.destroyDnd();
  }

}

@Component({
  selector: 'dialog',
  templateUrl: './addView.component.html',
})
export class AddViewComponent {
  value;

  options = [
    {label: '指标A', value: 'AComponentComponent'},
    {label: '指标B', value: 'BComponentComponent'},
    {label: '指标C', value: 'CComponentComponent'},
  ];

  constructor(
    public dialogRef: MatDialogRef<AddViewComponent>,
  ) {

  }

  onNoClick() {
    this.dialogRef.close();
  }
}
