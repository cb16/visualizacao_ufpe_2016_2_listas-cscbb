var months = [true, true, true, true, true, true, true, true, true, true];
var monthToIndex = {"march":0, "april":1, "may":2, "june":3, "july":4, "august":5,
  "september":6, "october":7, "november":8, "december":9};

function monthSelection(name, value) {
  //console.log(name + " " + value);
  months[monthToIndex[name]] = value;
  timeTable();
}

function timeTable() {
  var g = d3.select("#time").select("g");
  var h = d3.select("#time");

  //clearing
  h.select("#firstAxis").remove();
  h.select("#secondAxis").remove();
  g.selectAll("path").remove();

  var margin = 20;

  var dateFormat = d3.timeFormat("%b/%y");
  var dates = ["03/2014","04/2014","05/2014","06/2014","07/2014","08/2014","09/2014","10/2014","11/2014","12/2014"];

  var keys = [];

  var ys = 0;
  var ticks = [];

  for(it in months) {
    if(months[it]) {
      ys += 1;
      ticks.push(dates[it]);
    }
  }


  var maxi = 0;
  var list = [];
  var start;

  for(id in byType) {
    var t = [];
    start = 0;
    keys.push(id);
    for(it in byType[id]) {
      if(months[it]) {
        //t.push({x: start, y: byType[id][it] + margin});
        t.push({x: dates[it], y: byType[id][it] + margin});
        start += 50;
        maxi = Math.max(maxi, byType[id][it])
      }
    }
    list.push(t);
  }
  //console.log(byType);

  var scaleY = d3.scaleLinear().domain([0, maxi]).range([0, 400]);
  var scaleYReverted = d3.scaleLinear().domain([0, maxi]).range([400, 0]);
  var scaleX = d3.scalePoint().domain(ticks).range([0,400]);
  var scaleXX = d3.scaleLinear().domain([0,ys-1]).range([0,400]);

  var xAxis = d3.axisRight(scaleYReverted);
  h.append("g")
  .attr("transform", "translate(20, 30)")
  .attr("id", "firstAxis")
  .call(xAxis);

  var yAxis = d3.axisBottom(scaleX);

  h.append("g")
  .attr("transform", "translate(20,435)")
  .attr("id", "secondAxis")
  .call(yAxis);

  var lineFunction = d3.line()
  .x(function(d) { return scaleX(d.x) + margin; })
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
    .attr("id", "subtitle")
    .attr("x", position[0])
    .attr("y", 500 - position[1])
    .text(keys[i]);
  })
  .on("mouseout", function() {
    h.selectAll("#subtitle").remove();
  });

}
