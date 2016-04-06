var Markit = {};
  /**
   * Define the InteractiveChartApi.
   * First argument is symbol (string) for the quote. Examples: AAPL, MSFT, JNJ, GOOG.
   * Second argument is duration (int) for how many days of history to retrieve.
   */
  Markit.InteractiveChartApi = function(symbol,duration){
      this.symbol = symbol.toUpperCase();
      this.duration = duration;
      this.PlotChart();
  };

  Markit.InteractiveChartApi.prototype.PlotChart = function(){
      
      var params = {
          parameters: JSON.stringify( this.getInputParams() )
      }

      //Make JSON request for timeseries data
      $.ajax({
          beforeSend:function(){
              $("#highstock_chart").text("Loading chart...");
          },
          data: params,
          url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
          dataType: "jsonp",
          context: this,
          success: function(json){
              //Catch errors
              if (!json || json.Message){
                  console.error("Error: ", json.Message);
                  return;
              }
              this.render(json);
          },
          error: function(response,txtStatus){
              console.log(response,txtStatus)
          }
      });
  };

  //return the parameters of Interactive Chart API
  Markit.InteractiveChartApi.prototype.getInputParams = function(){
      return {  
          Normalized: false,
          NumberOfDays: this.duration,
          DataPeriod: "Day",
          Elements: [
              {
                  Symbol: this.symbol,
                  Type: "price",
                  Params: ["ohlc"]
              }
          ]
      }
  };

  Markit.InteractiveChartApi.prototype._fixDate = function(dateIn) {
      var dat = new Date(dateIn);
      return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
  };

  Markit.InteractiveChartApi.prototype._getOHLC = function(json) {
      var dates = json.Dates || [];
      var elements = json.Elements || [];
      var chartSeries = [];

      if (elements[0]){

          for (var i = 0, datLen = dates.length; i < datLen; i++) {
              var dat = this._fixDate( dates[i] );
              var pointData = [
                  dat,
                  elements[0].DataSeries['open'].values[i],
                  elements[0].DataSeries['high'].values[i],
                  elements[0].DataSeries['low'].values[i],
                  elements[0].DataSeries['close'].values[i]
              ];
              chartSeries.push( pointData );
          };
      }
      return chartSeries;
  };

  Markit.InteractiveChartApi.prototype.render = function(data) {
      var ohlc = this._getOHLC(data);

      // create the chart
      $('#highstock_chart').highcharts('StockChart', {
          
          rangeSelector: {
            buttons : [{
                    type : 'week',
                    count : 1,
                    text : '1w'
                }, {
                    type : 'month',
                    count : 1,
                    text : '1m'
                }, {
                    type : 'month',
                    count : 3,
                    text : '3m'
                }, {
                    type : 'month',
                    count : 6,
                    text : '6m'
                }, {
                    type : 'ytd',
                    count : 1,
                    text : 'YTD'
                }, {
                    type : 'year',
                    count : 1,
                    text : '1y'
                }, {
                    type : 'all',
                    count : 1,
                    text : 'All'
                }],
              selected: 0,
              // enabled: false
              inputEnabled : false
          },

          title: {
              text: this.symbol + ' Stock Value'
          },

          yAxis: [{
              title: {
                  text: 'Stock Value'
              }
          }],
          
          series: [{
              type: 'area',
              name: this.symbol,
              data: ohlc,
              tooltip: {
                    valueDecimals: 2
                },
                fillColor : {
                    linearGradient : {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops : [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                threshold: null
          
          }],

            // chart: {
            //   width:1090,
            //   height:500,
            //   zoomType: 'x',
            //   reflow: true
            // }


      });
  };
