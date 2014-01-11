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
  var dates = [], previous;
  _.each(raw, function(d) {
    if(d.date !== previous) {
      previous = d.date;
      dates.push(d.date);
    } else {
      return false;
    }
  });
  return dates;
}
function avg(array) {
  return Math.round((_.reduce(array, function(memo, num){
    return memo + num;
  }, 0) / array.length) * 100 ) / 100;
};
function dailyAvg(date, key) {
  return avg(_.pluck(_.where(raw, {'date':date}), key))
}
function getDailyMetrics(date) {
 return {
   'date': date,
   'hum_out': dailyAvg(date, 'hum_out'),
   'temp_out': dailyAvg(date, 'temp_out')
  }
}
function aggregateMetrics() {
  return _.map(dates, function(date) {
    return getDailyMetrics(date);
  })
};
var dates = getUniqueDays();
var data = new DataCollection(aggregateMetrics());

