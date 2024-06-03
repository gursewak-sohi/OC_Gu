function reinitializeOwlCarousel() {
  let sliders = document.querySelectorAll('.latestProfile');
  
  sliders.forEach(slider => {
    // Check if the current element has an Owl Carousel instance
    if ($.data(slider, 'owl.carousel')) {
      $(slider).owlCarousel('destroy'); 
    }

    // Reinitialize the Owl Carousel
    $(slider).owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 1
        }
      }
    });
  });
}



document.addEventListener("alpine:init", () => {
  Alpine.data('applicationComponent', () => ({
    currentView: 'list',
    

    starRating() {
      return {
        rating: 0,
        setRating(newRating) {
          this.rating = newRating;
        }
      }
    },
    init() {
      
    },
 
  }));
});

 