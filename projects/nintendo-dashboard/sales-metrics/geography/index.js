const load = async () => {
  const data = await d3.json("world_data.json");
  const countries = topojson.feature(data, data.objects.countries);
  const data_01 = await d3.csv("data_01.csv", ({ year, value }) => ({
    year: year,
    value: Number.parseFloat(value),
  }));
  map(countries);
};

const map = (countries) => {
  const width = 1200;
  const height = 500;
  const projection = d3
    .geoMercator()
    .scale(225)
    .translate([width / 2, height / 1.25]);
  const path = d3.geoPath().projection(projection);
  const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const boundary = svg.append("g").attr("class", "boundary");
  const world = boundary
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("stroke", "#fafafa")
    .attr("fill", "#eeeeee")
    .attr("fill-opacity", 0.5);
};

load();
