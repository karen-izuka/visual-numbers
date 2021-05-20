// https://www.macrotrends.net/stocks/charts/NTDOY/nintendo/income-statement
const load = async () => {
  const data = await d3.csv(
    "data.csv",
    ({ name, FY20, FY19, FY18, FY17, FY16, FY15, FY14 }) => ({
      name: name,
      "FY-20": Number.parseFloat(FY20),
      "FY-19": Number.parseFloat(FY19),
      "FY-18": Number.parseFloat(FY18),
      "FY-17": Number.parseFloat(FY17),
      "FY-16": Number.parseFloat(FY16),
      "FY-15": Number.parseFloat(FY15),
      "FY-14": Number.parseFloat(FY14),
    })
  );
  return data;
};

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

const generateTable = (table, data) => {
  const format_01 = d3.format("($,.0f");
  const format_02 = d3.format("(.0%");
  for (let el of data) {
    let row = table.insertRow();
    for (key in el) {
      let cell = row.insertCell();
      if (typeof el[key] !== "number") {
        let text = document.createTextNode(`${el[key]}`);
        cell.appendChild(text);
      } else {
        if (el.name === "Gross Margin" || el.name === "Operating Margin") {
          let text = document.createTextNode(`${format_02(el[key])}`);
          cell.appendChild(text);
        } else {
          let text = document.createTextNode(`${format_01(el[key])}`);
          cell.appendChild(text);
        }
      }
    }
  }
};

const main = async () => {
  const data = await load();
  let table = document.querySelector("table");
  let headers = Object.keys(data[0]);
  generateTableHead(table, headers);
  generateTable(table, data);
};

main();
