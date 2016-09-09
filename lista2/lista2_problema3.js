/*
CONSIDERAÇÕES:
  O retângulo não aparece... ou seja o usuário faz o movimento,
  mas não está vendo o retângulo.
  O que é usado é o ponto inicial no mousedown e o ponto final no mouseup.
*/

//Width and height
var margin = {top: 10, right: 20, bottom: 10, left: 20};
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var p = [0,0];
var p2 = [0,0];

//
var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[0]; })])
    .range([0, width]);
//
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
.range([height,0]);

//
var rScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
.range([5,8]);

//
var cScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
.range(["gray","red"]);


function changeColor() {
  var c;

  if(p2[0] < p[0]) {
    c = p2[0];
    p2[0] = p[0];
    p[0] = c;
  }
  if(p2[1] < p[1]) {
    c = p2[1];
    p2[1] = p[1];
    p[1] = c;
  }

  renderDataset();
  //console.log("all points organized " + rpx + " " + rpy + " " + ipx + " " + ipy);

//  svg.select("#circles").selectAll("circle").data(dataset).exit().remove();

  /*circleSelection = svg.select("#circles").selectAll("circle").data(dataset);

  for(a in circleSelection) {
    var circle = circleSelection[a];
    console.log("test " + circle.cx);
    svg.select("#circles")
    .append("circle")
    .attr("cx", function() {
        return xScale(circle.cx);
    })
    .attr("cy", function() {
        return yScale(circle.cy);
    })
    .attr("r", 2)
    .attr("fill", function(){
        if(circle.cx > ipx && circle.cx < rpx && circle.cy > ipy && circle.cy < rpy) {
          return "red";
        } else {
          return "blue"
        };
    })
    .attr("fill-opacity", 0.2);
  }*/
}

function renderDataset(){

    //
    var xAxis = d3.axisBottom(xScale).ticks(6);
    var xAxisGroup = d3.select("#xAxis")
	.transition()
	.call(xAxis);

    //
    var yAxis = d3.axisLeft(yScale).ticks(6);
    var yAxisGroup = d3.select("#yAxis").transition().call(yAxis);

    //
    var circleSelection = svg.select("#circles").selectAll("circle")
	.data(dataset);

    //Remove circles that are not needed
    circleSelection
	.exit()
	.attr("fill","rgba(255, 255, 255, 0)")
	.remove();

    //Create circles
    circleSelection
	.enter()
	.append("circle")
	.attr("cx", function(d) {
	    return xScale(d[0]);
	})
	.attr("cy", function(d) {
	    return yScale(d[1]);
	})
	.attr("r", function(d) {
	    return 2;
	})
	.attr("fill", function(d){
      if(d[0] > p[0] && d[0] < p2[0] && d[1] > p[1] && d[1] < p2[1]){
        return "red";
      }
	    return "black";
	})
  .attr("fill-opacity", 0.5);

    //
    circleSelection
        //.transition()
	// .delay(function(d,i){return 100*i;})
	// .duration(1000)
	.attr("cx", function(d) {
	    return xScale(d[0]);
	})
	.attr("cy", function(d) {
	    return yScale(d[1]);
	})
	.attr("r", function(d) {
	    return 2;
	})
	.attr("fill", function(d){
      if(xScale(d[0]) > p[0] && xScale(d[0]) < p2[0] && yScale(d[1]) > p[1] && yScale(d[1]) < p2[1]){
        return "red";
      }
	    return "black";
	})
  .attr("fill-opacity", 0.5);

}


function init(){
    //create clickable paragraph
    d3.select("body")
	.append("p")
	.text("Click on me!")
	.on("click", function() {
	    renderDataset();
	});

    //Create SVG element
  var crudeSVG = d3.select("body")
	.append("svg");

  var svg = crudeSVG
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .on("mousedown", function() {
      console.log("mousedown");
      p = d3.mouse( this);
      svg.selectAll("rect").remove();

      svg.append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("x", p[0])
      .attr("y", p[1])
      .attr("width", 0)
      .attr("height", 0);
  })
  .on( "mousemove", function() {
    //  console.log("mouse move");
      var s = svg.select("rect");

      if(!s.empty()) {
          p2 = d3.mouse( this),

              d = {
                  x       : parseInt( s.attr( "x"), 10),
                  y       : parseInt( s.attr( "y"), 10),
                  width   : parseInt( s.attr( "width"), 10),
                  height  : parseInt( s.attr( "height"), 10)
              },
              move = {
                  x : p2[0] - d.x,
                  y : p2[1] - d.y
              }
          ;

          if( move.x < 1 || (move.x*2<d.width)) {
              d.x = p2[0];
              d.width -= move.x;
          } else {
              d.width = move.x;
          }

          if( move.y < 1 || (move.y*2<d.height)) {
              d.y = p2[1];
              d.height -= move.y;
          } else {
              d.height = move.y;
          }

          s.attr(d);
          //console.log( d);
      }
  })
  .on( "mouseup", function() {
      console.log("mouse up");
      var s = svg.select("rect");
      var d = {
          x       : parseInt( s.attr( "x"), 10),
          y       : parseInt( s.attr( "y"), 10),
          width   : parseInt( s.attr( "width"), 10),
          height  : parseInt( s.attr( "height"), 10)
      }
      changeColor();
      p = [0,0];
      p2 = [0,0];
      s.remove();
  })
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //
    var circlesGroup = svg.append("g").attr("id","circles");

    //
    svg.append("g").attr("id","xAxis").attr("transform","translate(0," + (height - margin.bottom) + ")").attr("class", "g-main");
    svg.append("g").attr("id","yAxis").attr("transform","translate(" + (margin.left) + ",0)").attr("class", "g-main");


    return svg;
}

//
var svg = init();
