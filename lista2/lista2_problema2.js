//Width and height
var margin = {top: 10, right: 20, bottom: 10, left: 20};
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//
var generator  = d3.randomUniform(0, 1);
var colorScale = colorbrewer.Paired[12];
//
var dataset = [];
var angles = [];

function updateDataset(){

    var numPoints = 5;
    var newDataset = Array.apply(null, Array(numPoints)).map(function() { return generator(); });
    var totalSum = d3.sum(newDataset);
    newDataset =  newDataset.map(function(d){return d/totalSum;});

    dataset = newDataset;
}

function pieChart(probabilities, colors){
    //Codigo do problema 1
    var lastAngle = 0;
    d3.select("g").selectAll("path").exit().remove();
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

function renderDataset(){
    //Codigo para fazer insercao/remocao/update de elementos
    //em algum momento voce provavelmente vai querer chamar algo como:
    //                                      pieChart(dataset,colorScale.slice(0,5))
    pieChart(dataset, colorScale.slice(0,5));
    //console.log("h");
    var colors = colorScale.slice(0,5);
    var lastAngle = 0;
    var arcs = [];

    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    d3.select("g").selectAll("path").exit().remove();

    d3.select("g").selectAll("path").data(angles)
    .transition()
    .duration(1000)
    .attr("class", "arc")
    .attrTween("d", function(d) {
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      }
    })
    .attr("fill", function(d, i) {
      return colors[i];
    })
    .attr("transform", "translate(100,100)");
}

function init(){
    //create clickable paragraph
    d3.select("body")
	.append("p")
	.text("Click on me!")
	.on("click", function() {
	    updateDataset();
	    renderDataset();
	});

    //Create SVG element
    var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
}

//
var svg = init();
