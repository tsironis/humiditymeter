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
    title: { text: '' },
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
            $('div.stats span.hum').text(0);
            $('div.stats span.temp').text(0);
            $('div.stats span.discomfort').text(0);
            $('div.stats span.date').text('');
            $('div.stats i').hide();
          }
        }
      }
    },
    series: [{
      showInLegend: true,
      name: 'Discomfort Index',
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
        $('.tip').hide();
        var model = data.where({date: this.x})[0];
        $('span.date').text(new Date(this.x).toDateString());
        $('span.hum').text(model.get('hum_out'));
        $('span.discomfort').text(this.y);
        $('span.temp').text(model.get('temp_out'));
        $('.stats i').hide();
        if(this.y < 21) {
          $('i.fa-smile-o').show()
        } else if(this.y === 21 || this.y < 24) {
          $('i.fa-meh-o').show()
        } else {
          $('i.fa-frown-o').show()
        }
      }
    },
    credits:{enabled:false}
  });
});
