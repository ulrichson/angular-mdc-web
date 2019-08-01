import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {takeUntil, startWith} from 'rxjs/operators';

import {MDCComponent} from '@angular-mdc/web/base';
import {closest} from '@angular-mdc/web/dom';
import {MdcCheckbox} from '@angular-mdc/web/checkbox';

import {
  MDCDataTableHeaderCell,
  MDCDataTableRow,
} from './data-table.directives';

import {
  strings,
  MDCDataTableRowSelectionChangedEventDetail,
  MDCDataTableAdapter,
  MDCDataTableFoundation
} from '@material/data-table';

@Component({
  selector: 'mdc-data-table',
  exportAs: 'mdcDataTable',
  host: {'class': 'mdc-data-table'},
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MDCDataTable extends MDCComponent<MDCDataTableFoundation> implements AfterViewInit, OnDestroy {
  /** Emits whenever the component is destroyed. */
  private _destroyed = new Subject<void>();

  @ContentChildren(MDCDataTableRow, {descendants: true}) rows!: QueryList<MDCDataTableRow>;
  @ContentChildren(MDCDataTableHeaderCell, {descendants: true}) headerCells!: QueryList<MDCDataTableHeaderCell>;
  @ContentChildren(MdcCheckbox, {descendants: true}) checkboxRows!: QueryList<MdcCheckbox>;

  getDefaultFoundation() {
    const adapter: MDCDataTableAdapter = {
      addClassAtRowIndex: (rowIndex: number, className: string) =>
        this.getRows()[rowIndex].getNativeElement().classList.add(className),
      getRowCount: () => this.getRows().length,
      getRowElements: () => [].slice.call(this.elementRef.nativeElement.querySelectorAll(strings.ROW_SELECTOR)),
      getRowIdAtIndex: (rowIndex: number) =>
        this.getRows()[rowIndex].getNativeElement().getAttribute(strings.DATA_ROW_ID_ATTR),
      getRowIndexByChildElement: (el: Element) => this.getRows().indexOf((closest(el, strings.ROW_SELECTOR) as any)),
      getSelectedRowCount: () => this.elementRef.nativeElement.querySelectorAll(strings.ROW_SELECTED_SELECTOR).length,
      isCheckboxAtRowIndexChecked: (rowIndex: number) => this.checkboxRows.toArray()[rowIndex].checked,
      isHeaderRowCheckboxChecked: () => this.getHeaderCheckbox() ? this.getHeaderCheckbox()!.checked : false,
      isRowsSelectable: () => !!this.elementRef.nativeElement.querySelector(strings.ROW_CHECKBOX_SELECTOR),
      notifyRowSelectionChanged: (data: MDCDataTableRowSelectionChangedEventDetail) => {
      },
      notifySelectedAll: () => {},
      notifyUnselectedAll: () => {},
      registerHeaderRowCheckbox: () => {
      },
      registerRowCheckboxes: () => {
      },
      removeClassAtRowIndex: (rowIndex: number, className: string) =>
        this.getRows()[rowIndex].getNativeElement().classList.remove(className),
      setAttributeAtRowIndex: (rowIndex: number, attr: string, value: string) =>
        this.getRows()[rowIndex].getNativeElement().setAttribute(attr, value),
      setHeaderRowCheckboxChecked: (checked: boolean) => {
        const headerCheckbox = this.getHeaderCheckbox();
        if (headerCheckbox) {
          this.getHeaderCheckbox()!.checked = checked;
        }
      },
      setHeaderRowCheckboxIndeterminate: (indeterminate: boolean) => {
        const headerCheckbox = this.getHeaderCheckbox();
        if (headerCheckbox) {
          this.getHeaderCheckbox()!.indeterminate = indeterminate;
        }
      },
      setRowCheckboxCheckedAtIndex: (rowIndex: number, checked: boolean) =>
        this.checkboxRows.toArray()[rowIndex].checked = checked,
    };
    return new MDCDataTableFoundation(adapter);
  }

  constructor(
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    public elementRef: ElementRef) {

    super(elementRef);
  }

  ngAfterViewInit(): void {
    this._foundation.init();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();

    if (this._foundation) {
      this._foundation.destroy();
    }
  }

  /**
   * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
   */
  async layoutAsync(): Promise<void> {
    await this._foundation.layoutAsync();
  }

  /**
   * @return Returns array of selected row ids.
   */
  getSelectedRowIds(): Array<string | null> {
    return this._foundation.getSelectedRowIds();
  }

  getRows(): MDCDataTableRow[] {
    return this.rows ? this.rows.toArray() : [];
  }

  getHeaderCheckbox(): MdcCheckbox | undefined {
    const checkbox = this.headerCells ? this.headerCells.filter(_ => !!_.headerRowCheckbox) : undefined;
    return checkbox ? checkbox[0].headerRowCheckbox : undefined;
  }
}
