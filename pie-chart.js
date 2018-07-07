const formatData = data => {
  const total = d3.sum(data.map(item => item.value));
  return data.sort((a, b) => {
    if (a.value < b.value) {
      return 1;
    } else if (a.value > b.value) {
      return -1;
    } else {
      return 0;
    }
  }).map(item => ({
    ...item,
    value: item.value / total * 360,
  }));
};

const pointAlongCircumference = (radius, origin, d) => {
  const radians = d * Math.PI / 180;
  return {
    x: origin.x + radius * Math.cos(radians),
    y: origin.y + radius * Math.sin(radians),
  };
};

const donutify = (svg, center, innerRadius) => {
  svg.append('circle')
    .attr('class', 'donut')
    .attr('cx', center.x)
    .attr('cy', center.y)
    .attr('r', innerRadius);
};

function charts() {
  const radius = 200;
  const svg = d3.select('#chart');
  const data = formatData(fruit);
  const center = { x: 300, y: 300 }; // based on viewBox: 0 0 600 600
  const top = {
    x: center.x,
    y: center.y - radius,
  };

  let accumulatedValue = 0,
    greaterThanHalf,
    p1 = top,
    p2;

  data.forEach(slice => {
    accumulatedValue += slice.value;
    greaterThanHalf = slice.value > 180 ? 1 : 0;
    p2 = pointAlongCircumference(radius, center, 270 - accumulatedValue);

    let arc = svg.append('path');
    arc.attr('class','arc')
      .attr('fill',slice.color)
      .on('mouseover', () => { arc.attr('fill', slice.hoverColor) })
      .on('mouseout', () => { arc.attr('fill', slice.color) })
      .attr('d',`
        M ${center.x} ${center.y}
        L ${p1.x} ${p1.y}
        A ${radius} ${radius} 0 ${greaterThanHalf} 0 ${p2.x} ${p2.y}
        L ${center.x} ${center.y}
      `);

    p1 = p2;
  })

  donutify(svg, center, 100)
}
