var DataCollection = Backbone.Collection.extend({
  days: function() {
    return _.map(this.get('dates'), function (d) {
      return new Date(d).toDateString();
    });
  },
  discomfortIndexes: function () {
    return _.map(this.models, function(model) {
      var T = model.get('temp_out'), RH = model.get('hum_out');
      return Math.round(( T-0.55*(1-0.01*RH)*(T-14.4) )* 100)/100;
    })
  }
});
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
  return _.unique(dates, true);
}

function avg(array) {
  return Math.round( (_.reduce(array, function(memo, num){
    return memo + num;
  }, 0) / array.length) *100 ) / 100;
};
function getDailyMetrics(array, date) {
 return {
   'date': date,
   'hum_out': avg(_.pluck(_.where(array, {'date':date}), 'hum_out')),
   'temp_out': avg(_.pluck(_.where(array, {'date':date}), 'temp_out'))
  }
}
function aggregateMetrics() {
  return _.map(dates, function(date) {
    return getDailyMetrics(raw, date);
  })
};
var dates = getUniqueDays();
var data = new DataCollection();
data.set(aggregateMetrics())

$(function () {
  $('#humidity').highcharts({
    chart: {
      backgroundColor: '#FAFAFA'
    },
    xAxis: {
      tickInterval: 3,
      categories: dates,
      labels: {
        formatter: function () {
          return new Date(this.value).toDateString();
        }
      }
    },
    yAxis: {
      gridLineColor: '#ddd',
      title: false,
      labels: {
        style:{
          fontFamily:'Helvetica-Neue, Helvetica, Arial, sans-serif',
          fontSize:'13px',
          color:'#777777'
        }
      },
    },
    title: { text: 'Discomfort Index' },
    plotOptions : {
      series : {
        shadow : false,
        color: "#796466",
        marker: {
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: 'red'
        },
        events: {
          mouseOut: function () {
            $('div.stats span.hum').text(0)
            $('div.stats span.date').text('')
            $('div.stats span.temp').text('')
          }
        }
      }
    },
    series: [{
      showInLegend: true,
      fillOpacity: 0.25,
      type: 'area' ,
      lineWidth:3,
      pointPadding: 50,
      marker: {
        lineWidth: 3,
        lineColor: '#47535E',
        fillColor: 'white',
        radius: 4
      },
      data: data.discomfortIndexes()
    }],
    tooltip: {
      style:{display: 'none'},
      formatter: function() {
        var model = data.where({date: this.x})[0];
        $('span.date').text(new Date(this.x).toDateString());
        $('span.hum').text(model.get('hum_out'));
        $('span.discomfort').text(this.y);
        $('span.temp').text(model.get('temp_out'));
      }
    },
    credits:{enabled:false}
  });
});
