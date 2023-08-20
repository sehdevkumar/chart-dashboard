import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import * as d3 from 'd3'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  // styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @ViewChild('lineChart', { static: true }) private chartContainer: ElementRef

  constructor() {}

  ngOnInit() {
    this.createLineChart()

  }

  createLineChart() {
    const data = [
      { x: 0, y: 5 },
      { x: 1, y: 9 },
      { x: 2, y: 7 },
      { x: 3, y: 3 },
      { x: 4, y: 8 },
      { x: 5, y: 6 },
    ]

    const element = this.chartContainer?.nativeElement
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = element.offsetWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([height, 0])

    const line = d3
      ?.line()
      .x((d) => xScale(d['x']))
      .y((d) => yScale(d['y']))

    svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', (line as unknown) as string)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)

    // / Add circles at data points
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d['x']))
      .attr('cy', (d) => yScale(d['y']))
      .attr('r', 4) // Radius of the circles
      .attr('fill', 'steelblue') // Circle fill color


    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))

    svg.append('g').call(d3.axisLeft(yScale))
  }
}
