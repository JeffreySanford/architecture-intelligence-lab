import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as d3 from 'd3';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AuthStore } from '../../core/auth/auth.store';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

type BucketDiagramNode = {
  id: string;
  label: string;
  count: number;
};

@Component({
  standalone: true,
  selector: 'app-map-inspector-page',
  imports: [CommonModule, FormsModule, InputTextModule, CardModule, TableModule],
  templateUrl: './map-inspector.page.html',
  styleUrl: './map-inspector.page.scss',
})
export class MapInspectorPage implements OnInit, AfterViewInit {
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly authStore = inject(AuthStore);
  protected readonly explainMode = this.dashboardStore.explainMode;
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('bucketDiagram', { static: true })
  private bucketDiagram?: ElementRef<SVGSVGElement>;

  protected readonly globalFilter = signal('');
  protected rowsPerPageOptions: number[] = [5, 10, 25];

  protected readonly filteredRows = computed(() => {
    const filterText = this.globalFilter().trim().toLowerCase();

    return this.dashboardStore.mapInspectorRows().filter((row) =>
      !filterText ||
      [row.indexName, row.key, row.value].some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly bucketData = computed<BucketDiagramNode[]>(() => [
    {
      id: 'loansById',
      label: 'loansById',
      count: this.dashboardStore.loansById().size,
    },
    {
      id: 'borrowersById',
      label: 'borrowersById',
      count: this.dashboardStore.borrowersById().size,
    },
    {
      id: 'documentsByLoanId',
      label: 'documentsByLoanId',
      count: this.dashboardStore.documentsByLoanId().size,
    },
    {
      id: 'statusByCode',
      label: 'statusByCode',
      count: this.dashboardStore.statusByCode().size,
    },
  ]);

  ngOnInit(): void {
    if (!this.dashboardStore.snapshot()) {
      this.dashboardStore
        .loadSnapshot('small')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.renderBucketDiagram();
        });
    }
  }

  ngAfterViewInit(): void {
    this.renderBucketDiagram();
  }

  private renderBucketDiagram(): void {
    if (!this.bucketDiagram) {
      return;
    }

    const data = this.bucketData();
    const width = 980;
    const height = 280;
    const svg = d3.select(this.bucketDiagram.nativeElement);

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('aria-label', 'Map bucket diagram');

    const x = d3
      .scalePoint<string>()
      .domain(data.map((item) => item.id))
      .range([96, width - 96]);

    const maxCount = d3.max(data, (item) => item.count) ?? 1;
    const radius = d3.scaleLinear().domain([0, maxCount]).range([24, 60]);

    svg
      .append('g')
      .attr('class', 'map-inspector__diagram-links')
      .selectAll('line')
      .data(data.slice(0, -1))
      .join('line')
      .attr('class', 'map-inspector__diagram-link')
      .attr('x1', (item) => x(item.id) ?? 0)
      .attr('y1', height / 2)
      .attr('x2', (_, index) => x(data[index + 1].id) ?? 0)
      .attr('y2', height / 2);

    const groups = svg
      .append('g')
      .attr('class', 'map-inspector__diagram-nodes')
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('class', 'map-inspector__diagram-node')
      .attr('transform', (item) => `translate(${x(item.id)}, ${height / 2})`);

    groups
      .append('circle')
      .attr('class', 'map-inspector__diagram-circle')
      .attr('r', (item) => radius(item.count))
      .attr('opacity', 0)
      .transition()
      .duration(360)
      .attr('opacity', 1);

    groups
      .append('text')
      .attr('class', 'map-inspector__diagram-count')
      .attr('dy', '-0.4em')
      .text((item) => `${item.count}`);

    groups
      .append('text')
      .attr('class', 'map-inspector__diagram-label')
      .attr('dy', '1.4em')
      .text((item) => item.label);
  }
}
