  
//Build stock details table
function tableBuild(obj){
  $('#stock_table_content').empty();

  $('#stock_table_content').append('<tr><th>Name</th><td id="s_name">'+obj.Name+'</td></tr>');

  $('#stock_table_content').append('<tr><th>Symbol</th><td id="s_symbol">'+obj.Symbol+'</td></tr>');

  var price = Number(obj.LastPrice).toFixed(2);
  $('#stock_table_content').append('<tr><th>Last Price</th><td id="s_price">$ '+price+'</td></tr>');

  var change = Number(obj.Change).toFixed(2);
  var changePercent = Number(obj.ChangePercent).toFixed(2);
  var color = changePercent > 0? 'green':'red';
  var img = changePercent > 0? 'img/up.png':'img/down.png';
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
  color = changePercentYTD > 0?'green':'red';
  img = changePercentYTD > 0? 'img/up.png':'img/down.png';
  $('#stock_table_content').append('<tr><th>Change YTD (Change Percent YTD)</th>'
    +'<td style="color:'+color+'">'+changeYTD+' ( '+changePercentYTD+'% ) '+'<img src="'+img+'">'+'</td></tr>');


  var high = Number(obj.High).toFixed(2);
  $('#stock_table_content').append('<tr><th>High Price</th><td>$ '+high+'</td></tr>');


  var low = Number(obj.Low).toFixed(2);
  $('#stock_table_content').append('<tr><th>Low Price</th><td>$ '+low+'</td></tr>');


  var open = Number(obj.Open).toFixed(2);
  $('#stock_table_content').append('<tr><th>Opening Price</th><td>$ '+open+'</td></tr>');
}

//Yahoo Chart
function stockChartBuild(val) {
  $('#stockChart').empty();
  $('#stockChart').append('<img class="img-responsive" src="http://chart.finance.yahoo.com/t?s='+
    val+'&lang=en-US&width=400&height=300" width="500">');
}

//high stock chart
function highStockChartPlot(val) {
  var myMarkit = new Markit.InteractiveChartApi(val,1095);
  myMarkit.PlotChart();
}

//news feeds
function NewFeedsFormat(obj) {
  var results = obj.d.results;
  var content = '';
  for(var i in results) {
    content += '<div class="well">';
    content += '<a href="'+results[i].Url+'"">'+results[i].Title+'</a>';
    content += '<br><br>';
    content += '<div>'+results[i].Description+'</div>';
    content += '<br><br>';
    content += '<b>Publisher: '+results[i].Source+'</b>';
    content += '<br><br>';
    var time = new Date(results[i].Date);
    content += '<b>Date: '+time.format('d M Y H:i:s')+'</b>';
    content += '<br><br>';

    content += '</div>';
  }
  $('#news_feeds').empty();
  $('#news_feeds').append(content);
}

function getNewsFeeds(symbol) {
 $.get(
    "http://certain-mystery-126718.appspot.com/",
    "target="+symbol, 
    function(data, status){
      var obj = jQuery.parseJSON(data);
      NewFeedsFormat(obj);
  });
  dataType:"json";
}

//create all stock detials
function stockDetailBuild(symbol) {
  $.get(
    "http://certain-mystery-126718.appspot.com/",
    "symbol="+symbol, 
    function(data, status){
      var obj = jQuery.parseJSON(data);
      if(obj != null && obj.Status == "SUCCESS") {
        tableBuild(obj);
        stockChartBuild(symbol);
        highStockChartPlot(symbol);
        getNewsFeeds(symbol);
        if(localStorage.getItem(symbol)) {
          $('.glyphicon-star').addClass("favorite");
        } else {
          $('.glyphicon-star').removeClass("favorite");
        }
        $(".carousel").carousel("next");
      } else {
        $('#non_valid_prompt').text('Select a valid entry');
      }
  });
  dataType:"json";
}

//initial favorite table
function init_favor_table() {
  for(var i = 0;i < localStorage.length;i++) {
    var curr_symbol = localStorage.getItem(localStorage.key(i));
    $.get(
      "http://certain-mystery-126718.appspot.com/",
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
}

//add a row to favorite table
function add_favor_row(obj) {
  var row_content = '';
  row_content += '<tr id="'+obj.Symbol+'">';

  row_content += '<td><a href="#" onclick="stockDetailBuild(this.text)">'+obj.Symbol+'</a></td>';

  row_content += '<td>'+obj.Name+'</td>';

  var price = Number(obj.LastPrice).toFixed(2);
  row_content += '<td>$ '+price+'</td>';

  var change = Number(obj.Change).toFixed(2);
  var changePercent = Number(obj.ChangePercent).toFixed(2);
  var color = changePercent > 0? 'green':'red';
  var img = changePercent > 0? 'img/up.png':'img/down.png';
  row_content += '<td style="color:'+color+'"><span>'+change+' ( '+changePercent+'% )</span> '+'<img src="'+img+'">'+'</td>';

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
  row_content += '<td><button onclick="removeFavor(this)" type="button" class="btn default"><span class="glyphicon glyphicon-trash"></span></button></td>';
  row_content += '</tr>';
  $('#favor_list_content').append(row_content);
}

//remove a row from favorite table
function removeFavor(obj){
  var row_id = ""+obj.parentNode.parentNode.id;
  localStorage.removeItem(row_id);
  if($('#s_symbol').text() == row_id) {
    $('.glyphicon-star').removeClass("favorite");
  }
  $("#"+row_id).remove();
}
  
//refresh favortie table
function refreshFavorTable() {
  //refresh all the items in favorite list
  for(var i = 0;i < localStorage.length;i++) {
    var curr_symbol = localStorage.getItem(localStorage.key(i));
    $.get(
      "http://certain-mystery-126718.appspot.com/",
      "symbol="+curr_symbol, 
      function(data, status){ 
        var obj = jQuery.parseJSON(data);
        if(obj != null && obj.Status  == "SUCCESS") {
          var curr_symbol = obj.Symbol;
          var price = Number(obj.LastPrice).toFixed(2);
          $('#'+curr_symbol +' td:nth-child(3)').text('$ '+price);
          var change = Number(obj.Change).toFixed(2);
          var changePercent = Number(obj.ChangePercent).toFixed(2);
          var color = change > 0? 'green':'red';
          var img = change > 0? 'img/up.png':'img/down.png';
          $('#'+curr_symbol +' td:nth-child(4)').css('color', color);
          $('#'+curr_symbol +' td:nth-child(4) span').text(change+' ( '+changePercent+'% )');
          $('#'+curr_symbol +' td:nth-child(4) img').attr('src', img);
        } else {
          alert("Favorate add error");
        }
    });
  }
}

var timer_ID;

// start automatical refresh
function startAutoRefresh() {
  timer_ID = setInterval(function(){ refreshFavorTable() }, 5000);
}

// stop automatical refresh
function stopAutoRefresh() {
  clearInterval(timer_ID);
}

//Clear
function clear() {
  $('#name_symbol').val('');
  $('#slide_btn').addClass('disabled');
  $("#non_valid_prompt").text('');
}

//jquery
$(document).ready(function(){
  init_favor_table();

  // $('[data-toggle="tooltip"]').tooltip(); 

  //autocomplete
  $( "#name_symbol" ).autocomplete({
      // source: "php/autocomplete.php",
      // minLength:3

      source: function( request, response ) {
        $.ajax({
          url: "http://certain-mystery-126718.appspot.com/",
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

  //submit the form and show the stock details
  $('#quote_form').submit(function(event) {
      event.preventDefault();
      curr_symbol = $("#name_symbol").val();
      $('#non_valid_prompt').text('');
      $('#slide_btn').removeClass('disabled');
      stockDetailBuild(curr_symbol);
  });

  //clear input field
  $("#name_symbol").keypress(function(){
    $("#non_valid_prompt").text('');
  });

  //setting carousel animation
  $('.carousel').carousel({ 
      interval: false,
      wrap: false
  });

  //click favorite button
  $('#favor_btn').click(function(){
    var curr_symbol = $('#s_symbol').text();
    // $('.glyphicon-star').css("color","yellow");
    if($('.glyphicon-star').hasClass("favorite")) {
      $('.glyphicon-star').removeClass("favorite");
      localStorage.removeItem(curr_symbol);
      //remove a row
      $('#'+curr_symbol).remove();
    } else {
      $('.glyphicon-star').addClass("favorite");
      localStorage.setItem(curr_symbol, curr_symbol);
      //add a row
      $.get(
        "http://certain-mystery-126718.appspot.com/",
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

  //refresh toggle
  $('#toggleRefresh').change(function(){
    if($(this).prop('checked')) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  });

  //clear
  $('#clear_btn').click(function(){
    clear();
  });
});
