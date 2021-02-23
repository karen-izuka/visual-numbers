const load = async () => {
  const data = await d3.csv('data.csv', ({language, usage}) => ({language: language, usage: +usage}));
  chart(data);
}

const chart = data => {
  const margin = {top: 25, right: 25, bottom: 35, left: 25};
  const width = 800 - margin.left - margin.right;
  const height = 425 - margin.top - margin.bottom;
  const format = d3.format('.1%');
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  const x = d3.scaleBand()
    .domain(data.map(d => d.language))
    .range([0, width])
    .padding(0.1);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.usage*1.1)])
    .range([height, 0]);
  const xAxis = g => g
    .call(d3.axisBottom(x).tickSize(0));
  const gx = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', `translate(0, 10)`);
  const bar = svg.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.language))
    .attr('y', d => y(d.usage))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d.usage))
    .attr('fill', '#00818a');
  const label = svg.selectAll('.label')
    .data(data)
    .join('text')
    .text(d => format(d.usage))
    .attr('class', 'label')
    .attr('x', d => x(d.language) + x.bandwidth()/2)
    .attr('y', d => y(d.usage) - 10)
    .attr('text-anchor', 'middle');
}

load();