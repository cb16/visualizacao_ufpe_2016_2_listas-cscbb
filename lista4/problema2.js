var margin = 30;
var horizontal = 140;
var vertical = 120;
var binWidth;
var side;
var info = [];
var maxInData;

function kde(numeros, amp, esq, dir, bins) {

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

  var extraMargin = 5;

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
  histogram([0,0,0.5,0.6,0.75,0.75,0.8,1],0,1,10);
}
