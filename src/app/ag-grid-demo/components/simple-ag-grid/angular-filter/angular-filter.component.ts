import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {AgFilterComponent} from 'ag-grid-angular';
import {IAfterGuiAttachedParams, IFilterParams, IDoesFilterPassParams, RowNode} from 'ag-grid-community';

@Component({
  selector: 'app-angular-filter',
  templateUrl: './angular-filter.component.html',
  styleUrls: ['./angular-filter.component.scss']
})
export class AngularFilterComponent implements AgFilterComponent, AfterViewInit {

  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;

  @ViewChild('filterInput', {read: ViewContainerRef, static: false}) filterInput;

  // 重新载入数据时，需要刷新状态
  refresh = false;
  text = '';
  filterItems: FilterItem[] = [];

  allChecked = true;
  indeterminate = false;
  _filterWords: (string | null)[] = [];

  set filterWords(val: string[]) {
    this._filterWords = val.length === 0 ? [null] : val;
  }

  get filterWords() {
    return this._filterWords;
  }

  constructor() {
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.filterInput.element.nativeElement.focus();
      this.filterInput.element.nativeElement.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
          this.params.filterChangedCallback();
          this.filterItems = this.getFilterItems();
        }
      });
    });
  }


  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
    this.filterItems = this.getFilterItems();
  }

  isFilterActive(): boolean {
    return this.text !== null && this.text !== undefined;
  }

  /**
   * 执行过滤操作，filterChangedCallback执行会调用此方法
   * @param params
   */
  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.refresh) return true;
    if (this.filterWords[0] === null) return false;
    const columnValue = (this.valueGetter(params.node) + '').toLowerCase();
    return this.filterWords.some(fw => columnValue.indexOf(fw) !== -1);
  }

  onChange(newValue) {
    this.filterItems = [];
    if (this.text !== newValue) {
      this.text = newValue;
      this.filterItems = this.getFilterItems();
    }
  }

  /**
   * 获取checkbox数据
   * @return {FilterItem[]}
   */
  getFilterItems(): FilterItem[] {
    const filterRowColumnValues: FilterItem[] = [];
    const rows: any[] = [];
    const unduplicatedTmp: string[] = [];
    let filterRowIndex = [];
    this.filterWords = this.text.toLowerCase().split(' ');

    /** 获取存在Row的Id */
    this.params.api.forEachNodeAfterFilter(r => {
      filterRowIndex.push((this.params.api.getValue(this.params.column, r) + '').toLowerCase());
    });
    filterRowIndex = this.unduplicated(filterRowIndex);

    let evalFn = null;
    if (this.params.colDef.valueFormatter) {
      const valueFormatter = this.params.colDef.valueFormatter;
      if (typeof valueFormatter === 'string') {
        evalFn = new Function(
          'params',
          'value',
          `return ${(valueFormatter as string).replace(
            'ctx',
            'params.context',
          )}`,
        );
      }
    }

    /** 遍历所有行，初始checkbox信息 */
    this.params.api.forEachNode(r => {
      const value = (this.params.api.getValue(this.params.column, r) + '');
      let label = void 0;
      if (unduplicatedTmp.indexOf(value) !== -1) {
        return;
      }
      unduplicatedTmp.push(value);
      if (evalFn) {
        label = evalFn(this.params, value);
      }
      rows.push({
        value,
        label,
        checked: (filterRowIndex.indexOf(value.toLowerCase()) !== -1),
      });
    });

    /** 过滤出根据条件存在的行 */
    rows.forEach(r => {
      if (this.filterWords.some(fw => r.value.toLowerCase().indexOf(fw) !== -1)) {
        filterRowColumnValues.push({label: r.label || r.value, value: r.value, checked: r.checked});
      }
    });

    return filterRowColumnValues;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    this.filterItems = this.filterItems.map(item => ({...item, checked: this.allChecked}));
    this.filterWords = this.flatFn();
    this.params.filterChangedCallback();
  }

  updateSingleChecked(): void {
    if (this.filterItems.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.filterItems.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.filterWords = this.flatFn();
    this.params.filterChangedCallback();
  }

  unduplicated(arr: any[]) {
    return [...new Set(arr)];
  }

  flatFn() {
    return this.filterItems.filter(r => r.checked).map(r => r.value.toLowerCase());
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    console.log('afterGuiAttached');
  }

  getFrameworkComponentInstance(): any {
    console.log('getFrameworkComponentInstance');
  }

  getModel(): any {
    console.log('getModel');
  }

  getModelAsString(model: any): string {
    console.log('getModelAsString');
    return '';
  }

  /**
   * 刷新filterState
   */
  refreshState(): void {
    this.refresh = true;
    this.allChecked = true;
    this.params.filterChangedCallback();
    this.filterItems = this.getFilterItems();
    this.refresh = false;
  }

  onNewRowsLoaded(): void {
    console.log('onNewRowsLoaded');
    setTimeout(() => this.refreshState());

  }

  setModel(model: any): void {
    console.log(model);
  }

}

interface FilterItem {
  label: string;
  value: string;
  checked?: boolean;
}
