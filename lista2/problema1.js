function piechart(probabilities, colors) {
  var lastAngle = 0;
  d3.select("g").selectAll("path").exit().remove();
  var angles = []
  for(data in probabilities) {
    var newLast = (Math.PI * (probabilities[data]*100 * 3.6)) / 180;
    angles[data] = {startAngle: lastAngle, endAngle: lastAngle + newLast};
    lastAngle = lastAngle + newLast;
  }

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100);

  d3.select("g").selectAll("path").data(angles).enter()
  .append("path")
  .attr("d", function(d) { return arc(d); })
  .attr("fill", function(d, i) {
    return colors[i];
  })
  .attr("transform", "translate(100,100)");

}
