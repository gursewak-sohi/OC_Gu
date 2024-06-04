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

 