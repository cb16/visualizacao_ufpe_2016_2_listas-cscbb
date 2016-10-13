var data = [];
var allData = [];
var parties = [];
var width = 2000;
var height = 2000;

var stratify = d3.stratify().id(function(d) { return d.Candidato; }).parentId(function(d) { return d.Partido; });
var treemap = d3.treemap().size([width, height]).padding(1).round(true);

function getParties() {
  for(entry in data) {
    var party = data[entry].Partido;
    if(parties.indexOf(party) == -1) {
      parties.push(party);
    }
  }
  parties.pop();
  parSize = parties.length
}

var parSize = 0;

var color = function(p) {
  var scaleColor = d3.scaleLinear().domain([0,parSize]).range(["blue","red"]);
  return scaleColor(parties.indexOf(p));
}

function organizeData() {
  getParties();
  var used = [];
  allData.push({"Candidato": "Partido", "Partido": ""});
  for(party in parties) {
    if(parties[party] != undefined && used.indexOf(parties[party]) == -1){
      used.push(parties[party])
      allData.push({"Candidato": parties[party], "Partido": "Partido"});
    }
  }
  for(entry in data) {
    if(entry == data.length-1)
      break;
    allData.push(data[entry]);
  }
}

function makeTreemap() {
  //d3.csv("cand_sample.csv", function(error, d) {
  d3.csv("cand_ver_recife_2016.csv", function(error, d) {
    if(error) throw error;
    data = d;
    organizeData();

    var root = stratify(allData)
    .sum(function(d) { return d.Votos; });
    //console.log("root");
    //console.log(root);

    treemap(root);

    d3.select("#g")
    .selectAll(".partido")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "partido")
    .attr("title", function(d) {
      return d.id;
    })
    .attr("x", function(d) {
      return d.x0;
    })
    .attr("y", function(d) {
      return d.y0;
    })
    .attr("width", function(d) {
      return d.x1 - d.x0;
    })
    .attr("height", function(d) {
      return d.y1 - d.y0;
    })
    .attr("fill", function(d) {
      var realColor;
      while (d.depth > 1) {
        if(parties.indexOf(d.parent.id) != -1) {
          realColor = color(d.parent.id);
        }
        d = d.parent;
      }
      return realColor;
    })
    .on('mouseover', function(d) {
      d3.select("#g")
      .append("text")
      .attr("class", "names")
      .attr("x", function() {
        return d.x0 + 5;
      })
      .attr("y", function() {
        return d.y0 + 15;
      })
      .attr("fill", "white")
      .text(function() {
        return d.id + " - " + d.parent.id;
      })
    })
    .on('mouseout', function() {
      d3.selectAll(".names").remove();
    });

  });
}

function init() {
  makeTreemap();
}
