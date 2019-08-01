import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {toBoolean} from '@angular-mdc/web/common';
import {MdcCheckbox} from '@angular-mdc/web/checkbox';

let uniqueIdCounter = 0;

@Directive({
  selector: 'mdc-data-table-table, [mdcDataTableTable]',
  exportAs: 'mdcDataTableTable',
  host: {'class': 'mdc-data-table__table'}
})
export class MDCDataTableTable {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

@Component({
  moduleId: module.id,
  selector: 'mdc-data-table-header, [mdcDataTableHeader]',
  exportAs: 'mdcDataTableHeader',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None
})
export class MDCDataTableHeader {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

@Directive({
  selector: 'mdc-data-table-header-row, [mdcDataTableHeaderRow]',
  exportAs: 'mdcDataTableHeaderRow',
  host: {'class': 'mdc-data-table__header-row'}
})
export class MDCDataTableHeaderRow {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

@Component({
  moduleId: module.id,
  selector: 'mdc-data-table-header-cell, [mdcDataTableHeaderCell]',
  exportAs: 'mdcDataTableHeaderCell',
  host: {
    'role': 'columnheader',
    'class': 'mdc-data-table__header-cell',
    '[class.mdc-data-table__header-cell--checkbox]': 'checkbox'
  },
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MDCDataTableHeaderCell {
  @Input()
  get checkbox(): boolean {
    return this._checkbox;
  }
  set checkbox(value: boolean) {
    this._checkbox = toBoolean(value);
  }
  private _checkbox: boolean = false;

  @ContentChild(MdcCheckbox, {static: false}) headerRowCheckbox?: MdcCheckbox;

  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

@Directive({
  selector: 'mdc-data-table-content, [mdcDataTableContent]',
  exportAs: 'mdcDataTableContent',
  host: {'class': 'mdc-data-table__content'}
})
export class MDCDataTableContent {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

@Component({
  moduleId: module.id,
  selector: 'mdc-data-table-row, [mdcDataTableRow]',
  exportAs: 'mdcDataTableRow',
  host: {
    '[id]': 'id',
    'class': 'mdc-data-table__row',
    '[class.mdc-data-table__row-checkbox]': 'checkbox',
    '[class.mdc-data-table__row--selected]': 'selected'
  },
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MDCDataTableRow {
  private _id = `mdc-data-table-row-${uniqueIdCounter++}`;

  /** The unique ID of the row. */
  get id(): string { return this._id; }

  @Input()
  get checkbox(): boolean {
    return this._checkbox;
  }
  set checkbox(value: boolean) {
    this._checkbox = toBoolean(value);
  }
  private _checkbox: boolean = false;

  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    this._selected = toBoolean(value);
  }
  private _selected: boolean = false;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}

@Component({
  moduleId: module.id,
  selector: 'mdc-data-table-cell, [mdcDataTableCell]',
  exportAs: 'mdcDataTableCell',
  host: {
    'class': 'mdc-data-table__cell',
    '[class.mdc-data-table__cell--checkbox]': 'checkbox',
    '[class.mdc-data-table__cell--numeric]': 'numeric'
  },
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MDCDataTableCell {
  @Input()
  get checkbox(): boolean {
    return this._checkbox;
  }
  set checkbox(value: boolean) {
    this._checkbox = toBoolean(value);
  }
  private _checkbox: boolean = false;

  @Input()
  get numeric(): boolean {
    return this._numeric;
  }
  set numeric(value: boolean) {
    this._numeric = toBoolean(value);
  }
  private _numeric: boolean = false;

  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
