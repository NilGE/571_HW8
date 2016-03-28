
//Build table
function tableBuild(obj){
  $('#stock_table_content').empty();

  $('#stock_table_content').append('<tr><th>Name</th><td id="s_name">'+obj.Name+'</td></tr>');

  $('#stock_table_content').append('<tr><th>Symbol</th><td id="s_symbol">'+obj.Symbol+'</td></tr>');

  var price = Number(obj.LastPrice).toFixed(2);
  $('#stock_table_content').append('<tr><th>Last Price</th><td id="s_price">$ '+price+'</td></tr>');

  var change = Number(obj.Change).toFixed(2);
  var changePercent = Number(obj.ChangePercent).toFixed(2);
  var color = change > 0? 'green':'red';
  var img = change > 0? 'img/up.png':'img/down.png';
  $('#stock_table_content').append('<tr><th>Change (Change Percent)</th>'
    +'<td style="color:'+color+'"><span id="s_change">'+change+' ( '+changePercent+'% )</span> '+'<img src="'+img+'">'+'</td></tr>');


  var time = new Date(obj.Timestamp);
  $('#stock_table_content').append('<tr><th>Time and Date</th><td>'+time.format('d F Y, h:i:s a')+'</td></tr>');


  var marketCapNum = Number(obj.MarketCap);
  var marketCap ='';
  if(marketCapNum > 1000000000) {
    marketCapNum /= 1000000000;
    marketCap += marketCapNum.toFixed(2) + ' Billion';
  }else if(marketCapNum > 1000000) {
    marketCapNum /= 1000000;
    marketCap += marketCapNum.toFixed(2) + ' Million';
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
}

function stockChartBuild(val) {
  $('#stockChart').empty();
  $('#stockChart').append('<img class="img-responsive" src="http://chart.finance.yahoo.com/t?s='+
    val+'&lang=en-US&width=400&height=300" width="500">');
}

function add_favor_row(obj) {
  var row_content = '';
  row_content += '<tr id="'+obj.Symbol+'">';

  row_content += '<td><a href="#">'+obj.Symbol+'</a></td>';

  row_content += '<td>'+obj.Name+'</td>';

  var price = Number(obj.LastPrice).toFixed(2);
  row_content += '<td>$ '+price+'</td>';

  var change = Number(obj.Change).toFixed(2);
  var changePercent = Number(obj.ChangePercent).toFixed(2);
  var color = change > 0? 'green':'red';
  var img = change > 0? 'img/up.png':'img/down.png';
  row_content += '<td style="color:'+color+'"><span id="s_change">'+change+' ( '+changePercent+'% )</span> '+'<img src="'+img+'">'+'</td>';

  var marketCapNum = Number(obj.MarketCap);
  var marketCap ='';
  if(marketCapNum > 1000000000) {
    marketCapNum /= 1000000000;
    marketCap += marketCapNum.toFixed(2) + ' Billion';
  }else if(marketCapNum > 1000000) {
    marketCapNum /= 1000000;
    marketCap += marketCapNum.toFixed(2) + ' Million';
  } else {
    marketCap += marketCapNum.toFixed(2);
  }
  row_content += '<td>'+marketCap+'</td>';

  //delete the row
  row_content += '<td><button type="button" class="btn default"><span class="glyphicon glyphicon-trash"></span></button></td>';
  row_content += '</tr>';
  $('#favor_list_content').append(row_content);
}
      
function refreshFavorTable(val) {
  //refresh all the items in favorite list
  $('#favor_list_content').clear();
  alert(localStorage.length);
  for(var i = 0;i < localStorage.length;i++) {
    var curr_symbol = localStorage.getItem(localStorage.key(i));
    $.get(
      "php/backend.php",
      "symbol="+curr_symbol, 
      function(data, status){ 
        var obj = jQuery.parseJSON(data);
        if(obj != null && obj.Status  == "SUCCESS") {
          $(".carousel").carousel("next");
          tableBuild(obj);
          stockChartBuild($("#name_symbol").val());
        } else {
          alert("Favorate add error");
        }
    });
  }
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
          if(obj != null && obj.Status == "SUCCESS") {
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
      interval: false,
      wrap: false
  });

  $('#favor_btn').click(function(){
    // $('.glyphicon-star').css("color","yellow");
    if($('.glyphicon-star').hasClass("favorite")) {
      $('.glyphicon-star').removeClass("favorite");
      localStorage.removeItem($('#s_symbol').text());
      //remove a row
      
    } else {
      $('.glyphicon-star').addClass("favorite");
      var curr_symbol = $('#s_symbol').text();
      localStorage.setItem(curr_symbol, curr_symbol);
      //add a row
      $.get(
        "php/backend.php",
        "symbol="+curr_symbol, 
        function(data, status){ 
          var obj = jQuery.parseJSON(data);
          if(obj != null && obj.Status  == "SUCCESS") {
            add_favor_row(obj);
          } else {
            alert("Favorate add error");
          }
      });
    }
  });
});
