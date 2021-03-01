const load = async () => {
  const data = await d3.json('data.json');
  chart(data);
}

const chart = data => {
  const margin = {top: 10, right: 10, bottom: 10, left: 10};
  const width = 800;
  const height = 450;
  const div = d3.select('#chart')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  const format = d3.format(',');
  const sankey = d3.sankey()
    .nodeWidth(25)
    .nodePadding(10)
    .size([width, height]);
  const graph = sankey(data);
  const color = d3.scaleOrdinal()
    .domain(graph.nodes.map(d => d.name))
    .range(['#fc5185','#B1F4FB','#ffc8c8','#fbc687','#dcd6f7','#BBF8CA','#FFEC54','#62d2a2','#fdc7ff']);
  const node = svg.append('g')
    .selectAll('rect')
    .data(graph.nodes)
    .join('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => color(d.name))
    .attr('opacity', 0.8)
    .on('mouseover', function(e, d) {
      div.transition()
        .duration(20)
        .style('opacity', 0.8)
      div.html(`<div>${(d.name).replace(/0 |1 |2 /g, '')}</div><div>${format(d.value)} villagers</div>`)
        .style('left', `${(e.pageX)}px`)
        .style('top', `${(e.pageY)}px`);
    })
    .on('mouseout', function(e, d) {
      div.transition()
        .duration(20)
        .style('opacity', 0);
    });
  const link = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-opacity', 0.6)
    .selectAll('g')
    .data(graph.links)
    .join('g')
    .style('mix-blend-mode', 'multiply');
  const gradient = link.append('linearGradient')
    .attr('id', (d,i) => `linear-gradient-${i}`)
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', d => d.source.x1)
    .attr('x2', d => d.target.x0);
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', d => color(d.source.name));
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', d => color(d.target.name));
  link.append('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke', (d,i) => `url(#linear-gradient-${i})`)
    .attr('stroke-width', d => Math.max(1, d.width))
    .on('mouseover', function(e, d) {
      div.transition()
        .duration(20)
        .style('opacity', 0.8)
      div.html(`<div>${(d.source.name).replace(/0 |1 |2 /g, '')} → ${(d.target.name).replace(/0 |1 |2 /g, '')}</div><div>${format(d.value)} villagers</div>`)
        .style('left', `${(e.pageX)}px`)
        .style('top', `${(e.pageY)}px`);
    })
    .on('mouseout', function(e, d) {
      div.transition()
        .duration(20)
        .style('opacity', 0);
    });
  const text = svg.append('g')
    .selectAll('text')
    .data(graph.nodes)
    .join('text')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 5 : d.x0 - 5)
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .text(d => `${(d.name).replace(/0 |1 |2 /g, '')}`)
    .attr('alignment-baseline', 'middle');
}

load();