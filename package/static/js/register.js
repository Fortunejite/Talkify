function createUser() {
    const data = {
        'username': $('#name2').val(),
        'email': $('#email').val(),
        'password': $('#pass2').val()
    };

    $.ajax({
        url: '/register',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(response) {
            alert(response.message)
            if (response.redirect) {
                window.location.href = response.redirect;
            }
        },
        error: function(xhr) {
            const response = JSON.parse(xhr.responseText)
            alert(response.message);
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
        if ($('#name2').val() && $('#email').val() && $('#pass2').val() && $('#pass3').val()) {
            if ($('#pass2').val() === $('#pass3').val()) {
                createUser();
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
            }
        }
    });
});