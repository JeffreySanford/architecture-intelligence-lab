import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import * as d3 from 'd3';
import { DashboardStore } from '../../core/dashboard/dashboard.store';
import { OpenApiStore } from '../../core/openapi/openapi.store';

type ContractStatus = 'generated' | 'planned' | 'wrapped' | 'watch';

type ContractTreeNode = {
  name: string;
  children?: ContractTreeNode[];
};

@Component({
  standalone: true,
  selector: 'app-openapi-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    ChipModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './openapi.page.html',
  styleUrl: './openapi.page.scss',
})
export class OpenApiPage implements AfterViewInit {
  private readonly openApiStore = inject(OpenApiStore);
  private readonly dashboardStore = inject(DashboardStore);

  @ViewChild('contractTree', { static: true })
  private contractTree?: ElementRef<SVGSVGElement>;

  protected readonly openApiDriftStatus = this.openApiStore.openApiDriftStatus;
  protected readonly explainMode = this.dashboardStore.explainMode;
  protected readonly clientFilter = this.openApiStore.clientFilter;
  protected readonly endpointFilter = this.openApiStore.endpointFilter;
  protected readonly driftFilter = this.openApiStore.driftFilter;
  protected readonly rowsPerPageOptions = this.openApiStore.rowsPerPageOptions;
  protected readonly swaggerLinks = this.openApiStore.swaggerLinks;
  protected readonly generatedClients = this.openApiStore.generatedClients;
  protected readonly contractEndpoints = this.openApiStore.contractEndpoints;
  protected readonly driftBoundaries = this.openApiStore.driftBoundaries;
  protected readonly filteredGeneratedClients = this.openApiStore.filteredGeneratedClients;
  protected readonly filteredContractEndpoints = this.openApiStore.filteredContractEndpoints;
  protected readonly filteredDriftBoundaries = this.openApiStore.filteredDriftBoundaries;

  ngAfterViewInit(): void {
    this.renderContractTree();
  }

  protected statusSeverity(status: ContractStatus): 'success' | 'info' | 'warn' {
    switch (status) {
      case 'generated':
      case 'wrapped':
        return 'success';
      case 'watch':
        return 'warn';
      default:
        return 'info';
    }
  }

  private renderContractTree(): void {
    if (!this.contractTree) {
      return;
    }

    const rootData: ContractTreeNode = {
      name: 'OpenAPI Contract Tree',
      children: [
        {
          name: 'Generated clients',
          children: this.generatedClients().map((client) => ({ name: client.client })),
        },
        {
          name: 'Contract endpoints',
          children: this.contractEndpoints().map((endpoint) => ({ name: endpoint.endpoint })),
        },
        {
          name: 'Drift boundaries',
          children: this.driftBoundaries().map((boundary) => ({ name: boundary.boundary })),
        },
      ],
    };

    const svg = d3.select(this.contractTree.nativeElement);
    const width = 940;
    const height = 520;
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('aria-label', 'OpenAPI contract tree');

    const root = d3.hierarchy<ContractTreeNode>(rootData);
    const treeLayout = d3.tree<ContractTreeNode>().size([width - 120, height - 140]);
    treeLayout(root);
    const treeLinks = root.links() as Array<d3.HierarchyPointLink<ContractTreeNode>>;

    const linkGroup = svg.append('g').attr('transform', 'translate(60,40)');
    const nodeGroup = svg.append('g').attr('transform', 'translate(60,40)');

    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<ContractTreeNode>, d3.HierarchyPointNode<ContractTreeNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

    linkGroup
      .selectAll('path')
      .data(treeLinks)
      .join('path')
      .attr('class', 'openapi__tree-link')
      .attr('d', (d) => linkGenerator(d as unknown as d3.HierarchyPointLink<ContractTreeNode>));

    const nodes = nodeGroup
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('class', 'openapi__tree-node')
      .attr('transform', (d) => `translate(${d.y}, ${d.x})`);

    nodes
      .append('circle')
      .attr('r', 16)
      .attr('class', 'openapi__tree-node-circle');

    nodes
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', (d) => (d.children ? -24 : 24))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .attr('class', 'openapi__tree-node-label')
      .text((d) => d.data.name);
  }

  private filterRows<T extends object>(rows: T[], filterValue: string): T[] {
    const filterText = filterValue.trim().toLowerCase();

    if (!filterText) {
      return rows;
    }

    return rows.filter((row) =>
      Object.values(row).some((value: unknown) =>
        String(value).toLowerCase().includes(filterText),
      ),
    );
  }
}
