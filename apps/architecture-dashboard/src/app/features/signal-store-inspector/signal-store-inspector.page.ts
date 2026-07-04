import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardStore } from '../../core/dashboard/dashboard.store';
import * as d3 from 'd3';

interface StoreNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
}

interface StoreLink extends d3.SimulationLinkDatum<StoreNode> {
  source: string | StoreNode;
  target: string | StoreNode;
}

@Component({
  standalone: true,
  selector: 'app-signal-store-inspector-page',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './signal-store-inspector.page.html',
  styleUrls: ['./signal-store-inspector.page.scss'],
})
export class SignalStoreInspectorPage implements AfterViewInit {
  @ViewChild('signalStoreGraph', { static: true })
  private signalStoreGraph?: ElementRef<SVGSVGElement>;

  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly explainMode = this.dashboardStore.explainMode;
  protected readonly highlightedNode = signal<string | null>(null);

  private readonly nodes: StoreNode[] = [
    { id: 'raw-state', label: 'Raw state', category: 'state' },
    { id: 'computed-indexes', label: 'Computed indexes', category: 'computed' },
    { id: 'view-models', label: 'ViewModels', category: 'viewmodel' },
    { id: 'methods', label: 'Methods', category: 'methods' },
    { id: 'ui-cards', label: 'UI cards', category: 'ui' },
    { id: 'tables', label: 'Tables', category: 'ui' },
  ];

  private readonly links: StoreLink[] = [
    { source: 'raw-state', target: 'computed-indexes' },
    { source: 'computed-indexes', target: 'view-models' },
    { source: 'view-models', target: 'ui-cards' },
    { source: 'view-models', target: 'tables' },
    { source: 'methods', target: 'computed-indexes' },
    { source: 'methods', target: 'raw-state' },
  ];

  ngAfterViewInit(): void {
    this.renderSignalStoreGraph();
  }

  protected selectNode(nodeId: string): void {
    this.highlightedNode.set(this.highlightedNode() === nodeId ? null : nodeId);
    this.updateHighlight();
  }

  private renderSignalStoreGraph(): void {
    if (!this.signalStoreGraph) {
      return;
    }

    const svg = d3.select(this.signalStoreGraph.nativeElement);
    const width = 980;
    const height = 460;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('aria-label', 'SignalStore dependency graph');

    const linkGroup = svg.append('g').attr('class', 'signal-store-graph__links');
    const nodeGroup = svg.append('g').attr('class', 'signal-store-graph__nodes');

    const linkElements = linkGroup
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('class', 'signal-store-graph__link')
      .attr('stroke-width', 2);

    const nodeElements = nodeGroup
      .selectAll('g')
      .data(this.nodes)
      .join((enter) => {
        const group = enter.append('g').attr('class', 'signal-store-graph__node');
        group.append('circle').attr('r', 34).attr('class', 'signal-store-graph__node-circle');
        group
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('class', 'signal-store-graph__node-label')
          .text((node) => node.label);
        return group;
      })
      .on('click', (event, node) => this.selectNode(node.id));

    const simulation = d3
      .forceSimulation<StoreNode>(this.nodes)
      .force(
        'link',
        d3
          .forceLink<StoreNode, StoreLink>(this.links)
          .id((node) => node.id)
          .distance(140)
          .strength(0.9),
      )
      .force('charge', d3.forceManyBody().strength(-290))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(72))
      .on('tick', () => {
        linkElements
          .attr('x1', (d) => (d.source as StoreNode).x ?? 0)
          .attr('y1', (d) => (d.source as StoreNode).y ?? 0)
          .attr('x2', (d) => (d.target as StoreNode).x ?? 0)
          .attr('y2', (d) => (d.target as StoreNode).y ?? 0);

        nodeElements.attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
      });

    simulation.alpha(1).restart();
    this.updateHighlight();
  }

  private updateHighlight(): void {
    const selected = this.highlightedNode();
    if (!this.signalStoreGraph?.nativeElement) {
      return;
    }

    const svg = d3.select<SVGSVGElement, unknown>(this.signalStoreGraph.nativeElement);
    if (!svg) {
      return;
    }

    svg
      .selectAll<SVGCircleElement, StoreNode>('.signal-store-graph__node-circle')
      .classed('signal-store-graph__node-circle--highlighted', (node) => selected === node.id || !selected);

    svg
      .selectAll<SVGLineElement, StoreLink>('.signal-store-graph__link')
      .classed('signal-store-graph__link--dimmed', (link) => {
        if (!selected) {
          return false;
        }
        return ![link.source, link.target].some((endpoint) =>
          typeof endpoint === 'string' ? endpoint === selected : endpoint.id === selected,
        );
      });
  }
}
