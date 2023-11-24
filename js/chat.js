$(document).ready(function() {
  const $showDetails = $('#showDetails');
  const $chatDetails = $('#chatDetails');

  $showDetails.click(function() {
    $showDetails.removeClass('d-lg-block');
    $chatDetails.addClass('active');
  });

  $('#showDetailsMobile').click(function() {
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

});
