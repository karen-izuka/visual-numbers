const load = async () => {
  const data = await d3.csv(
    'data.csv',
    ({ year, label, measure, amount, start, pct }) => ({
      year: year,
      label: label,
      measure: measure,
      amount: Number.parseFloat(amount),
      start: Number.parseFloat(start),
      pct: Number.parseFloat(pct),
    })
  );
  const years = [...new Set(data.map(d => d.year))];

  let selectedYear;
  years.forEach(year => {
    document
      .querySelector('#year')
      .appendChild(new Option(year, year, !selectedYear, !selectedYear));
    if (!selectedYear) {
      selectedYear = year;
    }
  });
  const chart = new IncomeChart('#chart', data);
  chart.update(data.filter(d => d.year === selectedYear));

  document.querySelector('#year').addEventListener('change', event => {
    year = event.target.value;
    yearData = data.filter(d => d.year === year);
    chart.update(yearData);
  });
};

class IncomeChart {
  constructor(chartId, allYearsData) {
    const margin = { top: 40, right: 10, bottom: 40, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
    this.svg = d3
      .select(chartId)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    this.x = d3
      .scaleBand()
      .domain(allYearsData.map(d => d.measure))
      .range([0, width])
      .padding(0.3);
    this.y = d3
      .scaleLinear()
      .domain([0, d3.max(allYearsData, d => d.amount)])
      .range([height, 0]);

    const xAxis = g =>
      g
        .call(d3.axisBottom(this.x).tickSize(0))
        .call(g => g.select('.domain').remove());
    const gx = this.svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', `translate(0, 10)`);
  }

  update(data) {
    const format_01 = d3.format('.0f');
    const format_02 = d3.format('.0%');
    const bar = this.svg.selectAll('.rect').data(data);
    bar.exit().remove();
    bar
      .attr('x', d => this.x(d.measure))
      .attr('width', this.x.bandwidth())
      .attr('fill', d => (d.label == 'a' ? '#b2e672' : '#fc5c9c'))
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr('y', d => this.y(d.start))
      .attr('height', d => Math.max(this.y(0) - this.y(d.amount), 1));
    bar
      .enter()
      .append('rect')
      .attr('class', 'rect')
      .attr('x', d => this.x(d.measure))
      .attr('y', d => this.y(d.start))
      .attr('width', this.x.bandwidth())
      .attr('height', d => Math.max(this.y(0) - this.y(d.amount), 1))
      .attr('fill', d => (d.label == 'a' ? '#b2e672' : '#fc5c9c'));

    const label = this.svg.selectAll('.label').data(data);
    label.exit().remove();
    label
      .text(d =>
        d.pct == 0
          ? `$${format_01(d.amount / 1000)}B`
          : `$${format_01(d.amount / 1000)}B | ${format_02(d.pct)}`
      )
      .attr('x', d => this.x(d.measure) + this.x.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr('y', d => this.y(d.start) - 10);

    label
      .enter()
      .append('text')
      .text(d =>
        d.pct == 0
          ? `$${format_01(d.amount / 1000)}B`
          : `$${format_01(d.amount / 1000)}B | ${format_02(d.pct)}`
      )
      .attr('class', 'label')
      .attr('x', d => this.x(d.measure) + this.x.bandwidth() / 2)
      .attr('y', d => this.y(d.start) - 10)
      .attr('text-anchor', 'middle');
  }
}

load();
