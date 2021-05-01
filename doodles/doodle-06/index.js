const load = async () => {
  const us = await d3.json(
    'https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json'
  );
  const states = new Map(
    us.objects.states.geometries.map(d => [d.id, d.properties])
  );
  const data = Object.assign(
    new Map(await d3.csv('data.csv', ({ id, price }) => [id, +price]))
  );
  draw(us, states, data);
};

function scale(factor, width, height) {
  return d3.geoTransform({
    point: function (x, y) {
      this.stream.point(
        (x - width / 5) * factor + width / 5,
        (y - height / 20) * factor + height / 20
      );
    },
  });
}

const draw = (us, states, data) => {
  const margin = { top: 25, right: 25, bottom: 0, left: 25 };
  const width = 800;
  const height = 450;
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  const color = d3
    .scaleLinear()
    .domain([0, 100000, 200000, 300000, 400000, 1200000])
    .range(['#d89cf6', '#11cbd7', '#b2e672', '#fff591', '#fbc687', '#fc5c9c']);
  const path = d3.geoPath().projection(scale(0.75, width, height));
  const map = svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .join('path')
    .attr('fill', d =>
      data.get(d.id) == null ? '#d89cf6' : color(data.get(d.id))
    )
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5)
    .attr('fill-opacity', 0.8)
    .attr('d', path);
  const border = svg
    .append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('d', path);

  //legend
  const l = d3
    .scaleLinear()
    .domain(d3.extent(color.domain()))
    .range([0, width / 1.2]);
  const lAxis = g =>
    g
      .attr('class', 'lAxis')
      .attr('transform', `translate(0, 20)`)
      .call(d3.axisBottom(l).tickSize(-20).tickFormat(d3.format('.2s')));
  const legend = d3
    .select('#legend')
    .append('svg')
    .attr('width', margin.left + width / 1.2 + margin.right)
    .attr('height', 50)
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`);
  legend
    .append('defs')
    .append('linearGradient')
    .attr('id', 'linear-gradient')
    .selectAll('stop')
    .data(color.range())
    .join('stop')
    .attr('offset', (d, i) => i / (color.range().length - 1))
    .attr('stop-color', d => d);
  legend
    .append('g')
    .append('rect')
    .attr('transform', `translate(0, 0)`)
    .attr('width', width / 1.2)
    .attr('height', 20)
    .style('fill', 'url(#linear-gradient)');
  legend
    .append('g')
    .call(lAxis)
    .selectAll('text')
    .attr('transform', 'translate(0,5)');
};

load();
