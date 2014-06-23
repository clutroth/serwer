/** Server absolute URI without / at the end **/
var wsUri = "wss://10.12.4.156:81/"
var ws = false;

$(document).ready(function() {
	ws_init();
	
	/** form handling **/
	$( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		var data = $( this ).serialize();
		var method = $(this).attr("method");
		
		ws.send( method + "?" + data );
		
		if( method == "login" ) {
			ws_receive( function ( data ) {
				console.log(" Received: " + data.data );
			
				data = JSON.parse( data.data );
				if(data['ok']) { 
					show_ui("dashboard");
				} else {
					$("#log_error").html(data['error']);
				}
				
				// nested (wow!), authenticated callback
				ws_receive( ws_wheel ); 
			});			
		} else if ( method == "register" ) {
			ws_receive( function ( data ) {
				console.log(" Received: " + data.data );
			
				data = JSON.parse( data.data );
				if(data['ok']) {
					show_ui("activate");
					document.location = document.location + "#activate"; 
				} else {
					$("#reg_error").html(data['error']);
				}
			});
		} else if ( method == "post" ) {
			$("#post_input").val("");
		}
		
		console.log(" WebSocket Form Submitted ");
	});
	
});


/** ui.js **/
function show_ui( section_name ) {
	$("div[element]").hide();
	$("div[element=" + section_name + "]").show();
}