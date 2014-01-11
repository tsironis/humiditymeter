var DataModel = Backbone.Model.extend({});
function getUniqueDays() {
  var dates = [], temp = [], hum = [], previous;
  _.each(raw, function(d) {
    if(d.date !== previous) {
      previous = d.date;
      dates.push(d.date);
    } else {
      return false;
    }
  });
  return _.unique(dates, true)
}

function aggregateMetrics(array, key) {
  var results = [];
  _.each(array, function(el) {
    console.log(el[key])
  })
};

var data = new DataModel({
  dates: getUniqueDays()
});
var hum = _.map(data, function(d) {
  return d.hum_out;
});
console.log(hum);
var temp = _.map(data, function(d) {
  return d.temp_out;
});



$(function () {
  $('#container').highcharts({
    chart: {
    },
    xAxis: {
      categories: getUniqueDays()
    },
    plotOptions: {
      series: {
        allowPointSelect: true
      }
    },
    series: [{
      data: hum
    }]
  });
});
