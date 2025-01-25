
 

let sendMessage = document.getElementById('sendMessage');
let sendMessageInstance = bootstrap.Modal.getInstance(sendMessage);
if (!sendMessageInstance) {
  sendMessageInstance = new bootstrap.Modal(sendMessage);
}

let profileReplyModal = document.getElementById('profileReplyModal');
let profileReplyModalInstance = bootstrap.Modal.getInstance(profileReplyModal);
if (!profileReplyModalInstance) {
  profileReplyModalInstance = new bootstrap.Modal(profileReplyModal);
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
      currentSelectedTemplate: '',
      currentReplytype : '',

      sendMessageModalData(applicationIds, template = '', replytype = '') {
        this.isFetchingMsgData = true;
        fetch(`https://www.onlinecasting.dk/api/messages/message_with_attachment_profilesOT.asp?applicationid=${applicationIds}&page=SEARCH&auditionid=24501&folder=${this.currentChatFolder}&template=${template}&replytype=${replytype}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data, 'send Messages');
                if (data.Status == 'OK') {
                  this.messageData = data;
                  this.msgInputText = data.text_messagebox;
                  this.msgProfiles = data.profiles;
                  this.msgSingleImageUrl = data.profiles[0].imageurl;
                  this.msgMaxChar = data.max_characters;
                  this.currentSelectedTemplate = data.template;
                  this.currentReplytype = data.replytype;
                  sendMessageInstance.show(); 

                  this.fetchMsgTemplates();
                  
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

     

       //  Post Messages
       movefolder : false,
       movetofolder : '',
       isNextProfileId : '',
       sendNewMessage(applicationids) {  
        
        
            const applicationIdsArray = applicationids.split(',').map(id => id.trim());

           const url = "https://proxy.cors.sh/https://www.onlinecasting.dk/api/messages/message_with_attachment_profiles_sendOT.asp";
           // Convert newlines to <br/> tags
           const formattedMessage = this.msgInputText.replace(/\n/g, '<br/>');

           const data = {
               applicationid: applicationids,
               auditionid: 24501,
               movefolder: this.movefolder ? 'YES' :  'NO',
               movetofolder: this.movetofolder,
               replytype: this.currentReplytype,
               message: formattedMessage,
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
              const parsedData = JSON.parse(data);
               if (parsedData.Status == 'OK') {  

               
                  if (this.movefolder && this.movetofolder !== '') {
                      this.updateFolderCount(this.currentChatFolder, -applicationIdsArray.length);
                      this.updateFolderCount(this.movetofolder, applicationIdsArray.length);

                      // Remove each applicationid locally
                      applicationIdsArray.forEach(applicationid => {

                        if (this.movefolder && this.movetofolder !== '') {
                            this.removeApplication(applicationid);
                        } 

                        if (this.applications.length === 0) {
                          this.applications = [];
                          this.applicationSkip = 0;
                          this.applicationLimit = 5;
          
                          this.fetchApplications()
                        }
                        if (this.isNextProfileId) {
                            // console.log(nextProfileId, 'nextProfileId')
                            this.fetchProfile(this.isNextProfileId)
                             // Move item to new folder for single profile in modal
                            // this.profile.application_folder = newFolder;
                        }
                      });



                      
                  }

                  if (!this.movefolder) {
                    applicationIdsArray.forEach(applicationid => {
                      // Find and update the application date
                      const application = this.applications.find(app => app.applicationid === applicationid);
                      if (application) {
                          application.date_application_sent = parsedData.change_date_application_sent;
                          application.text_see_reply_link = parsedData.change_text_see_reply_link;
                      }  
                    });
                  }
                
                

                  sendMessageInstance.hide();
                  this.statusMessageHeadline = parsedData.StatusMessageHeadline;
                  this.statusMessage = parsedData.StatusMessage	;
                  this.textClose = parsedData.text_close;

                  statusModalInstance.show();
              }
              if (parsedData.Status == 'ERROR') { 
                  // Open Status Modal
                  sendMessageInstance.hide();
                  
                  this.statusMessageHeadline = parsedData.StatusMessageHeadline;
                  this.statusMessage = parsedData.StatusMessage	;
                  this.textClose = parsedData.text_close;

                  statusModalInstance.show();
              }
           })
           .catch((error) => {
               console.error('Error:', error);
           })
           .finally(() => {
            this.movingApplicationId = null;
            this.movefolder = false,
            this.movetofolder = ''
            this.selectedProfiles = []
            this.isNextProfileId = null;
           });
       },

      removeMsgProfiles(profileId) {
        // Ensure profileId is a number for comparison
        const idToRemove = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
    
        this.msgProfiles = this.msgProfiles.filter(profile => profile.applicationid !== idToRemove);
        this.selectedProfiles = this.selectedProfiles.filter(id => parseInt(id, 10) !== idToRemove);
        this.selectAll = false;
    },
    
      // New code starts here
      selectAll: false,  
      maximum_number_of_applications : 5,
      toggleSelectAll() {
        if (this.selectAll) {
          if (this.applications.length > this.maximum_number_of_applications) {
              this.showMaxApplicationErrorMsg();
              this.selectedProfiles = this.applications
                  .slice(0, this.maximum_number_of_applications)
                  .map(app => app.applicationid.toString());
              this.selectAll = false;
          } else {
              this.selectedProfiles = this.applications.map(app => app.applicationid.toString());
          }
        } else {
          this.selectedProfiles = [];
        }
      },

      
      updateSelectAllState() {
        this.selectAll = this.selectedProfiles.length === this.applications.length;
        if (this.selectedProfiles.length > this.maximum_number_of_applications) {
          this.showMaxApplicationErrorMsg();
          this.selectedProfiles.pop();
      }
      },

      showMaxApplicationErrorMsg() {
        this.statusMessageHeadline = "Fejl";
        this.statusMessage = "Fejl: Ansogningen findes ikke i systemet længere eller du har besvaret profilen for mange gange.";
        this.textClose = "Luk";
        statusModalInstance.show();
      },

      // New code ends here

      isFetchingTemplateData: false,
      msgTemplates : [],
      fetchMsgTemplates() {
        this.isFetchingTemplateData = true;
        fetch(`https://www.onlinecasting.dk/api/messages/message_with_attachment_profiles_template.asp`)
            .then(response => response.json())
            .then(data => {
              this.msgTemplates = data.templates;
              this.changeMsgTemplate(this.currentSelectedTemplate);
            })
            .catch(error => {
                console.error("Error fetching message template data:", error);
            })
            .finally(() => {
                this.isFetchingTemplateData = false;
            });
      },

 
      changeMsgTemplate(searchname) {
        const selectedTemplate = this.msgTemplates.find(template => template.searchname === searchname);
        if (selectedTemplate) {
            this.currentSelectedTemplate = selectedTemplate.searchname;
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

    replyAllInFolder() {
      fetch(`https://www.onlinecasting.dk/api/messages/message_with_attachment_profilesOT.asp?page=SEARCH&auditionid=24501&folder=NO&replyallinfolder=YES&replytype=REJECT&template=NO`)
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'replyAllInFolder'); 
              if (data.Status === 'OK') {
                this.sendMessageModalData(data.applicationid , 'NO', 'REJECT');
              }
              else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                this.statusMessageHeadline = data.StatusMessageHeadline;
                this.statusMessage = data.StatusMessage	;
                this.textClose = data.text_close;
                statusModalInstance.show();
              }   
          })
          .catch(error => {
              console.error("Error:", error);
          })
          .finally(() => {
              // console.log('Folder fetched')
          });
    },

    profileReplyData : {},
    isFetchingProfileReply : false,
    handleProfileReplyData(applicationId) {
      this.isFetchingProfileReply = true;
      fetch(`https://www.onlinecasting.dk/api/applications/application_replies.asp?applicationid=${applicationId}`)
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'send Messages');
              if (data.Status == 'OK') {
                
                this.profileReplyData = data;
                profileReplyModalInstance.show(); 
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
              console.error("Error fetching profile reply modal data:", error);
          })
          .finally(() => {
              this.isFetchingProfileReply = false;
          });
    },
 
  }

  
}