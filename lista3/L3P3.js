
function timeTable() {
  var g = d3.select("#time").select("g");
  var h = d3.select("#time");

  var margin = 20;

  var dateFormat = d3.timeFormat("%b/%y");
  var dates = ["03/2014","04/2014","05/2014","06/2014","07/2014","08/2014","09/2014","10/2014","11/2014","12/2014"];

  var keys = [];

  var maxi = 0;
  var list = [];
  for(id in byType) {
    var t = [];
    var start = 0;
    keys.push(id);
    for(it in byType[id]) {
      t.push({x: start, y: byType[id][it] + margin});
      start += 50;
      maxi = Math.max(maxi, byType[id][it])
    }
    list.push(t);
  }
  console.log(byType);

  var scaleY = d3.scaleLinear().domain([0, maxi]).range([0, 400]);
  var scaleYReverted = d3.scaleLinear().domain([0, maxi]).range([400, 0]);
  var scaleX = d3.scaleLinear().domain([0,10]).range([0,400]);

  var xAxis = d3.axisLeft(scaleYReverted);
  h.append("g")
  .attr("transform", "translate(20, 30)")
  .call(xAxis);

  var yAxis = d3.axisBottom(scaleX);
  h.append("g")
  .attr("transform", "translate(20,435)")
  .call(yAxis);

  var lineFunction = d3.line()
  .x(function(d) { return d.x + margin; })
  .y(function(d) { return scaleY(d.y) + margin; });

  g.selectAll("path").data(list).enter()
  .append("path")
  .attr("class", "line")
  .attr("d", function(d) { return lineFunction(d); })
  .attr("stroke", function(d,i) { return scaleColor2(i); })
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .on("mouseover", function(d,i) {
    var position = d3.mouse(this);
    h.append("text")
    .attr("x", position[0])
    .attr("y", 500 - position[1])
    .text(keys[i]);
  })
  .on("mouseout", function() {
    h.selectAll("text").remove();
  });

}
