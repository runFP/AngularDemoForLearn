import {Component} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {Column, ColumnApi, GridApi, GridReadyEvent, RowNode} from 'ag-grid';
import {FormCellComponent} from './form-cell/form-cell.component';
import {BranchService} from './branch.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  private api: GridApi;
  private columnApi: ColumnApi;

  gridForm: FormGroup = new FormGroup({
    salesperson: new FormControl(),
    telephone: new FormControl(),
    address: new FormControl(),
    stock: new FormGroup({})
  });

  branchNames: string[];
  selectedBranch: string;

  columnDefs: any[];
  rowData: any[];

  constructor(public snackBar: MatSnackBar,
              private branchService: BranchService) {

    this.columnDefs = [
      {headerName: 'Order #', field: 'orderNumber', width: 110, suppressSizeToFit: true},
      {headerName: 'Make', field: 'make', cellRenderer: 'formCell'},
      {headerName: 'Model', field: 'model', cellRenderer: 'formCell'},
      {headerName: 'Price', field: 'price', cellRenderer: 'formCell'}
    ];

    this.branchNames = this.branchService.branches;
    this.selectedBranch = this.branchNames[0];
    this.updateForm();
  }

  updateForm() {
    const currentBranch = this.branchService.getBranchData(this.selectedBranch);
    this.gridForm.controls['salesperson'].patchValue(currentBranch.salesperson);
    this.gridForm.controls['telephone'].patchValue(currentBranch.telephone);
    this.gridForm.controls['address'].patchValue(currentBranch.address);

    this.rowData = currentBranch.stock;
  }

  private refreshFormControls() {
    if (this.api) {
      // slight chicken and egg here - the grid cells will be created before the grid is ready, but
      // we need set formGroup up front
      // as such we'll create the grid (and cells) and force refresh the cells
      // FormCellComponent will then set the form in the refresh, completing the loop
      // this is only necessary once, on initialisation
      this.createFormControls();
      this.api.refreshCells({force: true});
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;

    this.refreshFormControls();

    this.api.sizeColumnsToFit();
  }

  private createFormControls() {
    const columns = this.columnApi.getAllColumns();

    const stockGroup = (<FormGroup>this.gridForm.controls['stock']);

    // clear out old form group controls if switching between branches
    const controlNames = Object.keys(stockGroup.controls);
    controlNames.forEach((controlName) => {
      stockGroup.removeControl(controlName);
    });

    this.api.forEachNode((rowNode: RowNode) => {
      const formArray: FormArray = new FormArray([]);
      columns.filter((column: Column) => column.getColDef().field !== 'orderNumber')
        .forEach((column: Column) => {
          const key = this.createKey(this.columnApi, column); // the cells will use this same createKey method
          formArray.setControl(<any>key, new FormControl(null, Validators.required));
        });
      stockGroup.addControl(<any>rowNode.id, formArray);
    });
  }

  getRowNodeId(data: any) {
    // optional here - ag-Grid will create row ids if you don't supply one, but
    // if you have a way of uniquely identifying rows here's where you'd do it.
    // doing so would make it easier to pull out specific rows from the form,
    // say by order number, as we do here
    return data.orderNumber;
  }

  getComponents() {
    return {'formCell': FormCellComponent};
  }

  getContext() {
    return {
      formGroup: this.gridForm.controls.stock,
      createKey: this.createKey
    };
  }

  onSubmit() {
    console.dir(this.gridForm.value);

    this.snackBar.open('Open Console for Form State', null, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  private createKey(columnApi: ColumnApi, column: Column): any {
    return columnApi.getAllColumns().indexOf(column) - 1;
  }

}
