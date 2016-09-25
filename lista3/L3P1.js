var svg = d3.select("#map").select("g");
var width = 600;
var height = 600;
var checked;
var p = [];
var p2 = [];
var rightMouse;

var state = "idle";

var full = [];
var scale = 150000;

var states = {"Automóveis e outros": true, "Ciclistas": true, "Ciclomotores": true, "Motocicletas": true, "Pedestres": true};

var scaleColor2 = d3.scaleLinear().domain([0,7]).range(["yellow", "red"]);

var monthly = [];
var all = [];
var byType = [];

var initialMousePosition = [];

var allAccidents = [];
var allBairros = [];
var b = [];
var a = [];

function parseType(tipo) {
  if(tipo == "Automóveis e outros" || tipo == "Automóveis" || tipo == "Outros") return "Automóveis e outros";
  if(tipo == "Motocicleta" || tipo == "Motocicletas" || tipo == "Ciclomotores"
    || tipo == "Motos e Ciclomotores" || tipo == "Moto e Ciclomotor")
      return "Moto(s) e Ciclomotor(es)";
  if(tipo == "Atropelamentos") return "Atropelamentos";
  if(tipo == "Ciclistas" || tipo == "Cicliestas") return "Ciclistas";
  if(tipo == "Pedestres" || tipo == "Pedestre") return "Pedestre(s)";
  if(tipo == "Ciclistas e Pedestres" || tipo == "Ciclistas e pedestre" || tipo == "Pedestres e ciclista")
    return "Ciclista(s) e Pedestre(s)";
  if(tipo == "Colisões") return "Colisões";
  return "ERRO";
}

function generateMonthly() {
  all = all.map(e => e.features);

  byType = {"Automóveis e outros" : [0,0,0,0,0,0,0,0,0,0], "Ciclistas" : [0,0,0,0,0,0,0,0,0,0],
    "Colisões" : [0,0,0,0,0,0,0,0,0,0], "Moto(s) e Ciclomotor(es)" : [0,0,0,0,0,0,0,0,0,0], "Pedestre(s)" : [0,0,0,0,0,0,0,0,0,0],
    "Atropelamentos" : [0,0,0,0,0,0,0,0,0,0], "Ciclista(s) e Pedestre(s)": [0,0,0,0,0,0,0,0,0,0]};

  for(it in all) {
    monthly[it] = {};
    var item = all[it];
    for(each in item) {
      var tipo = parseType(item[each].properties.tipo);

      //if(tipo == "ERRO") console.log("erro: " + item[each].properties.tipo);
      //else console.log("tipo " + tipo);

      byType[tipo][it] += 1;

      if(tipo in monthly[it]) {
        monthly[it][tipo] = 1 + monthly[it][tipo];
      } else {
        monthly[it][tipo] = 1;
      }
    }
  }
}

function timeTable() {
  var g = d3.select("#time").select("g");
  var h = d3.select("#time");

  var dateFormat = d3.timeFormat("%b-%y");
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
  var scaleX = d3.scaleLinear().domain(["03/2014","12/2014"]).range([0,490]);

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

function makeFull() {
  var info = allAccidents.map(e => e.properties);
  var helper = {"Automóveis e outros": 0, "Ciclistas": 0, "Ciclomotores": 0, "Motocicletas": 0, "Pedestres": 0};

  for(accident in info) {
    helper[info[accident]["tipo"]] = 1 + helper[info[accident]["tipo"]];
  }

  for(i in helper) {
    full.push([i, helper[i]]);
  }
}

function updateHistogram(selected) {
  var h = d3.select("#histogram").select("g");
  var g = d3.select("#histogram");

  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", 500)
  .attr("width", 500)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 5);

  h.selectAll("rect").data(selected).enter()
  .append("rect")
  .attr("x", function(d,i) {
    return i * (500/selected.length) + 20;
  })
  .attr("height", function(d){return d[1] * 5;})
  .attr("width", 20)
  .attr("y", 0)
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
  .attr("y", function(d){return 500 - (d[1] * 5)/2;})
  .text(function(d) { return d[0]; });

  h.selectAll("rect").data(selected)
  .transition()
  .attr("x", function(d,i) {
    return i * (500/selected.length) + 20;
  })
  .attr("height", function(d){return d[1] * 5;})
  .attr("width", 20)
  .attr("y", 0)
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
  .attr("y", function(d){return 500 - (d[1] * 5)/2;})
  .text(function(d) { return d[0]; });
}

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

var colors = {"Automóveis e outros": 4, "Motocicletas": 3, "Ciclomotores": 2, "Ciclistas": 1, "Pedestres": 0};
var chooseColor = function(type) {
  var scaleColor = d3.scaleLinear().domain([0,4]).range(["yellow", "red"]);
  return scaleColor(colors[type]);
};

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

function readFiles() {
  d3.json("bairros.geojson", function(bairros) {
    d3.json("acidentes-2014-11-novembro.geojson", function(acidentes) {
      allAccidents = acidentes.features;
      allBairros = bairros.features;
      b = bairros;
      a = acidentes;
      makeFull();
      render();
      updateHistogram(full);
    });
  });
  //reading all files
  d3.json("acidentes-2014-03-marco.geojson", function(marco) {
    all.push(marco);
    d3.json("acidentes-2014-abril.geojson", function(abril) {
      all.push(abril);
      d3.json("acidentes-2014-05-maio.geojson", function(maio) {
        all.push(maio);
        d3.json("acidentes-2014-junho.geojson", function(junho) {
          all.push(junho);
          d3.json("acidentes-2014-07-julho.geojson", function(julho) {
            all.push(julho);
            d3.json("acidentes-2014-agosto.geojson", function(agosto) {
              all.push(agosto);
              d3.json("acidentes-2014-09-setembro.geojson", function(setembro) {
                all.push(setembro);
                d3.json("acidentes-2014-10-outubro.geojson", function(outubro) {
                  all.push(outubro);
                  d3.json("acidentes-2014-11-novembro.geojson", function(novembro) {
                    all.push(novembro);
                    d3.json("acidentes-2014-dezembro.geojson", function(dezembro) {
                      all.push(dezembro);
                      generateMonthly();
                      timeTable();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function init() {
  checked = false;
  readFiles();
  mouseFunctions();

}
