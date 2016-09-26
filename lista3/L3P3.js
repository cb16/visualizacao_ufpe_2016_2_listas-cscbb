
function timeTable() {
  var g = d3.select("#time").select("g");
  var h = d3.select("#time");

  var dateFormat = d3.timeFormat("%b/%y");
  var dates = ["03/2014","04/2014","05/2014","06/2014","07/2014","08/2014","09/2014","10/2014","11/2014","12/2014"];

  var offset = 5;
  var maxi = 0;
  var list = [];
  for(id in byType) {
    var t = [];
    var start = 0;
    for(it in byType[id]) {
      t.push({x: start, y: byType[id][it] + offset});
      start += 50;
      maxi = Math.max(maxi, byType[id][it])
    }
    list.push(t);
  }

  var scaleY = d3.scaleLinear().domain([5, maxi]).range([0, 450]);
  var scaleX = d3.scaleLinear().domain([dateFormat("03/2014"),dateFormat("12/2014")]).range([0,490]);

  var xAxis = d3.axisLeft(scaleY);
  g.append("g")
  .attr("class", "y axis")
  .call(xAxis);

  var yAxis = d3.axisBottom(scaleX);
  g.append("g")
  .attr("class", "x axis")
  .call(yAxis);

  var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return scaleY(d.y); });

  g.selectAll("path").data(list).enter()
  .append("path")
  .attr("class", "line")
  .attr("d", function(d) { return lineFunction(d); })
  .attr("stroke", function(d,i) { return scaleColor2(i); })
  .attr("stroke-width", 2)
  .attr("fill", "none");

}
