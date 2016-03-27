

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
          if(obj.Status) {
            alert("success");
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
  });
});
