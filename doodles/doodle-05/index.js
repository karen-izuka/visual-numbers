const parseTime = d3.timeParse('%Y-%m-%d');

const load = async () => {
  const data = await d3.csv('data.csv', ({date, stock_price}) => ({
    date: parseTime(date), stock_price: +stock_price
  }));
  chart(data);
}

const chart = data => {
  const bisectDate = d3.bisector(d => d.date).left;
  const format = d3.format('$,d');


  console.log(data)
  const margin = {top: 25, right: 25, bottom: 30, left: 50};
  const width = 800 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.stock_price)*1.1])
    .range([height, 0]);
  const xAxis = g => g
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5).tickSize(0).tickFormat(d3.timeFormat('%Y')));
  const yAxis = g => g
    .call(d3.axisLeft(y).tickFormat(format))
    .call(g => g.select('.domain').remove());
  const colors = ['#fc5185','#ffd3b5','#ffffff'];
  const defs = svg.append('defs');
  const gradient = defs.append('linearGradient')
    .attr('id', 'linear-gradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%');
  gradient.selectAll('stop')
    .data(colors)
    .join('stop')
    .attr('offset', (d, i) => i/colors.length)
    .attr('stop-color', d => d);
  const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.stock_price))
    .curve(d3.curveNatural);
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.stock_price))
    .curve(d3.curveNatural);

  const gx = svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .selectAll('text')
    .attr('transform', `translate(0,15)`)
  const gy = svg.append('g')
    .attr('class', 'axis')
    .call(yAxis);
  const pathA = svg.append('path')
    .datum(data)
    .attr('d', area)
    .attr('fill', 'url(#linear-gradient)')
    .attr('fill-opacity', 0.3);
  const pathB = svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);

  const focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none');
  focus.append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('y1', 0)
    .attr('y2', height);
  focus.append('line')
    .attr('class', 'y-hover-line hover-line')
    .attr('x1', width)
    .attr('x2', width);
  focus.append('img')
    .attr('src','https://www.visualnumbers.net/assets/svg/heart.svg')
    .attr('width', 20)
    .attr('height', 20);
  focus.append('rect')
    .attr('class', 'rect')
    .attr('transform', `translate(${-50/2}, ${-(75/2)})`)
    .attr('width', 50)
    .attr('height', 25)
    .attr('rx', 10);
  focus.append('text')
    .attr('x', 0)
    .attr('y', -25)
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle');
  
  const overlay = svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', () => focus.style('display', null))
    .on('mouseout', () => focus.style('display', 'none'))
    .on('mousemove', mousemove);

  function mousemove() {
    const x0 = x.invert(d3.pointer(event)[0]);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i-1];
    const d1 = data[i];
    const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr('transform', `translate(${x(d.date)}, ${y(d.stock_price)})`);
    focus.select('text').text(format(d.stock_price));
    focus.select('.x-hover-line').attr('y2', height - y(d.stock_price));
    focus.select('.y-hover-line').attr('x2', width + width);
  }
  
}

load();