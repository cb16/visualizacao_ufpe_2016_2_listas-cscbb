function piechart(probabilities, colors) {
  var dataset = probabilities;
  var lastAngle = 0;
  var arcs = [];
  d3.select("svg").selectAll("path").exit().remove();

  for(data in dataset) {
    var newLast = (Math.PI * (dataset[data] * 3.6)) / 180;
    var arc = d3.arc()
      .innerRadius(40)
      .outerRadius(60)
      .startAngle(lastAngle)
      .endAngle(lastAngle + newLast);
    lastAngle = lastAngle + newLast;
    arcs.push(arc);
  }
  d3.select("svg").selectAll("path").data(arcs).enter()
  .append("path")
  .attr("d", function(d) { return d(); })
  .attr("fill", function(d, i) {
    return colors[i];
  })
  .attr("transform", "translate(100,100)");

}
