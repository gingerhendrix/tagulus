
Utils.namespace("app.chart.line_settings");

app.chart.line_settings = function(data,chart){ 
  return [
    app.chart.data_settings(data, chart, function(){chart.reload()}),
    app.chart.chart_settings(chart)
  ];
}