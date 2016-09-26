var svg = d3.select("#map").select("g");
var width = 600;
var height = 600;
var checked;
var p = [];
var p2 = [];
var rightMouse;

var state = "idle";

var maxOfList = 0;

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

function makeFull() {
  var info = allAccidents.map(e => e.properties);
  var helper = {"Automóveis e outros": 0, "Ciclistas": 0, "Ciclomotores": 0, "Motocicletas": 0, "Pedestres": 0};

  for(accident in info) {
    helper[info[accident]["tipo"]] = 1 + helper[info[accident]["tipo"]];
  }

  for(i in helper) {
    full.push([i, helper[i]]);
  }

  maxOfList = d3.max(full, function(d) { return d[1]; });
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

var colors = {"Automóveis e outros": 4, "Motocicletas": 3, "Ciclomotores": 2, "Ciclistas": 1, "Pedestres": 0};
var chooseColor = function(type) {
  var scaleColor = d3.scaleLinear().domain([0,4]).range(["yellow", "red"]);
  return scaleColor(colors[type]);
};

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
