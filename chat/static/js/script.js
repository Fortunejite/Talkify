$(document).ready(function() {
    $('#news-feed').show();
    $('.navbar li a').click(function() {
        $('.navbar li a').removeClass('active');
        $(this).addClass('active');

        const target = $(this).attr('href');
        $('.tab-content').hide();
        $(target).show();

        return false;
    });

    $('#profile-link').click(function() {
        $('#profile-section').show();
        return false;
    });
    $('#logout').click(function() {
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
});