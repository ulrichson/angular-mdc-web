import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MDCDataTable} from './data-table';
import {
  MDCDataTableCell,
  MDCDataTableContent,
  MDCDataTableHeader,
  MDCDataTableHeaderCell,
  MDCDataTableHeaderRow,
  MDCDataTableRow,
  MDCDataTableTable
} from './data-table.directives';

const DATA_TABLE_DECLARATIONS = [
  MDCDataTable,
  MDCDataTableCell,
  MDCDataTableContent,
  MDCDataTableHeader,
  MDCDataTableHeaderCell,
  MDCDataTableHeaderRow,
  MDCDataTableRow,
  MDCDataTableTable
];

@NgModule({
  imports: [CommonModule],
  exports: DATA_TABLE_DECLARATIONS,
  declarations: DATA_TABLE_DECLARATIONS
})
export class MdcDataTableModule {}
