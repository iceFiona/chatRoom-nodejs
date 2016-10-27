function divEscapedContentElement(message){
	return $('<div></div>').text(message);
}

function divSystemContentElement(message){
	return $('<div></div>').html('<li>'+message+'</li>');
}

function processUserInput(chatApp,socket){
	var message = $('#send-message').val();
	var systemMessage;
	if(message.charAt(0) == '/'){
		systemMessage = chatApp.processCommand(message);
		if(systemMessage){
			$('#message').append(divSystemContentElement(systemMessage))
		}
	}else{
		chatApp.sendMessage($('#room').text(),message);
		$('#messages').append(divEscapedContentElement(message))
		$('#messages').scrollTop($('#messages').prop('scrollHeight'))
	}
	$('#send-message').val('')
}

var socket = io.connect();
$(document).ready(function($) {
		var chatApp = new Chat(socket);
		socket.on('nameResult',function(result){
			var message;
			if(result.success){
				message = '你已改名为'+resule.name
			}else{
				message = resule.message;
			}
			$('#messages').append(divSystemContentElement(message))
		});
		socket.on('joinResult',function(result){
			$('#room').text(result.room);
			$('#messages').append(divSystemContentElement('房间已变更'))
		})
		socket.on('message',function(message){
			var newEmement = $('<div></div>').text(message.text);
			$('#messages').append(newEmement)
		})
		socket.on('rooms',function(rooms){
			$('#room-list').empty();
			for(var room in rooms){
				if(room != ''){
					$('#room-list').append(divEscapedContentElement(room))
				}
			}
			$('#room-list div').click(function(event) {
				chatApp.processCommand('/join'+$(this).text());
				$('#send-message').focus();
			});
		})

		setInterval(function(){
			socket.emit('room');
		},1000);

		$('#send-message').focus();

		$('#send-form').submit(function(event) {
			processUserInput(chatApp,socket);
			return false;
		});
});