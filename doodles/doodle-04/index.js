const parseTime = d3.timeParse('%Y-%m-%d');

const load = async () => {
  const data = await d3.csv('data.csv', ({index,location,date,temperature}) => ({
    index: +index, location: location, date: parseTime(date), temperature: +temperature, index: +index
  }));
  draw(data);
}

const draw = data => {
  //chart
  const margin = {top: 25, right: 15, bottom: 0, left: 65};
  const width = 800 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  const x1 = d3.scaleBand()
    .domain([...Array(365).keys()])
    .range([0, width]);
  const x2 = d3.scaleTime()
    .domain([new Date('01-01-2020'), new Date('01-01-2021')])
    .range([0, width]);
  const y = d3.scaleBand()
    .domain(data.map(d => d.location))
    .range([0, height])
    .padding(0.2);
  const color = d3.scaleLinear()
    .domain([10,20,40,60,80,100,100])
    .range(['#d89cf6','#11cbd7','#b2e672','#fff591','#fbc687','#fc5c9c']);
  const xAxis = g => g
    .call(d3.axisTop(x2).tickSizeOuter(0).tickFormat(d3.timeFormat('%b')));
  const yAxis = g => g
    .call(d3.axisLeft(y).tickSize(0));
  const gx = svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .attr('transform', 'translate(0,-5)');
  const gy = svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .attr('transform', 'translate(-5,0)');
  const rect = svg.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x1(d.index))
    .attr('y', d => y(d.location))
    .attr('width', x1.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', d => color(d.temperature));
  //legend
  const l = d3.scaleLinear()
    .domain(d3.extent(color.domain()))
    .range([0, width/1.5]);
  const lAxis = g => g
    .attr('class', 'lAxis')
    .attr('transform', `translate(0, 20)`)
    .call(d3.axisBottom(l).tickSize(-20));
  const legend = d3.select('#legend')
    .append('svg')
    .attr('width', margin.left + width/1.5 + margin.right)
    .attr('height', 50)
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`);
  legend.append('defs')
    .append('linearGradient')
    .attr('id', 'linear-gradient')
    .selectAll('stop')
    .data(color.range())
    .join('stop')
    .attr('offset', (d,i) => i/(color.range().length-1))
    .attr('stop-color', d => d);
  legend.append('g')
    .append('rect')
    .attr('transform', `translate(0, 0)`)
    .attr('width', width/1.5)
    .attr('height', 20)
    .style('fill', 'url(#linear-gradient)');
  legend.append('g')
    .call(lAxis)
    .selectAll('text')
    .attr('transform', 'translate(0,5)');
}

load();