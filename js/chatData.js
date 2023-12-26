  
 


document.addEventListener("alpine:init", () => {
  Alpine.data('chatComponent', () => ({
      users: [],
      isInitialLoading: true,
      skip: 0,
      limit: 10,
      isFetching: false,
      currentFolder: 'ALL',
      isError: false,
      errorMessage: '',

      fetchChatData() {
          if (this.isFetching) return;
          
          this.isFetching = true;
          this.isError = false;
          fetch(`https://www.onlinecasting.co.za/apichat/JSON_CASTER_conversations.asp?skip=${this.skip}&limit=${this.limit}&folder=${this.currentFolder}`)
              .then(response => response.json())
              .then(data => {
                  if (data && Array.isArray(data.users)) {
                      this.users = [...this.users, ...data.users];
                      this.skip += this.limit;
                  } else {
                      console.log("Data is not an array or is empty");
                  }
              })
              .catch(error => {
                  console.error("Error fetching chat data:", error);
                  this.isError = true;
                  this.errorMessage = 'An error occurred while fetching data';  
              })
              .finally(() => {
                  this.isInitialLoading = false;
                  this.isFetching = false;
              });
      },
   

      switchFolder(folder) {
          this.currentFolder = folder;
          this.users = [];
          this.skip = 0;
          this.isInitialLoading = true;
          this.fetchChatData();
      },

      init() {
        let debounceTimer;
        const chatComponent = this; // Store the component context
    
        document.querySelector('#chatSidebar').addEventListener('scroll', function() {
            const threshold = 100; // Pixels from the bottom of the page
            const position = this.scrollTop + this.offsetHeight; // ScrollTop + height of the element
            const height = this.scrollHeight; // Total scrollable height
    
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (position > height - threshold) {
                    chatComponent.fetchChatData();
                }
            }, 300);
        });
        this.fetchChatData(); // Initial fetch
    }      
  }));
});
