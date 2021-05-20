const load = async () => {
  const data = await d3.csv(
    'data.csv',
    ({ name, tag, children, FY20, FY19, FY18, FY17, FY16, FY15 }) => ({
      name: name,
      tag: tag,
      children: children,
      'FY-20': Number.parseFloat(FY20),
      'FY-19': Number.parseFloat(FY19),
      'FY-18': Number.parseFloat(FY18),
      'FY-17': Number.parseFloat(FY17),
      'FY-16': Number.parseFloat(FY16),
      'FY-15': Number.parseFloat(FY15),
    })
  );
  return data;
};

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  row.appendChild(document.createElement('th'));
  for (let key of data) {
    if (key !== 'tag' && key !== 'children') {
      let th = document.createElement('th');
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
};

const generateTable = (table, data) => {
  const format_01 = d3.format('($,.0f');
  let tbody = table.createTBody();
  for (let el of data) {
    let row = tbody.insertRow();
    row.classList.add(el.tag);
    let cell = row.insertCell();
    cell.innerHTML =
      (el.tag == 'level-01' || el.tag == 'level-02') && el.children == 'yes'
        ? "<i class='fa fa-caret-right'></i>"
        : '';
    if (el.children == 'yes') {
      cell.classList.add(`expand-${el.tag}`);
    }
    for (key in el) {
      if (key !== 'tag' && key !== 'children') {
        let cell = row.insertCell();
        if (typeof el[key] !== 'number') {
          let text = document.createTextNode(`${el[key]}`);
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
  let table = document.querySelector('table');
  let headers = Object.keys(data[0]);
  generateTableHead(table, headers);
  generateTable(table, data);
  $(document).ready(function () {
    $('.level-01').click(function () {
      if ($(this).next().css('visibility') == 'collapse') {
        $('.level-02').css({ visibility: 'visible', display: 'table-row' });
        $('.expand-level-01').html("<i class='fa fa-caret-down'></i>");
      } else {
        $('.level-02').css({ visibility: 'collapse', display: 'none' });
        $('.level-03').css({ visibility: 'collapse', display: 'none' });
        $('.expand-level-01').html("<i class='fa fa-caret-right'></i>");
      }
    });

    $('.level-02').click(function () {
      if ($(this).next().css('visibility') == 'collapse') {
        $(this)
          .nextUntil('.level-02')
          .css({ visibility: 'visible', display: 'table-row' });
        $(this)
          .find('.expand-level-02')
          .html("<i class='fa fa-caret-down'></i>");
      } else {
        $(this)
          .nextUntil('.level-01, .level-02')
          .css({ visibility: 'collapse', display: 'none' });
        $(this)
          .find('.expand-level-02')
          .html("<i class='fa fa-caret-right'></i>");
      }
    });
  });
};

main();
