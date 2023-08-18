import { Component, ElementRef, ViewChild } from '@angular/core'
import * as d3 from 'd3'

@Component({
  selector: 'app-bar-example',
   template: '<div #chart></div>',
  styleUrls: ['./bar-example.component.scss'],
})
export class BarExampleComponent {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef

  constructor() {}

  ngOnInit(): void {
    this.createBarChart()
  }

  private createBarChart(): void {
    const margin = { top: 10, right: 30, bottom: 90, left: 40 }
    const width = 460 - margin.left - margin.right
    const height = 450 - margin.top - margin.bottom

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',
    ).then((data) => {
      console.log(data,'data')
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d['Country']))
        .padding(0.2)

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')

      const y = d3.scaleLinear().domain([0, 100]).range([height, 0])

      svg.append('g').call(d3.axisLeft(y))

      svg
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => x(d['Country']))
        .attr('width', x.bandwidth())
        .attr('fill', '#69b3a2')
        .attr('height', (d) => height - y(0))
        .attr('y', (d) => y(0))

      // svg
      //   .selectAll('rect')
      //   .transition()
      //   .duration(800)
      //   .attr('y', (d) => y(+d['Value']))
      //   .attr('height', (d) => height - y(+d['Value']))
      //   .delay((d, i) => i * 100)
    })
  }
}
