function getMessages(friendName) {
  $.ajax({
    url: '/chat/' + friendName,
    type: 'GET',
    success: function(response) {
      const messages = response.messages;

      // Update friend name and profile image
      $('#friend').text(friendName);
      $('.dp').attr('src', "/image/" + friendName);
      $('.dp').attr('alt', friendName);

      const parent = $('.chat-container');
      parent.empty();

      if (messages) {
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const text = message['body'];
          const date = message['time'];
          const owner = message['sent_by'];

          // Create message box based on the owner
          const newMessage = $('<div class="message-box"></div>');
          if (owner === friendName) {
            newMessage.addClass('friend-message');
          } else {
            newMessage.addClass('my-message');
          }

          newMessage.append('<p>' + text + '<br><span>' + date + '</span></p>');
          parent.append(newMessage);
        }

        // Scroll to the bottom of the chat container
        const div = $('.chat-container');
        div.scrollTop(div[0].scrollHeight);
      }
    }
  });
}

function sendMessage(friendName) {
  const data = {
    'body': $('#message').val(),
    'sent_by': friendName
  };

  $.ajax({
    url: '/chat/' + $('#friend').text() + '/send',
    type: 'POST',
    data: data,
    success: function(response) {
      $('#message').val('');

      // Append the new message to the chat container
      const parent = $('.chat-container');
      const newMessage = $('<div class="message-box my-message"></div>');
      newMessage.append('<p>' + response.body + '<br><span>' + response.time + '</span></p>');
      parent.append(newMessage);

      // Scroll to the bottom of the chat container
      const div = $('.chat-container');
      div.scrollTop(div[0].scrollHeight);
    }
  });
}

$(document).ready(function() {
  const name = $('h6').text();

  $('.chat-box').click(function(event) {
    $('.right-container').css('display', 'block');
    getMessages($(this).find('#ffriend').text());

    let socket = io();
    let url = $(this).find('#ffriend').text() + '-' + name;
    socket.on(url, function(data) {
      if (data.sent_by === $('#friend').text()) {
        // Append the received message to the chat container
        const parent = $('.chat-container');
        const newMessage = $('<div class="message-box friend-message"></div>');
        newMessage.append('<p>' + data.body + '<br><span>' + data.time + '</span></p>');
        parent.append(newMessage);

        // Scroll to the bottom of the chat container
        const div = $('.chat-container');
        div.scrollTop(div[0].scrollHeight);
      }
    });
  });

  $("#send").click(function(event) {
    event.preventDefault();
    if ($('#message').val()) {
      sendMessage(name);
    } else {
      alert('Please type your message');
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

  $('.img-box').click(function() {
    window.location.href = '/profile/' + $(this).attr('alt');
  });

  $('#notif').click(function(event) {
    window.location.href = '/notifications';
  });

  $('#users').click(function(event) {
    window.location.href = '/users';
  });

  $('.right-container').css('display', 'none');
});
