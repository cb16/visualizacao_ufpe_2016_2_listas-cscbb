var svg = d3.select("svg").select("g");
var width = 600;
var height = 600;
var checked;

var colorScale = colorbrewer.Paired[6].slice(0,5);
var chooseColor = function(type) {
  var ind = 0;
  if(type == "Ciclomotores") ind = 1;
  else if(type == "Ciclistas") ind = 2;
  else if(type == "Pedestres") ind = 3;
  else if(type == "Automóveis e outros") ind = 4;
  return colorScale[ind];
};

function render() {
  d3.json("bairros.geojson", function(bairros) {
    d3.json("acidentes-2014-11-novembro.geojson", function(acidentes) {
      var center = d3.geoCentroid(bairros);
      var offset = [width/2, height/2]
      var scale = 150000;
      var projection = d3.geoMercator().scale(scale).center(center).translate(offset);

      var path = d3.geoPath().projection(projection);

      var bounds  = path.bounds(bairros);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      scale   = (hscale < vscale) ? hscale : vscale;
      offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                        height - (bounds[0][1] + bounds[1][1])/2];

      projection = d3.geoMercator().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);

      svg.selectAll("path")
        .data(bairros.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "cornflowerblue")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

      svg.selectAll("circle")
      .remove();

      svg.selectAll("circle")
        .data(acidentes.features)
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
    });

  });
}

function checkChanged() {
  checked = (checked ? false : true);
  render();
}

function init() {
  checked = false;
  render();
}
