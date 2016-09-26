function updateHistogram(selected) {
  var h = d3.select("#hist").select("#histogram");
  var g = d3.select("#hist");
  var offset = 10;

  var yScale = d3.scaleLinear().domain([maxOfList,0]).range([450,0]);
  var yScaleReverted = d3.scaleLinear().domain([maxOfList,0]).range([0,450]);
  var yaxis = d3.axisRight(yScaleReverted);

  h.selectAll("rect").data(selected).enter()
  .append("rect")
  .attr("x", function(d,i) {
    return i * (500/selected.length) + 20;
  })
  .attr("height", function(d){ return yScale(d[1]);})
  .attr("width", 20)
  .attr("y", 10)
  .attr("fill", function(d) {
    if(states[d[0]]) {
      if(checked)
        return chooseColor(d[0]);
      else
        return "deeppink";
    } else {
      return "gray";
    }
  })
  .attr("transform", "translate(20, 0)")
  .on("click", function(d) {
    states[d[0]] = (states[d[0]] ? false : true);
    render();
    updateHistogram(selected);
  });

  g.selectAll("text").data(selected).enter()
  .append("text")
  .attr("x", function(d,i) {
    return (i * (500/selected.length)) + 20;
  })
  .attr("y", function(d){ return 500 - offset - yScale(d[1])/2;})
  .text(function(d) { return d[0]; });


  //TRANSITIONS

  h.selectAll("rect").data(selected)
  .transition()
  .attr("x", function(d,i) {
    return i * (500/selected.length) + 20;
  })
  .attr("height", function(d){return yScale(d[1]);})
  .attr("width", 20)
  .attr("y", 10)
  .attr("fill", function(d) {
    if(states[d[0]]) {
      if(checked)
        return chooseColor(d[0]);
      else
        return "deeppink";
    } else {
      return "gray";
    }
  });

  g.selectAll("text").data(selected)
  .transition()
  .attr("x", function(d,i) {
    return (i * (500/selected.length)) + 20;
  })
  .attr("y", function(d){return 500 - offset - yScale(d[1])/2;})
  .text(function(d) { return d[0]; });

  g.append("g")
  .attr("id", "axis")
  .attr("width", 500)
  .attr("height", 500)
  .attr("transform", "translate(10,40)");

  g.select("#axis")
  .call(yaxis);
}
