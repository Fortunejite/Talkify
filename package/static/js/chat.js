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
    'sent_by': name
  };
  $.ajax ({
    url: '/chat/' + $('#friend').text() + '/send',
    type: 'POST',
    data: data,
    success: function(response) {
      $('#message').val('')
      const parent = $('.chat-container')
      const new_message = $('<div class="message-box my-message"></div>')
      new_message.append('<p>' + response.body + '<br><span>' + response.time + '</span></p>');
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
    let socket = io();
    let url = $(this).find('#ffriend').text() + '-' + name;
    socket.on(url, function(data){
      if (data['sent_by'] == $('#friend').text()) {
        const parent = $('.chat-container')
        const new_message = $('<div class="message-box friend-message"></div>')
        new_message.append('<p>' + data['body'] + '<br><span>' + data['time'] + '</span></p>');
        parent.append(new_message)
        const div = $('.chat-container');
        div.scrollTop(div[0].scrollHeight)
      }
    });
  });

  $("#send").click( function(event) {
    event.preventDefault();
    if ($('#message').val()) {
      send_message(name)
    } else{
      alert('Pls type your message');
    }
  });

  $('#posts').click(function() {
    $.ajax({
      url: '/logout',
      type: 'POST',
      success: function(response) {
        // Handle successful logout
        alert('Logout successful');
        window.location.href = '/';
      }
    });
  });

  $('.user-img').click(function() {
    window.location.href = '/profile/' + $('h6').text();
  });

  $('img-box').click(function() {
    window.location.href = '/profile/' + $(this).siblings('h4').text();
  });

  $('#notif').click(function(event) {
    window.location.href = '/notifications';
  });

  $('#user').click(function(event){
    window.location.href = '/users';
  });

  

  $('.right-container').css('display','none')

});