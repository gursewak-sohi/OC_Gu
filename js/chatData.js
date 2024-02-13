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

        this.newMessage += '<br/>';

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
            fetch(`http://84.247.163.91/api/chat/conversations_folders.asp`)
                .then(response => response.json())
                .then(data => {
                    if (data && Array.isArray(data.folders)) {
                        this.folders = data.folders;
                        // Find the folder with default set to True
                        const defaultFolder = data.folders.find(folder => folder.default === "True");
                        if (defaultFolder) {
                            this.currentChatFolder = defaultFolder.searchname;
                            this.currentChatFolderName = defaultFolder.name;
                        }
                        this.fetchChatConversations();
                    }
                })
        },

        switchFolder(folder, folderName) {
            this.currentChatFolder = folder;
            this.currentChatFolderName = folderName;
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
            let url = `http://84.247.163.91/api/chat/conversations_auditions.asp`;
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
     
        currentChatFolder: '',
        currentChatFolderName: 'Loading..',
        isConversationError: false,
        errorConversationMessage: '',
        
        fetchChatConversations() {
            if (this.isConversationsFetching) return;
            this.isConversationsFetching = true;
            this.isConversationError = false;
            fetch(`http://84.247.163.91/api/chat/conversations.asp?skip=${this.conversationsSkip}&limit=${this.conversationsLimit}&chatfolder=${this.currentChatFolder}&auditionid=${this.currentAuditionID}`)
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

            this.newMessage = ''
            const textarea = document.getElementById('chatInput');
            if (textarea) {
                textarea.style.height = ''; // Reset to the initial height (adjust as needed)
            }
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
            
           
            fetch(`http://84.247.163.91/api/chat/conversation.asp?conversationid=${this.currentConversationID}&skip=${this.messagesSkip}&limit=${this.messagesLimit}`)
              .then(response => response.json())
              .then(data => {
                    // console.log(data, 'data')
                  if (data && Array.isArray(data.GroupedMessages)) {
                        // this.messagesData = data  
                        if (fetchOlderMessages) {
                            this.messages = [...JSON.parse(JSON.stringify(this.messages)), ...data.GroupedMessages];
                        } else {
                            // For initial or refreshed messages, just set it directly
                            this.messages = data.GroupedMessages;
                        }
                        // console.log(this.messages, 'this.messages')

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
            fetch(`http://84.247.163.91/api/chat/profile_images.asp?profileid=${this.currentProfileID}`)
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
            if (!this.currentConversationID) return;
            fetch(`http://84.247.163.91/api/chat/profile_data.asp?profileid=${this.currentProfileID}&conversationid=${this.currentConversationID}`)
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
           
             const url = "https://proxy.cors.sh/http://84.247.163.91/api/chat/post_message.asp";
             
             // Convert newlines to <br/> tags
             const formattedMessage = this.newMessage.replace(/\n/g, '<br/>');

             const data = {
                 ConversationID: this.currentConversationID,
                 CasterID: 1,
                 ProfileID: 1,
                 Message: formattedMessage,
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

                const textarea = document.getElementById('chatInput');
                if (textarea) {
                    textarea.style.height = ''; // Reset to the initial height (adjust as needed)
                }
             })
             .catch((error) => {
                 console.error('Error:', error);
             });
         },

         
        toggleStar(conversation, setAsStarred) {
            const apiUrl = `http://84.247.163.91/api/chat/tag_conversation.asp?ConversationID=${conversation.conversationid}&ConversationParticipantID=${conversation.conversationparticipantid}&Tag=${setAsStarred}&chatfolder=${this.currentChatFolder}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Star toggled', data);
                    // Update the conversation's starred status in the Alpine state
                    conversation.tag = setAsStarred;
                    
                    if (data.HideConversationBox == 'YES') {
                        this.hideConversation(conversation)
                    }
                    
                    if (data.ChangeToFolder) {
                        this.switchFolder(data.ChangeToFolder, data.ChangeToFolder.toLowerCase());
                        console.log('switched to', data.ChangeToFolder);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        toggleArchieve(conversation, setAsArchieved) {
            
            const apiUrl = `http://84.247.163.91/api/chat/change_folder_conversation.asp?ConversationParticipantID=${conversation.conversationparticipantid}&ConversationID=${conversation.conversationid}&folder=${setAsArchieved}&chatfolder=${this.currentChatFolder}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Archieved toggled');
                    conversation.folder = setAsArchieved;
                    if (data.HideConversationBox == 'YES') {
                        this.hideConversation(conversation)
                    }
                    
                    if (data.ChangeToFolder) {
                        this.switchFolder(data.ChangeToFolder, data.ChangeToFolder.toLowerCase());
                        console.log('switched to', data.ChangeToFolder);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        toggleReadyOnly(conversation, setReadStatus) {
            const apiUrl = `http://84.247.163.91/api/chat/change_readonly.asp?ConversationParticipantID=${conversation.conversationparticipantid}&ConversationID=${conversation.conversationid}&ReadOnly=${setReadStatus}&chatfolder=${this.currentChatFolder}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Ready only status toggled', data);
                    // Update the conversation's starred status in the Alpine state
                    conversation.readonly = setReadStatus;
                   
                    if (data.HideConversationBox == 'YES') {
                        this.hideConversation(conversation)
                    }
                    if (data.ShowMessage == 'YES') { 
                        // Open Status Modal
                        this.blockStatus = data.Status;
                        this.blockStatusMessage = data.StatusMessage;

                        const statusModal = document.getElementById('statusModal');
                        let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                        if (!statusModalInstance) {
                            // Initialize the modal if it hasn't been initialized
                            statusModalInstance = new bootstrap.Modal(statusModal);
                        }
                        statusModalInstance.show();
                       
                    }
                

                    if (data.ChangeToFolder) {
                        this.switchFolder(data.ChangeToFolder, data.ChangeToFolder.toLowerCase());
                        console.log('switched to', data.ChangeToFolder);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },


        //  Block User
        blockMessage: '',
        blockStatus : '',
        blockStatusMessage : '',
        blockConversation() {  
            // console.log(this.currentConversation, 'curent');
            
            const url = "https://proxy.cors.sh/http://84.247.163.91/api/chat/block_user.asp";
            const data = {
                ConversationID: this.currentConversationID,
                CasterID: this.currentConversation.casterid,
                ProfileID: this.currentProfileID,
                BlockedCasterID: this.currentConversation.casterid,
                BlockedProfileID: this.currentProfileID,
                Reason: this.blockMessage,
                chatfolder: this.currentChatFolder
            };
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'x-cors-api-key': 'temp_9194204b2d7148834b89969a8d83bfa4',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(data).toString()
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response:', data);

                this.currentConversation.isblocked = 'YES';

                // Close the modal after the fetch response
                const reportModal = document.getElementById('reportModal');
                const reportModalInstance = bootstrap.Modal.getInstance(reportModal);

                 
                    // Open Status Modal
                    this.blockStatus = data.Status;
                    this.blockStatusMessage = data.StatusMessage;

                    const statusModal = document.getElementById('statusModal');
                    let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                    if (!statusModalInstance) {
                        // Initialize the modal if it hasn't been initialized
                        statusModalInstance = new bootstrap.Modal(statusModal);
                    }
                
                    setTimeout(() => {
                        statusModalInstance.show();
                    }, 300);

                    reportModalInstance.hide();
                 
                

                this.blockMessage = '';

                if (data.HideConversationBox == 'YES') {
                    this.hideConversation(this.currentConversation)
                }
                
                })
            .catch((error) => {
                console.error('Error:', error);
            });
        },

      
        

        unBlockConversation(conversation) {  
            const apiUrl = `hhttp://84.247.163.91/api/chat/unblock_user.asp?ConversationID=${conversation.conversationid}&CasterID=${conversation.casterid}&ProfileID=${conversation.profileid}&BlockedCasterID=${conversation.casterid}&BlockedProfileID=${conversation.profileid}`;
            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Response:', data);
                // this.blockStatus = data.Status;
                // this.blockStatusMessage = data.StatusMessage;

                this.currentConversation.isblocked = 'NO';

                if (data.HideConversationBox == 'YES') {
                    this.hideConversation(conversation)
                }

                
                })
            .catch((error) => {
                console.error('Error:', error);
            });
        },

        hideConversation (conversations) {
           
            // Find the index of the conversation  
            const index = this.conversations.findIndex(convo => convo.conversationid === conversations.conversationid);
             
            // Remove the archived conversation from the list
            this.conversations.splice(index, 1);

            // Determine the next conversation to focus on
            if (this.conversations.length > 0) {
                let newIndex = index;
                if (newIndex >= this.conversations.length) {
                    // If the archived conversation was the last one, focus on the new last conversation
                    newIndex = this.conversations.length - 1;
                }

                // Set the current conversation to the next one in the list
                this.currentConversation = this.conversations[newIndex];
                this.currentConversationID = this.conversations[newIndex].conversationid;
                this.currentProfileID = this.conversations[newIndex].profileid;

                this.fetchChatMessages();
                this.fetchProfileImages();
                this.fetchProfileData();
            } else {
                this.currentConversation = null;
                this.currentConversationID = '';
                this.currentProfileID = '';
            }   
            const textarea = document.getElementById('chatInput');
            // Check if the textarea exists to avoid errors
            if (textarea) {
                textarea.focus();
            }      
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
  
  
   
  