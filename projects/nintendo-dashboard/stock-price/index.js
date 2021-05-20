const load = async () => {
  const parseTime = d3.timeParse("%m/%d/%Y");
  const data = await d3.csv("data.csv", ({ date, stock_price }) => ({
    date: parseTime(date),
    stock_price: Number.parseFloat(stock_price),
  }));
  draw(data);
};

const draw = (data) => {
  const bisectDate = d3.bisector((d) => d.date).left;
  const format = d3.format("$,d");
  const format_date = d3.timeFormat("%m/%d/%y");
  const margin = { top: 25, right: 0, bottom: 30, left: 35 };
  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.stock_price) + 10])
    .range([height, 0]);
  const xAxis = (g) =>
    g
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3.axisBottom(x).ticks(5).tickSize(0).tickFormat(d3.timeFormat("%Y"))
      );
  const yAxis = (g) =>
    g
      .call(d3.axisLeft(y).tickFormat(format))
      .call((g) => g.select(".domain").remove());
  const colors = ["#00b9e1", "#7ad1e9", "#90d9ec", "#a6e0f0", "#ffffff"];
  const defs = svg.append("defs");
  const linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");
  linearGradient
    .selectAll("stop")
    .data(colors)
    .join("stop")
    .attr("offset", (d, i) => i / colors.length)
    .attr("stop-color", (d) => d);
  const area = d3
    .area()
    .x((d) => x(d.date))
    .y0(y(0))
    .y1((d) => y(d.stock_price))
    .curve(d3.curveNatural);
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.stock_price))
    .curve(d3.curveNatural);

  const gx = svg
    .append("g")
    .attr("class", "axis")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", `translate(0,15)`);
  const gy = svg.append("g").attr("class", "axis").call(yAxis);
  const pathA = svg
    .append("path")
    .datum(data)
    .attr("d", area)
    .attr("fill", "url(#linear-gradient)")
    .attr("fill-opacity", 0.2);
  const pathB = svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  const focus = svg.append("g").attr("class", "focus").style("display", "none");
  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);
  focus.append("circle").attr("r", 5);
  focus
    .append("rect")
    .attr("class", "rect")
    .attr("transform", `translate(${-125 / 2}, ${-(75 / 2)})`)
    .attr("width", 125)
    .attr("height", 25)
    .attr("rx", 10);
  focus
    .append("text")
    .attr("x", 0)
    .attr("y", -25)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle");
  const overlay = svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);
  function mousemove() {
    const x0 = x.invert(d3.pointer(event)[0]);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", `translate(${x(d.date)}, ${y(d.stock_price)})`);
    focus
      .select("text")
      .text(`${format_date(d.date)} ${format(d.stock_price)}`);
    focus.select(".x-hover-line").attr("y2", height - y(d.stock_price));
    focus.select(".y-hover-line").attr("x2", width + width);
  }
};

load();
