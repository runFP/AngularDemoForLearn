import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {NameMapComponent, RegisterNMC} from '../../NameMapComponent';
import {of} from 'rxjs';
import {ReactDndDirective} from '../../../share/directives/react-dnd/react-dnd.directive';
import {MatDialog, MatDialogRef} from '@angular/material';
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
    {name: 'WillBeCreateComponent', options: '123', pos: '0,100', form: 'A指标'},
    {name: 'WillBeCreateComponent', options: '321', pos: '0,200', form: 'B指标'},
    {name: 'WillBeCreateComponent', options: '666', pos: '100,300', form: 'C指标'},
    {name: 'AComponentComponent', options: '666', pos: '100,300', form: 'C指标'},
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
    const v2dInf = [];
    for (let i = 0; i < this.insert.length; i++) {
      v2dInf.push(this.insert.get(i)['_view'].nodes[1].instance.getView2DataInf());
    }
    console.log(v2dInf);
  }

  data2view() {
    this.insert.clear();

    of(this.remoteData).subscribe(data => {
      this.dnd.activeDnd();
      data.forEach(d => {
        const cmp = this.nmc.getComponent(d.name);
        const cmpFactory = this.resolve.resolveComponentFactory(cmp);
        const cmpRef = this.insert.createComponent(cmpFactory);
        this.dnd.addElement(cmpRef.location.nativeElement);

        cmpRef.instance.options = d.options;
        cmpRef.instance.name = d.name;
        cmpRef.instance.form = d.form;
        const pos = d.pos.split(',');
        cmpRef.instance.transform = `translate3d(${pos[0]}px,${pos[1]}px,0)`;
        cmpRef.instance.cmpRef = cmpRef;
      });
      this.dnd.resetContainerHeight();
      this.dnd.destroyDnd();
    });
  }

  activeDnd(): void {
    if (this.actived) {
      return;
    }
    this.actived = true;
    for (let i = 0; i < this.insert.length; i++) {
      this.insert.get(i)['_view'].nodes[1].instance.addDelBtn(this.insert, this.dnd);
    }
    this.dnd.activeDnd();
  }

  addNewView(): void {
    const dialogRef = this.dialog.open(AddViewComponent);
    dialogRef.afterClosed().subscribe(result => {
      const cmp = this.nmc.getComponent(result.value);
      const cmpFactory = this.resolve.resolveComponentFactory(cmp);
      const cmpRef = this.insert.createComponent(cmpFactory);

      cmpRef.instance.options = result.value;
      cmpRef.instance.name = result.value;
      cmpRef.instance.form = result.label;
      cmpRef.instance.transform = this.dnd.addElement(cmpRef.location.nativeElement);
      cmpRef.instance.cmpRef = cmpRef;
      /**
       * 激活dnd模式要添加删除按钮
       */
      cmpRef.instance.addDelBtn(this.insert, this.dnd);
    });
  }

  destroyDnd(): void {
    this.actived = false;
    for (let i = 0; i < this.insert.length; i++) {
      const cmpRef = this.insert.get(i)['_view'].nodes[1];
      cmpRef.instance.removeDelBtn();
    }
    this.dnd.destroyDnd();
  }

}

@Component({
  selector: 'dialog',
  templateUrl: './addView.component.html',
})
export class AddViewComponent {
  value;
  result;

  options = [
    {label: '指标A', value: 'AComponentComponent'},
    {label: '指标B', value: 'BComponentComponent'},
    {label: '指标C', value: 'CComponentComponent'},
    {label: '指标D', value: 'AComponentComponent'},
  ];

  constructor(
    public dialogRef: MatDialogRef<AddViewComponent>,
  ) {

  }

  selectChange(change) {
    this.result = {
      label: change.source.triggerValue,
      value: change.value,
    };
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
