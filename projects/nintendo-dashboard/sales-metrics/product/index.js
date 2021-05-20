const load = async (file_path) => {
  const data = await d3.csv(file_path, ({ year, units_sold }) => ({
    year: year,
    units_sold: Number.parseFloat(units_sold),
  }));
  return data;
};

const chart = (selector, data) => {
  const margin = { top: 50, right: 25, bottom: 50, left: 25 };
  const width = 575 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const format = d3.format(",");
  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.3);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.units_sold)])
    .range([height, 0]);
  const xAxis = (g) =>
    g
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select(".domain").remove());
  const bar = svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.units_sold))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.units_sold));
  const label = svg
    .selectAll(".label")
    .data(data)
    .join("text")
    .text((d) => format(d.units_sold))
    .attr("class", "label")
    .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.units_sold) - 10)
    .attr("text-anchor", "middle");
  const gx = svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", `translate(0, 10)`);
};

const main = async () => {
  const data_01 = await load("data-01.csv");
  const data_02 = await load("data-02.csv");
  chart("#chart-01", data_01);
  chart("#chart-02", data_02);
};

main();
