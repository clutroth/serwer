var ws;

function ws_init() {
	/** websocket **/
	ws = new WebSocket( wsUri );
	ws.onerror = function ( evt ) {
		console.log(" WebSocket error ");
		console.log( evt );
		
		document.location = 'connection_problem.html';
	};
	ws.onopen = function(evt) {
		console.log(" WebSocket connected ");
		
		// after connected - showing auth ui 
		if(window.location.hash == "#activate") {
			show_ui( "activate" );
		} else {
			show_ui( "auth" );
		}
	};
	ws.onmessage = function (evt) {
		console.log( evt.data );
	};
}

function ws_receive( handler ) {
	ws._onmessage = ws.onmessage; // do dopracowania (powinien sie tworzyc stos handlerow, kolumna, wieszak, kolumna wieszakow whatevah)
	ws.onmessage = handler;
}
function ws_received() {
	ws.onmessage = ws._onmessage; 
}
function ws_close() {
	ws.close();
	window.location = 'index.html';
}

var post_overall = 0;
var ws_wheel = function ( evt ) {
	data = JSON.parse( evt.data );
	
	if(data.event == "user_data") {
		$("#user_email").html( data.params.email );
	} else if ( data.event == "new_post" ) {
		if(post_overall == 6) { 
			$("blockquote[post-id]").first().remove();
		} else post_overall++;
		
		
		var id = data.params.post_id;
		
		if ($("blockquote[post-id=" + id + "]").length > 0) {
			console.log("Post already exists.");
		} else {
			var post = $("<blockquote></blockquote>");
			$( post ).attr("post-id", id);
			
			var post_entire = $("<div></div>");
			$( post_entire ).addClass( "media" );
			
			var user_img = $("<img>");
			$( user_img ).addClass( "pull-left media-object" ); 
			$( user_img ).attr("src", "...");
			
			var post_content = $("<div></div>");
			$( post_content ).addClass( "media-body" );
			
			var post_user = $("<h4></h4>");
			$( post_user ).addClass( "media-heading" );
			$( post_user ).html( data.params.user );
			
			$( post_content ).append( post_user );
			$( post_content ).append( data.params.text );
			
			$( post_entire ).append( post_content );
			
			$( post ).append( post_entire );
			
			$("#posts").append( post );
		}
	}	
	
	console.log(data);
}