import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashboardStore } from '../../core/dashboard/dashboard.store';
import * as d3 from 'd3';

type RequestPathKey = 'spring-direct' | 'nest-direct' | 'nest-proxy' | 'compare-all';

type ArchitecturePath = {
  key: RequestPathKey;
  label: string;
  description: string;
};

interface ArchitectureNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: string;
}

interface ArchitectureLink extends d3.SimulationLinkDatum<ArchitectureNode> {
  source: string | ArchitectureNode;
  target: string | ArchitectureNode;
  path: RequestPathKey;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-architecture-flow-page',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './architecture-flow.page.html',
  styleUrls: ['./architecture-flow.page.scss'],
})
export class ArchitectureFlowPage implements AfterViewInit {
  @ViewChild('architectureGraph', { static: true })
  private architectureGraph?: ElementRef<SVGSVGElement>;

  protected readonly requestPaths: ArchitecturePath[] = [
    {
      key: 'spring-direct',
      label: 'Spring direct',
      description: 'Angular calls Spring directly for source-of-truth dashboard data.',
    },
    {
      key: 'nest-direct',
      label: 'Nest direct',
      description: 'Angular calls Nest direct read endpoints for comparison and diagnostics.',
    },
    {
      key: 'nest-proxy',
      label: 'Nest proxy',
      description: 'Angular calls the Nest gateway proxy, which forwards to Spring.',
    },
    {
      key: 'compare-all',
      label: 'Compare all',
      description: 'Show all backend paths and tooling flows together for architecture context.',
    },
  ];

  protected readonly selectedPath = signal<ArchitecturePath | null>(null);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly explainMode = this.dashboardStore.explainMode;

  private readonly nodes: ArchitectureNode[] = [
    { id: 'browser', label: 'Browser', group: 'client' },
    { id: 'angular', label: 'Angular shell', group: 'frontend' },
    { id: 'spring', label: 'Spring API', group: 'backend' },
    { id: 'nest', label: 'Nest gateway', group: 'backend' },
    { id: 'postgres', label: 'PostgreSQL', group: 'data' },
    { id: 'redis', label: 'Redis', group: 'data' },
    { id: 'pgadmin', label: 'pgAdmin', group: 'tooling' },
    { id: 'redisInsight', label: 'Redis Insight', group: 'tooling' },
  ];

  private readonly links: ArchitectureLink[] = [
    { source: 'browser', target: 'angular', path: 'compare-all', label: 'UI request' },
    { source: 'angular', target: 'spring', path: 'spring-direct', label: 'Spring direct' },
    { source: 'angular', target: 'nest', path: 'nest-direct', label: 'Nest direct' },
    { source: 'nest', target: 'spring', path: 'nest-proxy', label: 'Nest proxy' },
    { source: 'spring', target: 'postgres', path: 'compare-all', label: 'SQL reads' },
    { source: 'spring', target: 'redis', path: 'compare-all', label: 'Cache access' },
    { source: 'postgres', target: 'pgadmin', path: 'compare-all', label: 'DB tooling' },
    { source: 'redis', target: 'redisInsight', path: 'compare-all', label: 'Cache tooling' },
  ];

  private linkSelection?: d3.Selection<SVGLineElement, ArchitectureLink, SVGGElement, unknown>;

  ngAfterViewInit(): void {
    this.renderArchitectureGraph();
  }

  protected selectPath(pathKey: RequestPathKey): void {
    const current = this.selectedPath();
    const next = this.requestPaths.find((path) => path.key === pathKey) ?? null;

    if (!current) {
      this.selectedPath.set(next);
      this.updatePathHighlight();
      return;
    }

    if (current.key === pathKey) {
      this.selectedPath.set(null);
      this.updatePathHighlight();
      return;
    }

    this.selectedPath.set(next);
    this.updatePathHighlight();
  }

  private renderArchitectureGraph(): void {
    if (!this.architectureGraph) {
      return;
    }

    const svg = d3.select(this.architectureGraph.nativeElement);
    const width = 1024;
    const height = 520;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('aria-label', 'Architecture flow graph');

    const linkGroup = svg.append('g').attr('class', 'architecture-flow__links');
    const nodeGroup = svg.append('g').attr('class', 'architecture-flow__nodes');

    const linkElements = linkGroup
      .selectAll<SVGLineElement, ArchitectureLink>('line')
      .data(this.links)
      .join('line')
      .attr('class', 'architecture-flow__link')
      .attr('stroke-width', 2);

    const nodeElements = nodeGroup
      .selectAll<SVGGElement, ArchitectureNode>('g')
      .data(this.nodes)
      .join((enter) => {
        const group = enter.append('g').attr('class', 'architecture-flow__node');

        group
          .append('circle')
          .attr('r', 34)
          .attr('class', 'architecture-flow__node-circle');

        group
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('class', 'architecture-flow__node-label')
          .text((node) => node.label);

        return group;
      });

    const simulation = d3
      .forceSimulation<ArchitectureNode>(this.nodes)
      .force(
        'link',
        d3
          .forceLink<ArchitectureNode, ArchitectureLink>(this.links)
          .id((node) => node.id)
          .distance(140)
          .strength(0.9),
      )
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(68))
      .on('tick', () => {
        linkElements
          .attr('x1', (d) => (d.source as ArchitectureNode).x ?? 0)
          .attr('y1', (d) => (d.source as ArchitectureNode).y ?? 0)
          .attr('x2', (d) => (d.target as ArchitectureNode).x ?? 0)
          .attr('y2', (d) => (d.target as ArchitectureNode).y ?? 0);

        nodeElements.attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
      });

    this.linkSelection = linkElements;

    simulation.alpha(1).restart();
    this.updatePathHighlight();
  }

  private updatePathHighlight(): void {
    if (!this.linkSelection) {
      return;
    }

    const activeKey = this.selectedPath()?.key;

    this.linkSelection.classed(
      'architecture-flow__link--active',
      (d) => activeKey === 'compare-all' || d.path === activeKey,
    );
  }
}
