function scatterplot() {
  var c1 = document.getElementById("col1").value;
  var c2 = document.getElementById("col2").value;
  console.log("cols= " + c1 + " " + c2);
  var svg = d3.select("g");
  var size = 400;
  svg.append("line")
  .attr("x1", 20)
  .attr("y1", 10)
  .attr("x2",20)
  .attr("y2", size+40)
  .attr("stroke-width", 5)
  .attr("stroke", "black");
  svg.append("line")
  .attr("x1", 10)
  .attr("y1", 20)
  .attr("x2",size+40)
  .attr("y2", 20)
  .attr("stroke-width", 5)
  .attr("stroke", "black");

  var colors = {"setosa": "red", "versicolor": "yellow", "virginica": "green"};

  var maxCol1 = iris.map(c => c[c1]).reduce(function(pre, cur){return (pre > cur ? pre : cur)},0);
  var maxCol2 = iris.map(c => c[c2]).reduce(function(pre, cur){return (pre > cur ? pre : cur)},0);

  svg.append("line")
  .attr("x1", 10)
  .attr("y1", size + 20)
  .attr("x2", 30)
  .attr("y2", size + 20)
  .attr("stroke-width", 5)
  .attr("stroke", "black");

  svg.append("line")
  .attr("x1", size + 20)
  .attr("y1", 10)
  .attr("x2", size + 20)
  .attr("y2", 30)
  .attr("stroke-width", 5)
  .attr("stroke", "black");

  console.log("max in col1 -> " + maxCol1);
  console.log("max in col2 -> " + maxCol2);

  svg.selectAll("circle").data(iris).remove();

  svg.selectAll("circle").data(iris).enter().append("circle")
  .attr("cx", function(d){
    return ((400*d[c1]) / maxCol1) + 20;
  })
  .attr("cy", function(d){
    return ((400*d[c2]) / maxCol2) + 20;
  })
  .attr("r", 5)
  .attr("fill", function(d){
    return colors[d["Species"]];
  })
  .attr("stroke", "black")
  .attr("stroke-width", "1");

}
