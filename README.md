humiditymeter
=============

This is a project that I created for university envinronmental lab. The initial dataset was an Excel file that contained all the data records for every 30 mins for September 2008. As you imagine, that's quite a lot of data.

I converted the Excel file to CSV, then converted the CSV to JSON in order to be able to use it in Javascript.

## What's under the hood

The setup here's pretty minimal; Backbone for data storage and some data formatting, Highcharts to generate the charts from the data and some Javascript functions that aggregate data into meaningful metrics. Also, the functions are doing heavy use of Underscore.js.

## Check the code

The code is free, under MIT license. You can browse around, it's quite clear and documented. If you have any problems, open an issue [here](https://github.com/tsironis/humiditymeter/issues).
