
Utils.namespace("app.chart.pie_settings");

app.chart.pie_settings =  function(data, chart){
  return [
    app.chart.data_settings(data, chart, function(){chart.reload()}),
    app.chart.chart_settings(chart)
  ];
}
