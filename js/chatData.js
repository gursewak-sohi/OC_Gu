function initOwlCarousel() {
    let owlSlider = document.querySelector('.owl-slider');
    if (owlSlider) {
        $('.owl-slider').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
                0: { items: 1 },
                600: { items: 1 },
                1000: { items: 1 }
            }
        });
    }
}

function appendItemsToOwlCarousel(items) {
    let owlSlider = $('.owl-slider');

    items.forEach(item => {
        let content = `<div class="item">
                           <div class="profileCard relative">
                               <img height="300" class="img-fluid object-cover position-absolute w-100 h-100 rounded-2" src="${item.imageurl}" alt="">
                           </div>
                       </div>`;
        owlSlider.trigger('add.owl.carousel', [content]);
    });

    owlSlider.trigger('refresh.owl.carousel');
}

document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.shiftKey) {
        this.style.height = ''; // Clear any inline height
        this.style.height = this.scrollHeight + 'px'; // Set new height
    }
});

// Optional: Automatically adjust height when the textarea content changes
document.getElementById('chatInput').addEventListener('input', function() {
    this.style.height = ''; // Reset height
    this.style.height = this.scrollHeight + 'px'; // Adjust height
});



function updateSingleImageContent(image) {
    let singleImageContainer = document.querySelector('.single-image-container');
    if (singleImageContainer) {
        singleImageContainer.innerHTML = `<div class="item">
                                              <div class="profileCard relative">
                                                  <img height="300" class="img-fluid object-cover position-absolute w-100 h-100 rounded-2" src="${image.imageurl}" alt="profile">
                                              </div>
                                          </div>`;
    }
}




document.addEventListener("alpine:init", () => {
    Alpine.data('chatComponent', () => ({
       // Chat Data
        isChatSidebarClosed : false,
        fetchFolders() {
            fetch(`https://www.onlinecasting.co.za/api/chat/conversations_folders.asp`)
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
                        this.fetchChatConversations();
                    }
                })
        },

        switchFolder(folder, folderName) {
            this.currentFolder = folder;
            this.currentFolderName = folderName;
            this.conversations = [];
            this.conversationsSkip = 0;
            this.isInitialConversatationsLoading = true;

            this.messagesData = {},
            this.messages = [];
            this.messagesSkip = 0;
            this.initialMessagesLoaded = false;
            this.isInitialMessageLoading = true;
            this.errorMessageMessage = '';

            this.fetchChatConversations();
        },

        // Auditons
        auditions : [],
        currentAudition: '', 
        currentAuditionID: 0,
        fetchAuditions() {
            let url = `https://www.onlinecasting.co.za/api/chat/conversations_auditions.asp`;
            if (this.currentAuditionID) {
                url += `?auditionid=${this.currentAuditionID}`;
            }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data && Array.isArray(data.auditions)) {
                        this.auditions = data.auditions;
                        // console.log(this.auditions, 'auditons');
                    }
                })
        },

        switchAudition(audition) {
            this.currentAudition = audition;
            this.currentAuditionID = audition.auditionid;
            this.conversations = [];
            this.conversationsSkip = 0;
            this.isInitialConversatationsLoading = true;

            this.messagesData = {},
            this.messages = [];
            this.messagesSkip = 0;
            this.initialMessagesLoaded = false;
            this.isInitialMessageLoading = true;
            this.errorMessageMessage = '';

            this.fetchChatConversations();
            this.fetchAuditions();
        },

        // Conversation Data
        conversations: [],
        currentConversation: {},
        currentConversationID : '',
        currentProfileID : '',
        isInitialConversatationsLoading: true,
        conversationsSkip: 0,
        conversationsLimit: 10,
        isConversationsFetching: false,
        folders : [],
        currentFolder: '',
        currentFolderName: 'Loading..',
        isConversationError: false,
        errorConversationMessage: '',
        
        fetchChatConversations() {
            if (this.isConversationsFetching) return;
            this.isConversationsFetching = true;
            this.isConversationError = false;
            fetch(`https://www.onlinecasting.co.za/api/chat/conversations.asp?skip=${this.conversationsSkip}&limit=${this.conversationsLimit}&chatfolder=${this.currentFolder}&auditionid=${this.currentAuditionID}`)
                .then(response => response.json())
                .then(data => {
                    // console.log("API Data:", data);
                    if (data && Array.isArray(data.conversations)) {
                        if (data.conversations.length > 0 && this.isInitialConversatationsLoading) {
                            this.currentConversation  = data.conversations[0]
                            this.currentConversationID  = data.conversations[0].conversationid
                            this.currentProfileID  = data.conversations[0].profileid
                            // Fetch chat message on change conversation
                            this.fetchChatMessages();
                            this.fetchProfileImages();
                            this.fetchProfileData();
                        }
                        
                        this.conversations = [...this.conversations, ...data.conversations];
                        // console.log(this.conversations, 'this.conversations')
                        this.conversationsSkip += this.conversationsLimit;
                    } else {
                        console.log("Data is not an array or is empty");
                    }
                })
                .catch(error => {
                    // this.conversations = [];
                    console.error("Error fetching chat data:", error);
                    this.isConversationError = true;
                    this.errorConversationMessage = 'An error occurred while fetching data'; 
                    
                    this.isMessagesError = true;
                    this.errorMessageMessage = 'An error occurred while fetching data'; 
                })
                .finally(() => {
                    this.isInitialConversatationsLoading = false;
                    this.isConversationsFetching = false;

                    this.isInitialMessageLoading = false;
                    this.isMessagesFetching = false;
                });
        },
       
      

        setCurrentConversation(conversation) {
            this.currentConversation = conversation
            this.currentConversationID = conversation.conversationid;
            this.currentProfileID = conversation.profileid;
            this.messagesData = {},
            this.messages = [];
            this.messagesSkip = 0;
            this.errorMessageMessage = '';
            this.initialMessagesLoaded = false;
            this.isInitialMessageLoading = true;
            this.fetchChatMessages()
            this.fetchProfileImages()
            this.fetchProfileData()
            this.stopMessageFetchTimer();
         },
  

        // Messages Data
        messagesData: {},
        messages : [],
        isInitialMessageLoading: true,
        initialMessagesLoaded: false,
        messagesSkip: 0,
        messagesLimit: 10,
        isMessagesFetching: false,
        isMessagesError: false,
        errorMessageMessage: '',
        get reversedMessages() {
            return [...this.messages].reverse();
        },
        fetchChatMessages(fetchOlderMessages = false) {
          if (!this.currentConversationID) return;
          if (this.isMessagesFetching) return;
            this.isMessagesFetching = true;
            const container = document.getElementById('chatMain');
            const oldScrollHeight = container.scrollHeight;
            this.isMessagesError = false;
            if (fetchOlderMessages) {
                this.messagesSkip += this.messagesLimit;
            }
           
            fetch(`https://www.onlinecasting.co.za/api/chat/conversation.asp?conversationid=${this.currentConversationID}&skip=${this.messagesSkip}&limit=${this.messagesLimit}`)
              .then(response => response.json())
              .then(data => {
                    // console.log(data, 'data')
                  if (data && Array.isArray(data.messages)) {
                        this.messagesData = data  
                        if (fetchOlderMessages) {
                            this.messages = [...JSON.parse(JSON.stringify(this.messages)), ...data.messages];
                        }
                        else {
                            this.messages = [...data.messages];
                        }
                       this.$nextTick(() => {
                          if (!this.initialMessagesLoaded) {
                             // Scroll to bottom for Inital load
                              container.scrollTop = container.scrollHeight;
                              this.initialMessagesLoaded = true;
                          } else {
                            if (fetchOlderMessages) {
                                // Adjust scroll for older messages
                                const newScrollHeight = container.scrollHeight;
                                container.scrollTop += newScrollHeight - oldScrollHeight;
                            }
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

         // Timeout Strategy to get new Messages
         messageFetchTimer: null,
         lastMessageTimestamp: null,
         startMessageFetchTimer() {
            this.stopMessageFetchTimer();

            const timeSinceLastMessage = Date.now() - this.lastMessageTimestamp;
            let timeoutDuration;

            if (timeSinceLastMessage <= 5 * 60 * 1000) {         // 5 minutes
                timeoutDuration = 20 * 1000;                    // 20 seconds
            } else if (timeSinceLastMessage <= 30 * 60 * 1000) { // 30 minutes
                timeoutDuration = 5 * 60 * 1000;                // 5 minutes
            } else if (timeSinceLastMessage <= 60 * 60 * 1000) { // 1 hour
                timeoutDuration = 30 * 60 * 1000;               // 30 minutes
            } else if (timeSinceLastMessage <= 5 * 60 * 60 * 1000) { // 5 hours
                timeoutDuration = 60 * 60 * 1000;               // 1 hour
            } else {
                return; // Stop the timer after 5 hours
            }

        // Start the timer
        this.messageFetchTimer = setTimeout(() => {
            this.messagesSkip = 0;
            this.fetchChatMessages();
            this.startMessageFetchTimer(); // Restart the timer
        }, timeoutDuration);
         },
  
        stopMessageFetchTimer() {
            clearTimeout(this.messageFetchTimer);
            this.messageFetchTimer = null;
        },

        

        // Fetch Profile 
        profileImages : {},
        isProfileImagesLoading: true,
        isProfileImagesError: false,
        errorProfileImagesMessage: '',

        profileData : {},

        fetchProfileImages() {
            if (!this.currentProfileID) return;
            fetch(`https://www.onlinecasting.co.za/api/chat/profile_images.asp?profileid=${this.currentProfileID}`)
                .then(response => response.json())
                .then(data => {
                    
                    this.profileImages = data
                    // console.log(this.profileImages, 'profile data')
                    this.$nextTick(() => {
                        // Reset the containers
                        let singleImageContainer = document.querySelector('.single-image-container');
                        if (singleImageContainer) {
                            singleImageContainer.innerHTML = '';
                        }
                        
                        let owlSlider = $('.owl-slider');
                        owlSlider.trigger('to.owl.carousel', 0); // Go to the first item
                        
                        let itemsCount = owlSlider.find('.owl-stage').children().length;
                        for (let i = 0; i < itemsCount; i++) {
                            owlSlider.trigger('remove.owl.carousel', [0]);
                        }
                        
                        owlSlider.trigger('refresh.owl.carousel');
        
                        // Add new content
                        if (this.profileImages.images.length > 1) {
                            appendItemsToOwlCarousel(this.profileImages.images);
                        } else if (this.profileImages.images.length === 1) {
                            updateSingleImageContent(this.profileImages.images[0]);
                        }
                    });
                })
                .catch(error => {
                    console.error("Error fetching chat data:", error);
                    this.isProfileImagesError = true;
                    this.errorProfileImagesMessage = 'An error occurred while fetching data';  
                })
                .finally(() => {
                    this.isProfileImagesLoading = false;
                });
        },

        fetchProfileData() {
            if (!this.currentProfileID) return;
            fetch(`https://www.onlinecasting.co.za/api/chat/profile_data.asp?profileid=${this.currentProfileID}`)
                .then(response => response.json())
                .then(data => {
                    this.profileData = data
                    // console.log(this.profileData, 'profile data')
                })
                .catch(error => {
                    this.profileData = {}
                    console.error("Error fetching chat data:", error);
                    // this.isProfileImagesError = true;
                    // this.errorProfileImagesMessage = 'An error occurred while fetching data';  
                })
                .finally(() => {
                    // this.isProfileImagesLoading = false;
                });
        },


         //  Post Messages
         newMessage: '',
         postChatMessage() {    
             const url = "https://proxy.cors.sh/https://www.onlinecasting.co.za/apichat/CASTER_post_message.asp";
             
             const data = {
                 ConversationID: this.currentConversationID,
                 CasterID: 1,
                 ProfileID: 1,
                 Message: this.newMessage,
                 MimeType: "Text",
                 ContentURL: ""
             };
             
             fetch(url, {
                 method: 'POST',
                 headers: {
                     'x-cors-api-key': 'temp_eef745625cb54bc7665a1785f4bee6a9',
                     'Content-Type': 'application/x-www-form-urlencoded'
                 },
                 body: new URLSearchParams(data).toString()
             })
             .then(response => response.text())
             .then(data => {
                 console.log('Response:', data);
                 this.newMessage = '';
                 this.messagesSkip = 0;
                 this.fetchChatMessages();
                 this.lastMessageTimestamp = Date.now(); // Update the timestamp
                 this.startMessageFetchTimer();
             })
             .catch((error) => {
                 console.error('Error:', error);
             });
         },

         
        toggleStar(conversation, setAsStarred) {
            const apiUrl = `https://www.onlinecasting.co.za/api/chat/tag_conversation.asp?ConversationID=${conversation.conversationid}&ConversationParticipantID=${conversation.conversationparticipantid}&Tag=${setAsStarred}`;
            fetch(apiUrl)
                .then(response => response.text())
                .then(data => {
                    console.log('Star toggled', data);
                    // Update the conversation's starred status in the Alpine state
                    conversation.tag = setAsStarred;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        toggleArchieve(conversation, setAsArchieved) {
            const apiUrl = `https://www.onlinecasting.co.za/api/chat/change_folder_conversation.asp?ConversationParticipantID=${conversation.conversationparticipantid}&ConversationID=${conversation.conversationid}&folder=${setAsArchieved}`;
            fetch(apiUrl)
                .then(response => response.text())
                .then(data => {
                    console.log('Archieved toggled', data);
                    // Update the conversation's starred status in the Alpine state
                    conversation.chatfolder = setAsArchieved;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        init() {
          let debounceTimerForConversations;
          let debounceTimerForMessages;
          const chatComponent = this; // Store the component context
  
          // For Chat Sidebar Conversation Listing
          document.querySelector('#chatSidebar').addEventListener('scroll', function() {
              const threshold = 100; // Pixels from the bottom of the page
              const position = this.scrollTop + this.offsetHeight; // ScrollTop + height of the element
              const height = this.scrollHeight; // Total scrollable height
  
              clearTimeout(debounceTimerForConversations);
              debounceTimerForConversations = setTimeout(() => {
                  if (position > height - threshold) {
                      chatComponent.fetchChatConversations();
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
                     chatComponent.fetchChatMessages(true)
                  }
              }, 300);
          });
  
          
           // Initial fetch
          this.fetchFolders();
          this.fetchAuditions();
          this.$nextTick(() => {
            initOwlCarousel(); // Initialize carousel after Alpine updates the DOM
          });
        }      
    }));
  });
  
  
   
  