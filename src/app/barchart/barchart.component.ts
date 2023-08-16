import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { d3Selection } from '../typings/platfom-typings';
import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent  implements OnInit{
@ViewChild('visualization', { static: true }) private chartContainer!: ElementRef<SVGAElement>;

  constructor() {}

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(this.chartContainer.nativeElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Sample data
    const data = [
      { x: 1, y: 5 },
      { x: 2, y: 10 },
      { x: 3, y: 8 },
      // ... add more data points
    ];

    const xScale = d3.scaleLinear()
      .domain([0,3])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0])

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
  }
}
