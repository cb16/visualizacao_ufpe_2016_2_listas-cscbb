var data = [];
var allData = [];
var parties = [];
var width = 600;
var height = 600;

var stratify = d3.stratify().id(function(d) { return d.Candidato; }).parentId(function(d) { return d.Partido; });
var treemap = d3.treemap().size([width, height]).padding(1).round(true);

function getParties() {
  for(entry in data) {
    var party = data[entry].Partido;
    if(!(party in parties)) {
      parties.push(party);
    }
  }
}

var partyColors = d3.scaleLinear().domain(parties).range(["yellow", "red"]);

var color = function(p) {
  return partyColors(p);
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
  d3.csv("cand_sample.csv", function(error, d) {
    if(error) throw error;
    data = d;
    organizeData();

    var root = stratify(allData)
    .sum(function(d) { return d.Votos ? 1 : 0 })
    .sort(function(a,b) { return b.height - a.height || b.value - a.value; });
    //console.log("root");
    //console.log(root);

    treemap(root);

    d3.select("body")
    .selectAll(".node")
    .data(root.leaves())
    .enter().append("div")
      .attr("class", "node")
      .attr("title", function(d) { return d.id; })
      .style("left", function(d) { return d.x0 + "px"; })
      .style("top", function(d) { return d.y0 + "px"; })
      .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      .style("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.parent); })
    .append("div")
      .attr("class", "node-label")
      .text(function(d) { return d.id; });

  });
  //data = d3.csvParse()
}

function init() {
  makeTreemap();
}
