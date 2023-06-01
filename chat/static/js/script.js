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

    const scrollContainer = $('.friends');
    const content = $('.friend');
    const scrollAmount = scrollContainer.width(); // Scroll amount equals the width of the container
    const currentPosition = 0;
    
        // Set initial scroll position to the leftmost side
    scrollContainer.scrollLeft(0);

    $('.next').click(function() {
        currentPosition += scrollAmount;
        scrollContainer.animate({ scrollLeft: currentPosition }, 1000);
    });

    $('.add').click(function () {
        friend = $(this).siblings('h3').text();
        $.ajax({
            url: '/',
            type: 'POST',
            data: {'type': 'add_friend', 'friend': friend},
            success: function(response) {
                alert('added');
                window.location.href = '/'
            }

        });
    });

});