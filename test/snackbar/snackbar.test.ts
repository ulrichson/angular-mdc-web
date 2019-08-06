import {
  inject,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import {
  NgModule,
  Component,
  Directive,
  ViewChild,
  ViewContainerRef,
  Inject,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MDC_SNACKBAR_DATA,
  MdcSnackbar,
  MdcSnackbarComponent,
  MdcSnackbarConfig,
  MdcSnackbarModule,
  MdcSnackbarDismissReason,
  MdcSnackbarRef
} from '@angular-mdc/web';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('MdcSnackbar', () => {
  let snackBar: MdcSnackbar;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  const simpleMessage = 'Burritos are here!';
  const simpleActionLabel = 'pickup';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MdcSnackbarModule, SnackBarTestModule],
    }).compileComponents();
  }));

  beforeEach(inject([MdcSnackbar, OverlayContainer],
    (sb: MdcSnackbar, oc: OverlayContainer) => {
      snackBar = sb;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should open a simple message with a button', () => {
    const config: MdcSnackbarConfig = { viewContainerRef: testViewContainerRef };
    const snackBarRef = snackBar.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();

    expect(snackBarRef.instance instanceof MdcSnackbarComponent)
      .toBe(true, 'Expected the snack bar content component to be MdcSnackbarComponent');
    expect(snackBarRef.instance.snackbarRef)
      .toBe(snackBarRef,
        'Expected the snack bar reference to be placed in the component instance');
  });

  it('should open a snackbar with non-array CSS classes to apply', () => {
    const config: MdcSnackbarConfig = {
      viewContainerRef: testViewContainerRef,
      dismiss: true,
      classes: 'snack-test', actionClasses: 'action-text', dismissClasses: 'dismiss-class'
    };
    const snackBarRef = snackBar.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();

    expect(snackBarRef.instance instanceof MdcSnackbarComponent)
      .toBe(true, 'Expected the snack bar content component to be MdcSnackbarComponent');
    expect(snackBarRef.instance.snackbarRef)
      .toBe(snackBarRef,
        'Expected the snack bar reference to be placed in the component instance');
  });

  it('should open a snackbar with an array of CSS classes to apply', () => {
    const config: MdcSnackbarConfig = {
      viewContainerRef: testViewContainerRef,
      dismiss: true,
      classes: ['snack-test', 'snack-test2'], actionClasses: ['action-text'], dismissClasses: ['dismiss-class']
    };
    const snackBarRef = snackBar.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();

    expect(snackBarRef.instance instanceof MdcSnackbarComponent)
      .toBe(true, 'Expected the snack bar content component to be MdcSnackbarComponent');
    expect(snackBarRef.instance.snackbarRef)
      .toBe(snackBarRef,
        'Expected the snack bar reference to be placed in the component instance');
  });

  it('should open a snackbar with 10000 timeoutMs', () => {
    const config: MdcSnackbarConfig = {
      viewContainerRef: testViewContainerRef,
      timeoutMs: 10000
    };
    snackBar.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();
  });

  it('should open a snackbar with dismiss icon and closeOnEscape set false', () => {
    const config: MdcSnackbarConfig = {
      viewContainerRef: testViewContainerRef,
      dismiss: true,
      closeOnEscape: false
    };
    snackBar.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();
  });

  it('should open a simple message with no button', () => {
    const config: MdcSnackbarConfig = { viewContainerRef: testViewContainerRef };
    const snackBarRef = snackBar.open(simpleMessage, '', config);

    viewContainerFixture.detectChanges();

    expect(snackBarRef.instance instanceof MdcSnackbarComponent)
      .toBe(true, 'Expected the snack bar content component to be MdcSnackbarComponent');
    expect(snackBarRef.instance.snackbarRef)
      .toBe(snackBarRef, 'Expected the snack bar reference to be placed in the component instance');
  });

  it('should dismiss the snack bar and remove itself from the view', fakeAsync(() => {
    const config: MdcSnackbarConfig = { viewContainerRef: testViewContainerRef };
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    const snackBarRef = snackBar.open(simpleMessage, undefined, config);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount)
      .toBeGreaterThan(0, 'Expected overlay container element to have at least one child');

    snackBarRef.afterDismiss().subscribe(undefined, undefined, dismissCompleteSpy);

    snackBarRef.dismiss();
    viewContainerFixture.detectChanges();  // Run through animations for dismissal
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    expect(overlayContainerElement.childElementCount)
      .toBe(0, 'Expected the overlay container element to have no child elements');
  }));

  it('should be able to get dismissed through the service', fakeAsync(() => {
    snackBar.open(simpleMessage);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    snackBar.dismiss();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should remove past snackbars when opening new snackbars', fakeAsync(() => {
    snackBar.open('First snackbar');
    viewContainerFixture.detectChanges();

    snackBar.open('Second snackbar');
    viewContainerFixture.detectChanges();
    flush();

    snackBar.open('Third snackbar');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe('Third snackbar');
  }));

  it('should remove snackbar if another is shown while its still animating open', fakeAsync(() => {
    snackBar.open('First snackbar');
    viewContainerFixture.detectChanges();

    snackBar.open('Second snackbar');
    viewContainerFixture.detectChanges();

    flush();
    expect(overlayContainerElement.textContent!.trim()).toBe('Second snackbar');
  }));

  it('should allow manually dismissing with an action', fakeAsync(() => {
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');
    const snackBarRef = snackBar.open('Some content');
    viewContainerFixture.detectChanges();

    snackBarRef.afterDismiss().subscribe(undefined, undefined, dismissCompleteSpy);

    snackBarRef.dismiss({ action: true });
    viewContainerFixture.detectChanges();
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    tick(500);
  }));

  it('should indicate in `afterClosed` whether it was dismissed by an action', fakeAsync(() => {
    const dismissSpy = jasmine.createSpy('dismiss spy');
    const snackBarRef = snackBar.open('Some content');
    viewContainerFixture.detectChanges();

    snackBarRef.afterDismiss().subscribe(dismissSpy);

    snackBarRef.dismiss({ action: true });
    viewContainerFixture.detectChanges();
    flush();

    expect(dismissSpy).toHaveBeenCalledWith(jasmine.objectContaining({ action: true }));
    tick(500);
  }));

  it('should clear the dismiss timeout when dismissed before timeout expiration', fakeAsync(() => {
    const config = new MdcSnackbarConfig();
    config.timeoutMs = 1000;
    snackBar.open('content', 'test', config);

    setTimeout(() => snackBar.dismiss(), 500);

    tick(600);
    viewContainerFixture.detectChanges();
    tick();

    expect(viewContainerFixture.isStable()).toBe(true);
  }));

  it('should dismiss the open snack bar on destroy', fakeAsync(() => {
    snackBar.open(simpleMessage);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    snackBar.ngOnDestroy();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(0);
  }));
});

describe('MdcSnackbar with parent MdcSnackbar', () => {
  let parentSnackBar: MdcSnackbar;
  let childSnackBar: MdcSnackbar;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesMdcSnackBar>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MdcSnackbarModule, SnackBarTestModule],
      declarations: [ComponentThatProvidesMdcSnackBar],
    }).compileComponents();
  }));

  beforeEach(inject([MdcSnackbar, OverlayContainer],
    (sb: MdcSnackbar, oc: OverlayContainer) => {
      parentSnackBar = sb;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();

      fixture = TestBed.createComponent(ComponentThatProvidesMdcSnackBar);
      childSnackBar = fixture.componentInstance.snackBar;
      fixture.detectChanges();
    }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should close snackBars opened by parent when opening from child', fakeAsync(() => {
    parentSnackBar.open('Pizza');
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent)
      .toContain('Pizza', 'Expected a snackBar to be opened');

    childSnackBar.open('Taco');
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent)
      .toContain('Taco', 'Expected parent snackbar msg to be dismissed by opening from child');
  }));

  it('should close snackBars opened by child when opening from parent', fakeAsync(() => {
    childSnackBar.open('Pizza');
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent)
      .toContain('Pizza', 'Expected a snackBar to be opened');

    parentSnackBar.open('Taco');
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent)
      .toContain('Taco', 'Expected child snackbar msg to be dismissed by opening from parent');
  }));

  it('should not dismiss parent snack bar if child is destroyed', fakeAsync(() => {
    parentSnackBar.open('Pizza');
    fixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    childSnackBar.ngOnDestroy();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);
  }));
});

@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container *ngIf="childComponentExists"></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer, {static: false}) childWithViewContainer: DirectiveWithViewContainer;

  childComponentExists: boolean = true;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'arbitrary-component-with-template-ref',
  template: `
    <ng-template let-data>
      Fries {{localValue}} {{data?.value}}
    </ng-template>
  `,
})
class ComponentWithTemplateRef {
  @ViewChild(TemplateRef, {static: false}) templateRef: TemplateRef<any>;
  localValue: string;
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Burritos are on the way.</p>' })
class BurritosNotification {
  constructor(
    public snackBarRef: MdcSnackbarRef<BurritosNotification>,
    @Inject(MDC_SNACKBAR_DATA) public data: any) { }
}

@Component({
  template: '',
  providers: [MdcSnackbar]
})
class ComponentThatProvidesMdcSnackBar {
  constructor(public snackBar: MdcSnackbar) { }
}

/**
 * Simple component to open snack bars from.
 * Create a real (non-test) NgModule as a workaround forRoot
 * https://github.com/angular/angular/issues/10760
 */
const TEST_DIRECTIVES = [ComponentWithChildViewContainer,
  BurritosNotification,
  DirectiveWithViewContainer,
  ComponentWithTemplateRef];
@NgModule({
  imports: [CommonModule, MdcSnackbarModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ComponentWithChildViewContainer, BurritosNotification],
})
class SnackBarTestModule { }
