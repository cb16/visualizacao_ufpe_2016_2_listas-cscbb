var svg = d3.select("svg").select("g");
var width = 600;
var height = 600;
var checked;
var p = [];
var p2 = [];
var rightMouse;
var scaleFactor = 1;

var allAccidents = [];
var allBairros = [];
var b = [];
var a = [];

function organizePoints() {
  var c;
  //p é o mais a esquerda mais acima na tela
  //p2 é o mais a direita mais abaixo na tela
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
}

function inside(x,y) {
  if(x < p[0] || x > p2[0]) return false;
  if(y < p[1] || y > p2[1]) return false;
  return true;
}

function showDetails() {
  var selected = {"Automóveis e outros": 0, "Ciclistas": 0, "Ciclomotores": 0, "Motocicletas": 0, "Pedestres": 0};

  var center = d3.geoCentroid(b);
  var offset = [width/2, height/2]
  var scale = 150000;
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
    if(inside(proj[0], proj[1])) {
      selected[info[accident]["tipo"]] = 1 + selected[info[accident]["tipo"]];
    }
  }

  console.log("ACCIDENTS IN SELECTION");
  for(i in selected) {
    console.log(i + " -> " + selected[i]);
  }

}

var colors = {"Automóveis e outros": 4, "Motocicletas": 3, "Ciclomotores": 2, "Ciclistas": 1, "Pedestres": 0};
var chooseColor = function(type) {
  var scale = d3.scaleLinear().domain([0,4]).range(["yellow", "red"]);
  return scale(colors[type]);
};

function render() {
  var center = d3.geoCentroid(b);
  var offset = [width/2, height/2]
  var scale = 150000;
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
      if(checked == true) {
        return chooseColor(d.properties.tipo);
      } else {
        return "deeppink";
      }
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1");
}

function checkChanged() {
  checked = (checked ? false : true);
  render();
}

function mouseFunctions() {
  d3.select("svg").on("mousemove", function() {
    if(rightMouse) {
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
	    if(d3.event.wheelDeltaY > 0)
    		scaleFactor *= 1.1;
    	else
    		scaleFactor *= 0.9;
    	renderDataset();
	});
}

function readFiles() {
  d3.json("bairros.geojson", function(bairros) {
    d3.json("acidentes-2014-11-novembro.geojson", function(acidentes) {
      allAccidents = acidentes.features;
      allBairros = bairros.features;
      b = bairros;
      a = acidentes;
      render();
    });
  });
}

function init() {
  checked = false;
  readFiles();
  render();
  mouseFunctions();

}
