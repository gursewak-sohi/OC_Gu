  
 


document.addEventListener("alpine:init", () => {
  Alpine.data('chatComponent', () => ({
      // Users Data
      users: [],
      isInitialUserLoading: true,
      usersSkip: 0,
      usersLimit: 10,
      isUsersFetching: false,
      folders : [],
      currentFolder: '',
      currentFolderName: 'Loading..',
      isUserError: false,
      errorUserMessage: '',

      // Messages Data
      messagesData: {},
      messages : [],
      isInitialMessageLoading: true,
      initialMessagesLoaded: false,
      currentConversationID : 1,
      messagesSkip: 0,
      messagesLimit: 10,
      isMessagesFetching: false,
      isMessagesError: false,
      errorMessageMessage: '',
 

      isDateDifferentFromPrevious(index) {
        if (index === 0) return true; // Always show date for the first message in the current batch
        const currentMessage = this.messages[index];
        const prevMessage = this.messages[index - 1];
    
        // Check if the current message's date is different from the previous message's date
        return prevMessage.date !== currentMessage.date;
    },
      
      fetchFolders() {
        fetch(`https://www.onlinecasting.co.za/apichat/JSON_CASTER_conversations_folder.asp`)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.folders)) {
                    this.folders = data.folders;
                    // Find the folder with default set to True
                    const defaultFolder = data.folders.find(folder => folder.default === "True");
                    if (defaultFolder) {
                        this.currentFolder = defaultFolder.searchname;
                        this.currentFolderName = defaultFolder.name;
                    }
                }
            })
      },

      fetchChatUsers() {
          if (this.isUsersFetching) return;
          this.isUsersFetching = true;
          this.isUserError = false;
          fetch(`https://www.onlinecasting.co.za/apichat/JSON_CASTER_conversations.asp?skip=${this.usersSkip}&limit=${this.usersLimit}&folder=${this.currentFolder}`)
              .then(response => response.json())
              .then(data => {
                  if (data && Array.isArray(data.users)) {
                    //  console.log(data.users, 'data.users')
                      this.users = [...this.users, ...data.users];
                      this.usersSkip += this.usersLimit;
                  } else {
                      console.log("Data is not an array or is empty");
                  }
              })
              .catch(error => {
                  console.error("Error fetching chat data:", error);
                  this.isUserError = true;
                  this.errorUserMessage = 'An error occurred while fetching data';  
              })
              .finally(() => {
                  this.isInitialUserLoading = false;
                  this.isUsersFetching = false;
              });
      },

      switchFolder(folder, folderName) {
          this.currentFolder = folder;
          this.currentFolderName = folderName;
          this.users = [];
          this.usersSkip = 0;
          this.isInitialUserLoading = true;
          this.fetchChatUsers();
      },

      fetchChatMessages() {
        if (this.isMessagesFetching) return;
          this.isMessagesFetching = true;
          const container = document.getElementById('chatMain');
          const oldScrollHeight = container.scrollHeight;
          this.isMessagesError = false;
        fetch(`https://www.onlinecasting.co.za/apichat/JSON_CASTER_conversation.asp?conversationid=${this.currentConversationID}&skip=${this.messagesSkip}&limit=${this.messagesLimit}`)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.messages)) {
                      this.messagesData = data
                      this.messages = [...this.messages, ...data.messages];
                      this.messagesSkip += this.messagesLimit;
                      this.$nextTick(() => {
                        const newScrollHeight = container.scrollHeight;
                        container.scrollTop += newScrollHeight - oldScrollHeight;
                     });
                     this.$nextTick(() => {
                        if (!this.initialMessagesLoaded) {
                            // Scroll to bottom for Inital load
                            container.scrollTop = container.scrollHeight;
                            this.initialMessagesLoaded = true;
                        } else {
                            // Adjust scroll for older messages
                            const newScrollHeight = container.scrollHeight;
                            container.scrollTop += newScrollHeight - oldScrollHeight;
                        }
                    });
                  } else {
                      console.log("Data is not an array or is empty");
                }
            })
            .catch(error => {
                console.error("Error fetching chat data:", error);
                this.isMessagesError = true;
                this.errorMessageMessage = 'An error occurred while fetching data'; 
            })
            .finally(() => {
                this.isInitialMessageLoading = false;
                this.isMessagesFetching = false;
            });
             
     },

      setCurrentConversation(conversationid) {
         this.currentConversationID = conversationid;
         this.messagesData = {},
         this.messages = [];
         this.messagesSkip = 0;
         this.initialMessagesLoaded = false;
         this.isInitialMessageLoading = true;
         this.fetchChatMessages()
      },


      init() {
        let debounceTimerForUsers;
        let debounceTimerForMessages;
        const chatComponent = this; // Store the component context

        // For Chat Sidebar Users Listing
        document.querySelector('#chatSidebar').addEventListener('scroll', function() {
            const threshold = 100; // Pixels from the bottom of the page
            const position = this.scrollTop + this.offsetHeight; // ScrollTop + height of the element
            const height = this.scrollHeight; // Total scrollable height

            clearTimeout(debounceTimerForUsers);
            debounceTimerForUsers = setTimeout(() => {
                if (position > height - threshold) {
                    chatComponent.fetchChatUsers();
                }
            }, 300);
        });

        // For Chat Messages Container
        document.querySelector('#chatMain').addEventListener('scroll', function() {
            const threshold = 100; // Pixels from the top of the page
            const position = this.scrollTop; // ScrollTop of the element

            clearTimeout(debounceTimerForMessages);
            debounceTimerForMessages = setTimeout(() => {
                if (position < threshold && chatComponent.initialMessagesLoaded) {
                    chatComponent.fetchChatMessages();
                }
            }, 300);
        });

        
         // Initial fetch
        this.fetchFolders();
        this.fetchChatUsers();
        this.fetchChatMessages();
    }      
  }));
});


 
