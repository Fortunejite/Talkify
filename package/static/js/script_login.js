function login() {
    const formData = {
        'username': $('#name1').val(),
        'password': $('#pass1').val()
    };
    $.ajax({
        url: '/login',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function(response) {
            if (response.error === 401) {
                $('#uname').show();
                $('#uname').text(response.message);
                $('#name1').css('border', '2px solid red');
             
            } else if (response.error === 402) {
                $('#upass').show();
                $('#upass').text(response.message);
                $('#pass1').css('border', '2px solid red');
            }
            if (response.redirect) {
                window.location.href = response.redirect;
            }
            $('#sign').show();
            $('#loadingSpinner').hide();
        },
        error: function(xhr) {
            const response = JSON.parse(xhr.responseText);

            if (response.error === 401) {
                $('#uname').show();
                $('#uname').text(response.message);
                $('#name1').css('border', '2px solid red');
            }
            if (response.error === 402) {
                $('#upass').show();
                $('#upass').text(response.message);
                $('#pass1').css('border', '2px solid red');
            }
            $('#sign').show();
            $('#loadingSpinner').hide();
        }
    });
}

$(document).ready(function() {
    $('#sign').click(function(event) {
        event.preventDefault();
        $('#name1').css('border', 'none');
        $('#pass1').css('border', 'none');
        $('#uname').hide();
        $('#upass').hide();
        if ($('#name1').val() && $('#pass1').val()) {
            login();
            $('#sign').hide();
            $('#loadingSpinner').show();
        } else {
            if (!$('#name1').val()) {
                $('#uname').show();
                $('#uname').text('Please enter username');
                $('#name1').css('border', '2px solid red');
            } else if (!$('#pass1').val()) {
                $('#upass').show();
                $('#upass').text('Please enter password');
                $('#pass1').css('border', '2px solid red');
            }
        }
    });
});
