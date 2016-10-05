data = {};
var year = "2015";
var temp = "med";
var x = 50;
var margin = 20;
var xGrowth = 50;
var boxWidth = 20;
var maxData;
var minData;

var s = d3.select("#boxes");

function readEntrys() {
  for(i in nbWeather) {
    var entry = nbWeather[i];
    var key1 = [entry.Year, "max"];
    var key2 = [entry.Year, "min"];
    var key3 = [entry.Year, "med"];
    if(!(key1 in data)) {
      data[key1] = {};
      data[key2] = {};
      data[key3] = {};
    }
    var month = entry.Month
    if(!(month in data[key1])) {
      data[key1][month] = [];
      data[key2][month] = [];
      data[key3][month] = [];
    }
    data[key1][month].push(entry.MaxTempF);
    data[key2][month].push(entry.MinTempF);
    data[key3][month].push(entry.MeanTempF);
  }
  //console.log(data);
}

function boxplot(y,t) {
  var using = data[[y,t]];
  var values = [];
  for(each in using) {
    values.push(makeData(using[each]));
  }
  plotbox(values);
}

function plotbox(list) {
	x = 50;
  maxData = 0;
  minData = 1000000;

	for(var it in list) {
  	maxData = Math.max(maxData, list[it].maximum);
		minData = Math.min(minData, list[it].minimum);
	}
	console.log(maxData + " " + minData);

	//clear all
	d3.select("#axis").remove();

	//start plot

	yScale = d3.scaleLinear().domain([minData, maxData]).range([0,400]);
	yScaleReverted = d3.scaleLinear().domain([minData, maxData]).range([400,0]);

	var yAxis = d3.axisRight().scale(yScaleReverted);
	d3.select("svg")
	.append("g")
	.attr("id", "axis")
	.attr("transform", "translate(0,80)")
	.call(yAxis);

	//plotting

	//MINIMUM
	s.selectAll(".minimum").data(list).enter()
	.append("line")
	.attr("id", ".minimum")
	.attr("x1", function(d) { return d.xStart; })
	.attr("y1", function(d) { return yScale(d.minimum) + margin; })
	.attr("x2", function(d) { return d.xEnd; })
	.attr("y2", function(d) { return yScale(d.minimum) + margin;})
	.attr("stroke", "black")
	.attr("stroke-width", 2);

	//MAXIMUM
	s.selectAll(".maximum").data(list).enter()
	.append("line")
	.attr("id", ".maximum")
	.attr("x1", function(d) { return d.xStart; })
	.attr("y1", function(d) { return yScale(d.maximum) + margin; })
	.attr("x2", function(d) { return d.xEnd; })
	.attr("y2", function(d) { return yScale(d.maximum) + margin;})
	.attr("stroke", "black")
	.attr("stroke-width", 2);

	//BOX
	s.selectAll(".box").data(list).enter()
	.append("rect")
	.attr("x", function(d) { return d.xStart; })
	.attr("y", function(d) { return yScale(d.firstQuartile) + margin;})
	.attr("width", boxWidth)
	.attr("height", function(d) { return yScale(d.thirdQuartile) - yScale(d.firstQuartile); })
	.attr("stroke", "black")
	.attr("stroke-width", 2)
	.attr("fill", "none");

	//MEDIAN
	s.selectAll(".median").data(list).enter()
	.append("line")
	.attr("id", ".median")
	.attr("x1", function(d) { return d.xStart; })
	.attr("y1", function(d) { return yScale(d.median) + margin; })
	.attr("x2", function(d) { return d.xEnd; })
	.attr("y2", function(d) { return yScale(d.median) + margin;})
	.attr("stroke", "black")
	.attr("stroke-width", 2);

	//dotted lines
	s.selectAll(".bottomDotted").data(list).enter()
	.append("line")
	.attr("id", ".bottomDotted")
	.attr("x1", function(d) { return d.xStart + (boxWidth/2.0); })
	.attr("y1", function(d) { return yScale(d.minimum) + margin; })
	.attr("x2", function(d) { return d.xStart + (boxWidth/2.0); })
	.attr("y2", function(d) { return yScale(d.firstQuartile) + margin;})
	.attr("stroke", "black")
	.attr("stroke-dasharray", "5,5")
	.attr("stroke-width", 2);

	s.selectAll(".topDotted").data(list).enter()
	.append("line")
	.attr("id", ".topDotted")
	.attr("x1", function(d) { return d.xStart + (boxWidth/2.0); })
	.attr("y1", function(d) { return yScale(d.thirdQuartile) + margin; })
	.attr("x2", function(d) { return d.xStart + (boxWidth/2.0); })
	.attr("y2", function(d) { return yScale(d.maximum) + margin;})
	.attr("stroke", "black")
	.attr("stroke-dasharray", "5,5")
	.attr("stroke-width", 2);

}


function makeData(info) {
	var sorted = info.sort();
	var size = sorted.length;
	var median;
	if((size/2)%2)
		median = sorted[Math.floor(size/2.0)];
	else
		median = (sorted[(size/2) - 1] + sorted[size/2]) / 2.0;
	var minimum = d3.min(sorted);
	var maximum = d3.max(sorted);
	var firstQuartile = sorted[Math.floor(size/4)];
	var thirdQuartile = sorted[Math.floor(3*size/4)];
	var d = {
		"median": median,
		"minimum": minimum,
		"maximum": maximum,
		"firstQuartile": firstQuartile,
		"thirdQuartile": thirdQuartile,
		"xStart": x,
		"xEnd": x + boxWidth
	};
	x += xGrowth;
	return d;
}

function init() {
  readEntrys();
  boxplot("2015", "med");
}
