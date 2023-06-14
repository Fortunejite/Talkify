$(document).ready(function() {
    // Get references to DOM elements
    const signUpButton = $('#signUp');
    const signInButton = $('#signIn');
    const container = $('#container');
    const profileImage = $('#profile');
    const fileInput = $('#file');
  
    // Open file dialog when profile image is clicked
    $('#profile').click(function() {
      fileInput.click();
    });
  
    // Display selected image as profile picture
    fileInput.change(function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = function(e) {
        profileImage.attr('src', e.target.result);
        profileImage.css('border', '2px solid #343A40');
      };
  
      reader.readAsDataURL(file);
    });
  
    // Switch to sign up panel
    signUpButton.click(function() {
      container.addClass('right-panel-active');
    });
  
    // Switch to sign in panel
    signInButton.click(function() {
      container.removeClass('right-panel-active');
    });
  });
  