$(document).ready(function() {

    $('#accept').click(function(event) {
        const name = $(this).closest('.notification').find('img').attr('alt');
        event.preventDefault();
        $.ajax({
            url: '/',
            type: 'POST',
            data: {'type': 'accept', 'friend': name},
            success: function(response) {
                alert('accepted');
                window.location.href = '/notifications'
            }
        });
    });

    $('#reject').click(function(event) {
        const name = $(this).closest('.notification').find('img').attr('alt');
        event.preventDefault();
        $.ajax({
            url: '/',
            type: 'POST',
            data: {'type': 'reject', 'friend': name},
            success: function(response) {
                alert('Request rejected');
                window.location.href = '/notifications'
            }
        });
    });

});