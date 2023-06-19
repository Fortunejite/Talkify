function get_messages(name, code) {
  $.ajax({
    url: '/chat/' + name,
    type: 'GET',
    success: function(response) {
      const messages = response.messages;
      if ($(window).width() > 800) {                                                                                                                                             $('.right-container').css('opacity', 0);                                                                                                                                $('.right-container').html(code);                                                                                                                                    }
      $('#friend').text(name)

      $('.dp').attr('src', "/image/"+name);
      $('.dp').attr('alt', name);

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
      }
      if ($(window).width() < 800) {
        $('.right-container').css('display', 'block');
        $('.left-container').css('display', 'none');
      } else {
        $('.right-container').css('opacity', 1);
      }
      $("#send").click(sendClick);
      $('#back').click(backClick);
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
    function sendClick (event) {
    event.preventDefault();
    if ($('#message').val()) {
      send_message($('h6').text();)
    } else{
      alert('Pls type your message');
    }
}

function backClick() {
    if ($(window).width() < 800) {
      // Execute code for small screens
      $('.right-container').css('display', 'none');
      $('.left-container').css('display', 'block');
    } else {
      // Execute code for larger screens
      $('.right-container').empty();
      $('.right-container').append('<h2>Click on a friend to chat</h2>');
    }
}
  const name = $('h6').text();
  const codes = $('.right-container').html();
  if ($(window).width() > 800) {
    $('.right-container').empty();
    $('.right-container').append('<h2>Click on a friend to chat</h2>');
  }

  
  
  $('.chat-box').click(function (event) {
    if ($(window).width() < 800) {
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
    } else {
      $('.right-container').empty();
      get_messages($(this).find('#ffriend').text(), codes)
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
    }
  });

  $('.user-img').click(function() {
    window.location.href = '/profile/' + $('h6').text();
  });

  $('img-box').click(function() {
    window.location.href = '/profile/' + $(this).attr('alt');
  });

  $('#notif').click(function(event) {
    window.location.href = '/notifications';
  });

  $('#users').click(function(event){
    window.location.href = '/users';
  });

});
