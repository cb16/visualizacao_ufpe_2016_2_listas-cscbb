function getMinimum() {
  column = document.getElementById("column").value;
  species = document.getElementById("species").value;
  spe = species;
  var filteredBySpecies = iris.filter(function(value) {
    return value.Species == species;
  });
  var mini = filteredBySpecies.reduce(function(pre, cur){
    return (pre[column] < cur[column] ? pre : cur);
  });
  console.log("Mini: " + mini[column]);
  d3.select("p").text(mini[column]);
};

function getAverage() {
  var species = document.getElementById("species").value.split(" ");
  var column = document.getElementById("column").value;
  var filteredBySpecies = iris.filter(function(value) {
    return species.indexOf(value.Species) != -1;
  });
  var sum = filteredBySpecies.reduce(function(pre, cur) {
    return pre + cur[column];
  }, 0);
  var average = sum / filteredBySpecies.length;
  d3.select("p").text(average);
}

function getMaximumNotIn() {
  var species = document.getElementById("species").value.split(" ");
  var column = document.getElementById("column").value;
  var filteredBySpecies = iris.filter(function(value){
    return species.indexOf(value.Species) == -1;
  });
  var maxi = filteredBySpecies.reduce(function(pre, cur){
    return (pre[column] > cur[column] ? pre : cur);
  });
  d3.select("p").text(maxi[column]);
}
