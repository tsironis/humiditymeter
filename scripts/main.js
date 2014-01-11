/* Humidity meter - a project for TEIPIR
 * Copyright (c) 2014 Dimitris Tsironis - MIT LICENSE
 */

/* Data collection to save and handle our metrics */
var DataCollection = Backbone.Collection.extend({
  /* Returns an array with formatted days */
  days: function() {
    return _.map(this.get('dates'), function (d) {
      return new Date(d).toDateString();
    });
  },
  /* Returns array with DI values */
  discomfortIndexes: function () {
    return _.map(this.models, function(model) {
      var T = model.get('temp_out'), RH = model.get('hum_out');
      return Math.round(( T-0.55*(1-0.01*RH)*(T-14.4) )* 100)/100;
    });
  }
});

/* Returns array with unique days */
function getUniqueDays() {
  var dates = [], previous;
  _.each(raw, function(d) {
    if(d.date !== previous) {
      previous = d.date;
      dates.push(d.date);
    }
  });
  return dates;
}

/* Average helper function */
function avg(array) {
  return Math.round((_.reduce(array, function(memo, num){
    return memo + num;
  }, 0) / array.length) * 100 ) / 100;
};

/* Calculates daily avg. for a specific date and metric */
function dailyAvg(date, key) {
  return avg(_.pluck(_.where(raw, {'date':date}), key))
}

/* Aggregates all daily metrics for all dates */
function aggregateMetrics() {
  return _.map(dates, function(date) {
    return {
     'date': date,
     'hum_out': dailyAvg(date, 'hum_out'),
     'temp_out': dailyAvg(date, 'temp_out')
    }
  })
};

/* Instantiates dates array and our data collection */
var dates = getUniqueDays();
var data = new DataCollection(aggregateMetrics());
