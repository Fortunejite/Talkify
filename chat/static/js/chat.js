function get_messages(name) {
  $.ajax({
    url: '/chat/' + name,
    type: 'GET',
    success: function(response) {
      const messages = response.messages;
      $('#friend').text(name)
      const parent = $('.chat-container')
      parent.empty();
      if (messages) {
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const text = message['body'];
          const date = message['time'];
          const owner = message['sent_by'];
          
          if (owner == name) {
            const new_message = $('<div class="message-box friend-message"></div>')
            new_message.append('<p>' + text + '<br><span>' + date + '</span></p>');
            parent.append(new_message)
          } else {
            const new_message = $('<div class="message-box my-message"></div>')
            new_message.append('<p>' + text + '<br><span>' + date + '</span></p>');
            parent.append(new_message)
          }
        }
        const div = $('.chat-container');
        div.scrollTop(div[0].scrollHeight)
      }
    }
  });
}

function send_message (name) {
  const data = {
    'body': $('#message').val(),
    'time': '10:40AM',
    'sent_by': name
  };
  $.ajax ({
    url: '/chat/' + $('#friend').text() + '/send',
    type: 'POST',
    data: data,
    success: function() {
      $('#message').val('')
      const parent = $('.chat-container')
      const new_message = $('<div class="message-box my-message"></div>')
      new_message.append('<p>' + data.body + '<br><span>' + data.time + '</span></p>');
      parent.append(new_message)
      const div = $('.chat-container');
      div.scrollTop(div[0].scrollHeight)

    }

  })
}

$(document).ready(function() {
  const name = $('h6').text();
  
  $('.chat-box').click(function (event) {
    $('.right-container').css('display', 'block');
    get_messages($(this).find('#ffriend').text())
  });

  $("#send").click( function(event) {
    event.preventDefault();
    if ($('#message').val()) {
      send_message(name)
    } else{
      alert('Pls type your message');
    }
  }


  );

  $('.right-container').css('display','none')

});