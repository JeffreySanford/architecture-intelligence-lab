import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlossaryPage } from './glossary.page';

describe('GlossaryPage', () => {
  let fixture: ComponentFixture<GlossaryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossaryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GlossaryPage);
    fixture.detectChanges();
  });

  it('renders fintech terms and code section details by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Fintech, Capital Markets, And Angular Terms');
    expect(compiled.textContent).toContain('Security');
    expect(compiled.textContent).toContain('Agency MBS');
    expect(compiled.textContent).toContain('TBA Trade');
    expect(compiled.textContent).toContain('KYC / AML');
    expect(compiled.textContent).toContain('Security Search facade');
    expect(compiled.textContent).toContain('security-search.facade.ts');
  });

  it('switches selected term details when a term is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const generatedClientButton = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.glossary__term-button')).find(
      (button) => button.textContent?.includes('Generated OpenAPI Client'),
    );

    generatedClientButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('h2')?.textContent).toContain('Generated OpenAPI Client');
    expect(compiled.textContent).toContain('Nest API facade');
    expect(compiled.textContent).toContain('OpenAPI Contract Lab');
  });

  it('filters terms by Angular category', () => {
    const component = fixture.componentInstance as unknown as {
      selectCategory: (category: 'Angular') => void;
      filteredTerms: () => Array<{ category: string; term: string }>;
    };

    component.selectCategory('Angular');

    expect(component.filteredTerms().length).toBeGreaterThan(0);
    expect(component.filteredTerms().every((term) => term.category === 'Angular')).toBe(true);
  });
});
