function showDetails() {
  var selected = {"Automóveis e outros": 0, "Ciclistas": 0, "Ciclomotores": 0, "Motocicletas": 0, "Pedestres": 0};

  var center = d3.geoCentroid(b);
  var offset = [width/2, height/2]
  var projection = d3.geoMercator().scale(scale).center(center).translate(offset);

  var path = d3.geoPath().projection(projection);

  var bounds  = path.bounds(b);
  var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
  var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
  scale   = (hscale < vscale) ? hscale : vscale;
  offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                    height - (bounds[0][1] + bounds[1][1])/2];

  projection = d3.geoMercator().center(center)
    .scale(scale).translate(offset);
  path = path.projection(projection);

  var info = allAccidents.map(e => e.properties);

  for(accident in info) {
    var proj = projection([info[accident]["longitude"], info[accident]["latitude"]]);

    /*
    OBSERVAÇÃO: Apenas considera como selecionado se o tipo de acidente estiver selecionado
    (considerando o checkbox da segunda questão).
    Ou seja, se não estiver e o cara selecionar um quadrado com dois acidentes
    e um desses acidentes for de um tipo que não está selecionado,
    ele só "verá" um acidente.
    Para desconsiderar isso, basta tirar a segunda condição do if abaixo
    */

    if(inside(proj[0], proj[1]) && states[info[accident]["tipo"]]) {
      selected[info[accident]["tipo"]] = 1 + selected[info[accident]["tipo"]];
    }
  }

  var counter = 0;

  console.log("ACCIDENTS IN SELECTION");
  for(i in selected) {
    counter += selected[i];
    console.log(i + " -> " + selected[i]);
  }

  if(counter > 0) {
    var helper = [];
    for(i in selected) {
      helper.push([i, selected[i]]);
    }
    updateHistogram(helper);
  }
  else
    updateHistogram(full);

}

function render() {
  var center = d3.geoCentroid(b);
  var offset = [width/2, height/2]
  scale = 150000;
  var projection = d3.geoMercator().scale(scale).center(center).translate(offset);

  var path = d3.geoPath().projection(projection);

  var bounds  = path.bounds(b);
  var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
  var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
  scale   = (hscale < vscale) ? hscale : vscale;
  offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                    height - (bounds[0][1] + bounds[1][1])/2];

  projection = d3.geoMercator().center(center)
    .scale(scale).translate(offset);
  path = path.projection(projection);

  svg.selectAll("path")
    .data(allBairros)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", "1");

  svg.selectAll("circle")
  .remove();

  svg.selectAll("circle")
    .data(allAccidents)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return projection(d.geometry.coordinates)[0];
    })
    .attr("cy", function(d) {
      return projection(d.geometry.coordinates)[1];
    })
    .attr("r", "3px")
    .attr("fill", function(d){
      if(states[d.properties.tipo]) {
        if(checked)
          return chooseColor(d.properties.tipo);
        else
          return "deeppink";
      } else {
        return "gray";
      }
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1");
}

function checkChanged() {
  checked = (checked ? false : true);
  updateHistogram(full);
  render();
}

function mouseFunctions() {
  d3.select("#map").on("mousedown", function() {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    initialMousePosition = d3.mouse(this);

  })
  .on("mousemove", function() {
    if(rightMouse) {
      d3.event.stopPropagation();
      d3.event.preventDefault();
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
          };

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

          s.attr("x", d.x)
          .attr("y", d.y)
          .attr("width", d.width)
          .attr("height", d.height)
          .attr("stroke", "gray")
          .attr("stroke-width", 2)
          .attr("fill-opacity", 0.0);
      }
    }
  })
  .on("mouseup", function(e) {
    if(rightMouse) {
      d3.event.stopPropagation();
      d3.event.preventDefault();
      var s = svg.select("rect");
      var d = {
          x       : parseInt( s.attr( "x"), 10),
          y       : parseInt( s.attr( "y"), 10),
          width   : parseInt( s.attr( "width"), 10),
          height  : parseInt( s.attr( "height"), 10)
      }
      organizePoints();
      showDetails();
      p = [0,0];
      p2 = [0,0];

      //end
      rightMouse = false;
      s.remove();
    }
  })
  .on("contextmenu", function(){
    d3.event.stopPropagation();
    d3.event.preventDefault();

    rightMouse = true;

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
  .on("wheel.zoom",function(d){
	    d3.event.stopPropagation();
	    d3.event.preventDefault();
	    /*if(d3.event.wheelDeltaY > 0)
    		scale *= 1.1;
    	else
    		scale *= 0.9;*/
    	//render();
	});
}

function init() {
  checked = false;
  mouseFunctions();
  readFiles();
}
