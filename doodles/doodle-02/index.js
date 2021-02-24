const load = async () => {
  const data = await d3.csv('data.csv', ({language, value}) => ({
    language: language, value: +value
  }));
  draw(data);
}

const draw = data => {
  console.log(data);
  const margin = {top: 25, right: 25, bottom: 50, left: 25};
  const width = 800 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
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
    .padding(0.4);
  const y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
  const xAxis = g => g
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove());
  const bar = svg.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.language))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0)-y(d.value));
  const label = svg.selectAll('.label')
    .data(data)
    .join('text')
    .text(d => format(d.value))
    .attr('class', 'label')
    .attr('x', d => x(d.language) + x.bandwidth()/2)
    .attr('y', d => y(d.value) - 10)
    .attr('text-anchor', 'middle');
  const gx = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', `translate(0, 10)`);
}

load();