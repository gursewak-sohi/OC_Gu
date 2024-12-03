
 

let sendMessage = document.getElementById('sendMessage');
let sendMessageInstance = bootstrap.Modal.getInstance(sendMessage);
if (!sendMessageInstance) {
  sendMessageInstance = new bootstrap.Modal(sendMessage);
}



 
function sendMessagesComponent() {
  return {
      isFetchingMsgData: false,
      messageData : {},
      msgSingleImageUrl : '',
      msgMaxChar : 0,
      msgInputText : '',
      msgProfiles: [],
      selectedProfiles: [],

      sendMessageModalData(profileIds) {
        this.isFetchingMsgData = true;
        fetch(`https://www.onlinecasting.dk/api/message_with_attachment_profiles.asp?profileid=${profileIds}&page=SEARCH`)
            .then(response => response.json())
            .then(data => {
                // console.log(data, 'send Messages');
                if (data.Status == 'OK') {
                  this.messageData = data;
                  this.msgInputText = data.text_messagebox;
                  this.msgProfiles = data.profiles;
                  this.msgSingleImageUrl = data.profiles[0].imageurl;
                  this.msgMaxChar = data.max_characters;
                  sendMessageInstance.show(); 

                  this.fetchMsgTemplates()
                  if (data.ShowConversation	=== "YES") {
                    this.fetchChatMessages(data.ConversationID);
                  }
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  // console.error("Error fetching message template data"); 
                  this.statusMessageHeadline = data.StatusMessageHeadline;
                  this.statusMessage = data.StatusMessage	;
                  this.textClose = data.text_close;

                  statusModalInstance.show();
                }  
            })
            .catch(error => {
                console.error("Error fetching message modal data:", error);
            })
            .finally(() => {
                this.isFetchingMsgData = false;
            });
      },

      removeMsgProfiles(profileId) {
        // Ensure profileId is a number for comparison
        const idToRemove = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
    
        this.msgProfiles = this.msgProfiles.filter(profile => profile.profileid !== idToRemove);
        this.selectedProfiles = this.selectedProfiles.filter(id => parseInt(id, 10) !== idToRemove);
        this.selectAll = false;
    },
    
      selectAll: false,  
      toggleSelectAll() {
        if (this.selectAll) {
          this.selectedProfiles = this.applications.map(app => app.profileid.toString());
        } else {
          this.selectedProfiles = [];
        }
      },

      updateSelectAllState() {
        this.selectAll = this.selectedProfiles.length === this.applications.length;
      },

      isFetchingTemplateData: false,
      msgTemplates : [],
      fetchMsgTemplates() {
        this.isFetchingTemplateData = true;
        fetch(`https://www.onlinecasting.dk/api/message_with_attachment_profiles_template.asp?default_template=`)
            .then(response => response.json())
            .then(data => {
              this.msgTemplates = data.templates
            })
            .catch(error => {
                console.error("Error fetching message template data:", error);
            })
            .finally(() => {
                this.isFetchingTemplateData = false;
            });
      },

      currentSelectedTemplate : '',
      changeMsgTemplate(searchname) {
        const selectedTemplate = this.msgTemplates.find(template => template.searchname === searchname);
        if (selectedTemplate) {
            this.currentSelectedTemplate = selectedTemplate;
            this.msgInputText = selectedTemplate.templatecontent;
        } else {
            console.error('Template not found for searchname:', searchname);
        }
    },


    isMessagesFetching : false,
    messages : [],
     
    fetchChatMessages(conversationid) {
        this.isMessagesFetching = true;
        fetch(`https://www.onlinecasting.dk/api/message_with_attachment_profiles_conversation.asp?conversationid=${conversationid}&skip=0&limit=20`)
          .then(response => response.json())
          .then(data => {
                // console.log(data, 'data')
              if (data && Array.isArray(data.messages)) {
                  this.messages = data.messages;
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
              this.isMessagesFetching = false;
          });
           
    },
 
  }

  
}