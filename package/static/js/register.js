function createUser() {
    // Create form data object
    const formData = new FormData();
    formData.append('username', $('#name2').val());
    formData.append('email', $('#email').val());
    formData.append('password', $('#pass2').val());
    formData.append('image', $('#file')[0].files[0]);
  
    // Send create user request
    $.ajax({
      url: '/register',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        alert(response.message);
        $('#up').show();
        $('#loadingSpinner').hide();
        if (response.redirect) {
          window.location.href = response.redirect;
        }
      },
      error: function(xhr) {
        const response = JSON.parse(xhr.responseText);
        alert(response.message);
        $('#up').show();
        $('#loadingSpinner').hide();
        if (response.redirect) {
          window.location.href = response.redirect;
        }
      }
    });
  }
  
  $(document).ready(function() {
    $('#up').click(function(event) {
      event.preventDefault();
      $('#name2').css('border', 'none');
      $('#email').css('border', 'none');
      $('#pass2').css('border', 'none');
      $('#pass3').css('border', 'none');
      $('#unames').hide();
      $('#uemail').hide();
      $('#upass2').hide();
      $('#upass3').hide();
      $('#prop').css('color', 'white');
      if ($('#name2').val() && $('#email').val() && $('#pass2').val() && $('#pass3').val() && $('#file')[0].files[0]) {
        if ($('#pass2').val() === $('#pass3').val()) {
          // Call createUser function
          createUser();
          $('#up').hide();
          $('#loadingSpinner').show();
        } else {
          $('#upass3').show();
          $('#upass3').text('Passwords do not match');
          $('#pass3').css('border', '2px solid red');
        }
      } else {
        if (!$('#name2').val()) {
          $('#unames').show();
          $('#unames').text('Please enter username');
          $('#name2').css('border', '2px solid red');
        } else if (!$('#email').val()) {
          $('#uemail').show();
          $('#uemail').text('Please enter email');
          $('#email').css('border', '2px solid red');
        } else if (!$('#pass2').val()) {
          $('#upass2').show();
          $('#upass2').text('Please enter password');
          $('#pass2').css('border', '2px solid red');
        } else if (!$('#pass3').val()) {
          $('#upass3').show();
          $('#upass3').text('Please enter password');
          $('#pass3').css('border', '2px solid red');
        } else if (!$('#file')[0].files[0]) {
          $('#prop').css('color', 'red');
        }
      }
    });
  });
  