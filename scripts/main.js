var DataModel = Backbone.Model.extend({
  days: function() {
    return _.map(this.get('dates'), function (d) {
      return new Date(d).toDateString();
    });
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
  return _.reduce(array, function(memo, num){
    return memo + num;
  }, 0) / array.length;
};
function getDailyMetrics(array, date) {
 return _.pluck(_.where(array, {'date':date}), 'hum_out');
}
function aggregateMetrics(key) {
  return _.map(data.get('dates'), function(date) {
    return avg(getDailyMetrics(raw, date, key));
  })
};

var data = new DataModel({
  dates: getUniqueDays()
});
data.set({hum_out:  aggregateMetrics('hum_out'),
          temp_out: aggregateMetrics('temp_out')})

$(function () {
  $('#container').highcharts({
    chart: {
      backgroundColor: '#FAFAFA'
    },
    xAxis: {
      tickInterval: 3,
      categories: data.days()
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
    title: { text: null },
    plotOptions : {
        series : {
            shadow : false,
            color: "#7fbcd8",
            marker: {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: 'red'
            }
        }
    },
    series: [{
      name: 'Humidity',
      showInLegend: true,
      fillOpacity: 0.25,
      type: 'area' ,
      lineWidth:3,
      pointPadding: 50,
      marker: {
          lineWidth: 3,
          lineColor: '#7fbcd8',
          fillColor: 'white',
          radius: 4
      },
      data: data.get('hum_out')
    }],
    tooltip: {
        borderWidth: 0,
        backgroundColor:"rgba(0,0,0,0.7)",
        borderRadius: 3,
        shadow: false,
        crosshairs:true,
        style:{
            textShadow: "none",
            color:"#ffffff",
            fontFamily: 'Helvetica-Neue, Helvetica, Arial, sans-serif'
        },
        formatter: function() {
            var tooltip = '<b>'+this.x+'</b><br/>';
            tooltip += this.y;

            return tooltip;
        }
    },
    credits:{enabled:false}
  });
});
