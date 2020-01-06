import {Component, OnInit} from '@angular/core';
import {ICellEditorAngularComp} from 'ag-grid-angular';
import {IAfterGuiAttachedParams, ICellEditorParams} from 'ag-grid-community';
import {RichSelectCellEditorService} from './rich-select-cell-editor.service';

@Component({
  selector: 'app-rich-select-cell-editor',
  templateUrl: './rich-select-cell-editor.component.html',
  styleUrls: ['./rich-select-cell-editor.component.scss'],
  providers: [RichSelectCellEditorService],
})
export class RichSelectCellEditorComponent implements ICellEditorAngularComp, OnInit {

  selectedValue;
  listOfOption: any[] = [];
  params = null;

  constructor(private rs: RichSelectCellEditorService) {
  }

  ngOnInit() {
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  agInit(params): void {
    this.params = params;
    this.selectedValue = params.value;

    /** 自定义处理option */
    if (params.listOption) {
      this.listOfOption = params.listOption(params.api);
    } else {
      this.listOfOption = this.rs.getColumnsList(params.api, params.column).map(r => ({value: r, label: r}));
    }
  }

  focusIn(): void {
  }

  focusOut(): void {
  }

  getFrameworkComponentInstance(): any {
  }

  getValue(): any {
    return this.selectedValue;
  }

  isCancelAfterEnd(): boolean {
    return false;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  isPopup(): boolean {
    return false;
  }

}
