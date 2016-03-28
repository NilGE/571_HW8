
//Build table
function tableBuild(obj){


  $('#stock_table_content').append('<tr><th>Name</th><td>'+obj.Name+'</td></tr>');

  $('#stock_table_content').append('<tr><th>Symbol</th><td>'+obj.Symbol+'</td></tr>');

  var price = Number(obj.LastPrice).toFixed(2);
  $('#stock_table_content').append('<tr><th>Last Price</th><td>'+price+'</td></tr>');

  var change = Number(obj.Change).toFixed(2);
  var changePercent = Number(obj.ChangePercent).toFixed(2);
  var color = change > 0? 'green':'red';
  var img = change > 0? 'img/up.png':'img/down.png';
  $('#stock_table_content').append('<tr><th>Change (Change Percent)</th>'
    +'<td style="color:'+color+'">'+change+' ( '+changePercent+'% ) '+'<img src="'+img+'">'+'</td></tr>');
  var time = new Date(obj.Timestamp);
  $('#stock_table_content').append('<tr><th>Time and Date</th><td>'+time.format('d F Y, h:i:s a')+'</td></tr>');
  var marketCapNum = Number(obj.MarketCap);
  var marketCap ='';
  if(marketCapNum > 1000000000) {
    marketCapNum /= 1000000000;
    marketCap += marketCapNum.toFixed(2) + ' Billion';
  }else if(marketCapNum > 1000000) {
    marketCapNum /= 1000000;
    marketCap += marketCapNum.toFixed(2) + '¸Million';
  } else {
    marketCap += marketCapNum.toFixed(2);
  }
  $('#stock_table_content').append('<tr><th>Market Cap</th><td>'+marketCap+'</td></tr>');
  var volume = obj.Volume;
  $('#stock_table_content').append('<tr><th>Volume</th><td>'+volume+'</td></tr>');
  var changeYTD = Number(obj.ChangeYTD).toFixed(2);
  var changePercentYTD = Number(obj.ChangePercentYTD).toFixed(2);
  color = changeYTD > 0?'green':'red';
  img = changeYTD > 0? 'img/up.png':'img/down.png';
  $('#stock_table_content').append('<tr><th>Change YTD (Change Percent YTD)</th>'
    +'<td style="color:'+color+'">'+changeYTD+' ( '+changePercentYTD+'% ) '+'<img src="'+img+'">'+'</td></tr>');
  var high = Number(obj.High).toFixed(2);
  $('#stock_table_content').append('<tr><th>High Price</th><td>$ '+high+'</td></tr>');
  var low = Number(obj.Low).toFixed(2);
  $('#stock_table_content').append('<tr><th>Low Price</th><td>$ '+low+'</td></tr>');
  var open = Number(obj.Open).toFixed(2);
  $('#stock_table_content').append('<tr><th>Opening Price</th><td>$ '+open+'</td></tr>');
  
  // http://chart.finance.yahoo.com/t?s=AAPL&lang=en-US&width=400&height=300

}

function stockChartBuild(val) {
  $('#stockChart').append('<img class="img-responsive" src="http://chart.finance.yahoo.com/t?s='+
    val+'&lang=en-US&width=400&height=300" width="500">');
}
            


$(document).ready(function(){
  $( "#name_symbol" ).autocomplete({
      // source: "php/autocomplete.php",
      // minLength:3

      source: function( request, response ) {
        $.ajax({
          url: "php/autocomplete.php",
          dataType: "json",
          data: {term: request.term},
              success: function(data) {
                  response($.map(data, function(item) {
                    return { label: item.Symbol + " - " +item.Name +" ("+item.Exchange+")",
                              value: item.Symbol
                    };
                  }));
              }
        });
      },
      minLength: 1,
      select: function(event, ui) {
      }
  });

  $('#quote_form').submit(function(event) {
      event.preventDefault();
      $.get(
        "php/backend.php",
        "symbol="+$("#name_symbol").val(), 
        function(data, status){
          var obj = jQuery.parseJSON(data);
          if(obj != null && obj.Status) {
            $(".carousel").carousel("next");
            tableBuild(obj);
            stockChartBuild($("#name_symbol").val());
          } else {
            $('#non_valid_prompt').text('Select a valid entry');
          }
      });
      dataType:"json";
  });

  $("#name_symbol").keypress(function(){
    $("#non_valid_prompt").text('');
  });

  $('.carousel').carousel({ 
      interval: false, //time iterval 2000ms
      wrap: false
  });
});
