var margin = 30;
var horizontal = 140;
var vertical = 120;
var binWidth;
var side;
var info = [];
var maxInData;
var kdeValues = [];
var n = 0;
var extraMargin = 5;

function gaus(u) {
  return (1.0 / Math.sqrt(2*Math.PI))*Math.pow(Math.E, (-0.5)*Math.pow(u,2));
}

function calculate(value, amp, numeros) {
  var calc = 1/(n*amp);
  var soma = 0;
  for(i in numeros) {
    var v = numeros[i];
    soma += gaus((value - v) / amp);
  }
  return calc*soma;
}

function kde(numeros, amp, esq, dir, bins) {
  n = numeros.length;
  var maxY = 0;

  for(i in numeros) {
    kdeValues.push({'x': numeros[i], 'y': calculate(numeros[i], amp, numeros)});
  }

  for(i in kdeValues) {
    maxY = Math.max(maxY, kdeValues[i].y);
  }
  //console.log(kdeValues);

  var xScale = d3.scaleLinear().domain([esq, dir]).range([0, horizontal]);
  var yScale = d3.scaleLinear().domain([0, maxY]).range([0, vertical]);
  var yScaleReverted = d3.scaleLinear().domain([0, maxY]).range([vertical, 0]);

  var g = d3.select("#kde");
  var s = d3.select("#kdesvg");

  //clear
  g.selectAll("path").remove();
  s.select("#xAxis2").remove();
  s.select("#yAxis2").remove();

  var xAxis2 = d3.axisBottom().scale(xScale);
  s.append("g")
  .attr("id", "xAxis")
  .attr("transform", "translate(30, 170)")
  .call(xAxis2);

  var yAxis2 = d3.axisLeft().scale(yScaleReverted);
  s.append("g")
  .attr("id", "yAxis")
  .attr("transform", "translate(25,45)")
  .call(yAxis2);

  var lineFunction = d3.line()
  .curve(d3.curveBasis)
  .x(function(d) {
    return xScale(d.x) + margin;
  })
  .y(function(d) {
    return yScale(d.y) + margin;
  });

  g.append("path")
  .attr("d", lineFunction(kdeValues))
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("fill", "none");

  g.selectAll("line").data(numeros).enter()
  .append("line")
  .attr("x1", function(d) {
    return xScale(d) + margin;
  })
  .attr("y1", margin)
  .attr("x2", function(d) {
    return xScale(d) + margin;
  })
  .attr("y2", margin + extraMargin)
  .attr("stroke", "blue")
  .attr("stroke-width", 1);

}

function histogram(numeros, esq, dir, bins) {
  binWidth = horizontal / bins;
  side = (dir - esq) / bins;
  var xPosition = 0;
  var maxInData = 0;

  for(var bin = 0; bin < bins; bin++) {
    info.push([xPosition,0]);
    xPosition += side;
  }

  for(index in numeros) {
    var num = numeros[index];
    for(i in info) {
      var pair = info[i];
      if((num >= pair[0] && num < (pair[0] + side))|| (i == bins - 1)) {
        pair[1] += 1;
        maxInData = Math.max(maxInData, pair[1]);
        info[i] = pair;
        break;
      }
    }
  }
  //console.log(info);

  //plot histogram

  var g = d3.select("#hist");
  var s = d3.select("#histsvg");

  //clear
  g.selectAll("rect").remove();
  g.selectAll("line").remove();
  s.select("#xAxis").remove();
  s.select("#yAxis").remove();

  var xScale = d3.scaleLinear().domain([esq, dir]).range([0, horizontal]);
  var yScale = d3.scaleLinear().domain([0, maxInData]).range([0, vertical]);
  var yScaleReverted = d3.scaleLinear().domain([0, maxInData]).range([vertical, 0]);

  var xAxis = d3.axisBottom().scale(xScale);
  s.append("g")
  .attr("id", "xAxis")
  .attr("transform", "translate(30, 170)")
  .call(xAxis);

  var yAxis = d3.axisLeft().scale(yScaleReverted);
  s.append("g")
  .attr("id", "yAxis")
  .attr("transform", "translate(25,45)")
  .call(yAxis);

  g.selectAll("rect").data(info).enter()
  .append("rect")
  .attr("x", function(d) {
    return xScale(d[0]) + margin;
  })
  .attr("y", function(d) {
    return margin + extraMargin;
  })
  .attr("width", function(d) {
    return binWidth;
  })
  .attr("height", function(d) {
    return yScale(d[1]);
  })
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("fill", "none");

  g.selectAll("line").data(numeros).enter()
  .append("line")
  .attr("x1", function(d) {
    return xScale(d) + margin;
  })
  .attr("y1", margin)
  .attr("x2", function(d) {
    return xScale(d) + margin;
  })
  .attr("y2", margin + extraMargin)
  .attr("stroke", "blue")
  .attr("stroke-width", 1);

}

function init() {
  bandWidth = 0.15;
  histogram([0,0,0.5,0.6,0.75,0.75,0.8,1],0,1,10);
  kde([0,0,0.5,0.6,0.75,0.75,0.8,1],bandWidth,0,1,10)
}
