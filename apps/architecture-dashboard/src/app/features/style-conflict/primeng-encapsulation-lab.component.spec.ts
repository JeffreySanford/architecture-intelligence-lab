import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimengEncapsulationLabComponent } from './primeng-encapsulation-lab.component';

describe('PrimengEncapsulationLabComponent', () => {
  let fixture: ComponentFixture<PrimengEncapsulationLabComponent>;
  let component: PrimengEncapsulationLabComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PrimengEncapsulationLabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengEncapsulationLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the mode buttons and default to normal view', () => {
    const buttonText = fixture.nativeElement.querySelectorAll('.encapsulation-lab__mode-button');
    expect(buttonText.length).toBe(4);
    expect(buttonText[0].textContent).toContain('Normal PrimeNG');
    expect(buttonText[1].textContent).toContain('Encapsulation.None Impact');
    expect(buttonText[2].textContent).toContain('Fixed / Contained');
    expect(buttonText[3].textContent).toContain('Encapsulation.None Token Recovery');
    expect(fixture.nativeElement.querySelector('.encapsulation-lab--normal')).toBeTruthy();
  });

  it('should switch to impact view when the impact button is clicked', () => {
    const impactButton = fixture.nativeElement.querySelectorAll('.encapsulation-lab__mode-button')[1];
    impactButton.click();
    fixture.detectChanges();

    expect(component.activeView()).toBe('impact');
    expect(fixture.nativeElement.querySelector('.encapsulation-lab--impact')).toBeTruthy();
  });

  it('should show the fixed view panels and contained design-system zone', () => {
    const fixedButton = fixture.nativeElement.querySelectorAll('.encapsulation-lab__mode-button')[2];
    fixedButton.click();
    fixture.detectChanges();

    expect(component.activeView()).toBe('fixed');
    expect(fixture.nativeElement.querySelector('.encapsulation-lab--fixed')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.prime-demo__panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.prime-demo__area--contained')).toBeTruthy();
  });

  it('should support the token recovery tab', () => {
    const tokenButton = fixture.nativeElement.querySelectorAll('.encapsulation-lab__mode-button')[3];
    tokenButton.click();
    fixture.detectChanges();

    expect(component.activeView()).toBe('tokens');
    expect(fixture.nativeElement.querySelector('app-primeng-encapsulation-design-tokens')).toBeTruthy();
  });

  it('should render the same PrimeNG component set in each view', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const controls = fixture.nativeElement.querySelector('.prime-demo__controls');
    const card = fixture.nativeElement.querySelector('.p-card');
    const table = fixture.nativeElement.querySelector('.p-table, .p-datatable');
    const input = fixture.nativeElement.querySelector('input');
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(controls).toBeTruthy();
    expect(card).toBeTruthy();
    expect(table).toBeTruthy();
    expect(input).toBeTruthy();
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('should render the token recovery page preview and inspector section in the token tab', async () => {
    const tokenButton = fixture.nativeElement.querySelectorAll('.encapsulation-lab__mode-button')[3];
    tokenButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.activeView()).toBe('tokens');
    expect(fixture.nativeElement.querySelector('.token-recovery-demo')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.prime-demo__page-sample')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-primeng-encapsulation-shared')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.token-recovery-demo__token').length).toBe(4);
    expect(fixture.nativeElement.querySelector('section.token-recovery-demo__inspector')).toBeTruthy();
  });
});
