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

  const $chatSidebar = $('#chatSidebar');

  $('#backToChat').click(function() {
    $chatSidebar.removeClass('hide');
  });

  $('#chatSidebar .chat-row-inner').each(function() {
    $(this).click(function() {
      $chatSidebar.addClass('hide');
    });
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


 
    // Copy Link functionality
    $('.copyLink').click(function() {
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
 




});
