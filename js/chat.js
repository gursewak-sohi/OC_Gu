$(document).ready(function() {
   

  const $showDetails = $('#showDetails');
  const $chatDetails = $('#chatDetails');

  let smWidth;
     screen.width < 768 ? smWidth = true : smWidth = false;

  if (!smWidth) {
    $chatDetails.addClass('active');
    $showDetails.removeClass('d-lg-block');
  }

  $showDetails.click(function() {
    $showDetails.removeClass('d-lg-block');
    $chatDetails.addClass('active');
  });

  $('[data-reservation="show"]').click(function() {
    $chatDetails.addClass('active');
  });

  $('#hideDetails').click(function() {
    $showDetails.addClass('d-lg-block');
    $chatDetails.removeClass('active');
  });

  const $sendBtn = $('#sendBtn');
  $('#chatInput').on('input', function() {
    if ($(this).val().length > 0) {
      $sendBtn.addClass('active');
    } else {
      $sendBtn.removeClass('active');
    }
  });

   

  
  $('#chatModal .auditionsItem input[type="checkbox"]').change(function() {
    // Get the corresponding auditionsItem
    var auditionsItem = $(this).closest('.auditionsItem');
      // Check if the checkbox is selected
      if ($(this).prop('checked')) {
          // Add active class to the corresponding auditionsItem
          auditionsItem.addClass('active');
      } else {
          // Remove active class from the corresponding auditionsItem
          auditionsItem.removeClass('active');
      }
  });

  $('#chatModal .auditionsItem input[type="checkbox"]:checked').each(function() {
      var auditionsItem = $(this).closest('.auditionsItem');
      auditionsItem.addClass('active');
  });


  $(document).on('click', '.copyLink' , function() {
    var link = $(this).closest('.linkBlock').find('.link').attr('href');
    navigator.clipboard.writeText(link).then(() => {
        var tooltip = $('<div/>', {
            text: 'Link Copied!',
            css: {
                position: 'absolute',
                backgroundColor: '#000',
                color: 'white',
                fontWeight: '400',
                width: '90px',
                padding: '5px',
                borderRadius: '5px',
                bottom: '110%',
                left: '50%',
                transform: 'translateX(-50%)'
            }
        }).appendTo(this);

        setTimeout(function() {
            tooltip.remove();
        }, 2000);
    });
  });

 
   

    // Delete Link functionality
    $('.deleteLink').click(function() {
        $(this).closest('.linkBlock').remove();
    });
 


    $(document).ready(function() {
      // Trigger file input when button is clicked
      $('.uploadTrigger').click(function() {
          $('.fileInput').click();
      });
  
      // Handle file selection
      $('.fileInput').change(function() {
          var files = this.files;
          var uploadsContainer = $('.uploadsContainer');
          
          $.each(files, function(index, file) {
              var fileDisplay = $($('#fileDisplayTemplate').html()).appendTo(uploadsContainer);
              fileDisplay.show();
              fileDisplay.find('.fileName').text(file.name);
              fileDisplay.find('.fileSize').text('' + (file.size / 1024).toFixed(2) + ' KB');
  
              if (file.type.startsWith('image/')) {
                  var reader = new FileReader();
                  reader.onload = function(e) {
                      fileDisplay.find('.imagePreview').html('<img src="' + e.target.result + '" alt="Image preview" style="max-width: 100px; max-height: 100px;">').show();
                      fileDisplay.find('.fileIcon').hide(); // Hide the file icon
                  };
                  reader.readAsDataURL(file);
              } else {
                  fileDisplay.find('.fileIcon').html('<ion-icon name="document-outline"></ion-icon>'); // Show file icon for non-image files
                  fileDisplay.find('.imagePreview').hide();
              }
  
              var progressBar = fileDisplay.find('.progressBar');
              var progressBarContainer = fileDisplay.find('.progressBarContainer');
              progressBarContainer.show();
  
              // Simulate file upload progress
              var progress = 0;
              var interval = setInterval(function() {
                  progress += 10;
                  progressBar.css('width', progress + '%');
  
                  if (progress >= 100) {
                      clearInterval(interval);
                      progressBarContainer.hide();
                      fileDisplay.find('.uploadComplete').show();
                  }
              }, 1000);
  
              fileDisplay.find('.removeFile').click(function() {
                  fileDisplay.remove();
              });
          });
      });
    });

    
 
  



});
