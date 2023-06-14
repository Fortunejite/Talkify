$(document).ready(function() {
    // Show the news feed section by default
    $('#news-feed').show();
  
    // Handle navigation clicks
    $('.navbar li a').click(function() {
      // Remove active class from all navigation links
      $('.navbar li a').removeClass('active');
      // Add active class to the clicked navigation link
      $(this).addClass('active');
  
      // Get the target section to show
      const target = $(this).attr('href');
      // Hide all tab content sections
      $('.tab-content').hide();
      // Show the target section
      $(target).show();
  
      return false;
    });
  
    // Handle profile link click
    $('#profile-link').click(function() {
      // Show the profile section
      $('#profile-section').show();
      return false;
    });
  
    // Handle logout click
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
  
    // Handle friend scroll
    const scrollContainer = $('.friends');
    const content = $('.friend');
    const scrollAmount = scrollContainer.width(); // Scroll amount equals the width of the container
    let currentPosition = 0;
  
    // Set initial scroll position to the leftmost side
    scrollContainer.scrollLeft(0);
  
    // Handle next button click
    $('.next').click(function() {
      currentPosition += scrollAmount;
      scrollContainer.animate({ scrollLeft: currentPosition }, 1000);
    });
  
    // Handle add friend click
    $('.add').click(function() {
      const friend = $(this).siblings('h3').text();
      $.ajax({
        url: '/',
        type: 'POST',
        data: { 'type': 'add_friend', 'friend': friend },
        success: function(response) {
          alert('Request Sent');
          window.location.href = '/users';
        }
      });
    });
  
    // Handle profile click
    $('.profile').click(function(event) {
      window.location.href = '/profile/' + $(this).siblings('h3').text();
    });
  });
  