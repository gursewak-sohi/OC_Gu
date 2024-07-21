
let notesModal = document.getElementById('notesModal');
let notesModalInstance = bootstrap.Modal.getInstance(notesModal);
if (!notesModalInstance) {
  notesModalInstance = new bootstrap.Modal(notesModal);
}

let sendSmsModal = document.getElementById('sendSmsModal');
let sendSmsModalInstance = bootstrap.Modal.getInstance(sendSmsModal);
if (!sendSmsModalInstance) {
  sendSmsModalInstance = new bootstrap.Modal(sendSmsModal);
}

let profileModal = document.getElementById('profileModal');
let profileModalInstance = bootstrap.Modal.getInstance(profileModal);
if (!profileModalInstance) {
  profileModalInstance = new bootstrap.Modal(profileModal);
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const applicationId = urlParams.get('applicationid');
  if (applicationId) {
      fetchProfile(applicationId);
  }
});
 
window.onpopstate = (event) => {
  if (event.state && event.state.applicationId) {
    window.fetchProfile(event.state.applicationId);
  } else {
    profileModalInstance.hide();
  }
};

// Function to initialize or reinitialize Masonry
function initializeMasonry() {
  $(".grid").imagesLoaded(function() {
      $(".grid").masonry({
          itemSelector: ".grid-item"
      });
  });
    // $(".grid").masonry({
    //     itemSelector: ".grid-item",
    // });
}
function reloadMasonry() {
  $(".grid").imagesLoaded(function() {
    $(".grid").masonry({
        itemSelector: ".grid-item",
    }).masonry('reloadItems');
  });
}

profileModal.addEventListener('shown.bs.modal', function () {
  initializeMasonry();
});

function applicationComponent() {
  return {
    currentView: 'list',
    showLoadMoreBtn: '',
    folders : [],
    currentChatFolder: '',
    fetchFolders() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_folders.asp?auditionid=23406`)
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'folders'); 
              if (data && Array.isArray(data.folders)) {
                  this.folders = data.folders.map(folder => {
                    return {
                      ...folder,
                      number_of_applications: parseInt(folder.number_of_applications, 10)
                    };
                  });
                  // Find the folder with default set to True
                  const defaultFolder = data.folders.find(folder => folder.default === "True");
                  if (defaultFolder) {
                      this.currentChatFolder = defaultFolder.searchname;
                  }
              }
          })
          .catch(error => {
              console.error("Error fetching applications folders:", error);
          })
          .finally(() => {
              // console.log('Folder fetched')
          });
    },

    changeChatFolder(newFolder) {
      this.currentChatFolder = newFolder;
      this.applications = [];
      this.applicationSkip = 0;
      this.applicationLimit = 5;

      this.fetchApplications()
    },

    removeApplication(applicationid) {
      this.applications = this.applications.filter(app => app.applicationid !== applicationid);
    },

    updateFolderCount(folderName, change) {
      const folder = this.folders.find(f => f.searchname === folderName);
      if (folder && typeof folder.number_of_applications === 'number') {
        folder.number_of_applications += change;
      }
    },

    movingApplicationId: null,
    isMovingToFolder: false,
    moveToFolder(newFolder, applicationid, nextProfileId) {
      this.movingApplicationId = applicationid;
      this.isMovingToFolder = true;
      fetch(`https://www.onlinecasting.dk/api/applications/change_folder.asp?applicationid=${applicationid}&newfolder=${newFolder}`)
          .then(response => response.json())
          .then(data => {
            if (data.Status === 'OK') {

              const currentFolder = this.folders.find(f => f.searchname === this.currentChatFolder);
              const targetFolder = this.folders.find(f => f.searchname === newFolder);

              if (currentFolder && targetFolder) {
                this.updateFolderCount(this.currentChatFolder, -1);
                this.updateFolderCount(newFolder, 1);
              }
              
              this.removeApplication(applicationid);
              if (nextProfileId) {
                  // console.log(nextProfileId, 'nextProfileId')
                  this.fetchProfile(nextProfileId)
                   // Move item to new folder for single profile in modal
                  // this.profile.application_folder = newFolder;
              }
              else {
                profileModalInstance.hide();
              }
            }
          })
          .catch(error => {
            console.error("Error move to new folder:", error);
          })
          .finally(() => {
            this.isMovingToFolder = false;
            this.movingApplicationId = null;
        });
    },



    orderBy : [],
    currentOrderBy: '',
    fetchOrderBy() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_orderby.asp`)
          .then(response => response.json())
          .then(data => {
              if (data && Array.isArray(data.folders)) {
                  this.orderBy = data.folders;
                  // Find the folder with default set to True
                  const defaultFolder = data.folders.find(folder => folder.default === "True");
                  if (defaultFolder) {
                      this.currentOrderBy = defaultFolder.searchname;
                  }
              }
          })
          .catch(error => {
            console.error("Error fetching applications order by:", error);
          })
          .finally(() => {
              // console.log('Orderby fetched')
          });
    },

    initializeTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    },

    changeOrderBy(newOrder) {
      this.currentOrderBy = newOrder;
      this.applications = [];
      this.applicationSkip = 0;
      this.applicationLimit = 5;

      this.fetchApplications()
    },

    filterBy : [],
    currentFilterBy: '',
    fetchFilterBy() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_filter.asp`)
          .then(response => response.json())
          .then(data => {
              if (data && Array.isArray(data.folders)) {
                  this.filterBy = data.folders;
                  // Find the folder with default set to True
                  const defaultFolder = data.folders.find(folder => folder.default === "True");
                  if (defaultFolder) {
                      this.currentFilterBy = defaultFolder.searchname;
                  }
                  else {
                     this.currentFilterBy = 'ALL_GENDER';
                  }
              }
          })
          .catch(error => {
            console.error("Error fetching applications filter by:", error);
          })
    },

    changeFilterBy(newFilter) {
      this.currentFilterBy = newFilter;
      this.applications = [];
      this.applicationSkip = 0;
      this.applicationLimit = 5;

      this.fetchApplications()
    },
    
    applications : [],
    isApplicationsLoading: false,
    applicationSkip: 0,
    applicationLimit: 5,
    textLoadMore: '',
    textMoveTo: '',
    fetchApplications() {
      this.isApplicationsLoading = true;
      fetch(`https://www.onlinecasting.dk/api/applications/applications.asp?skip=${this.applicationSkip}&limit=${this.applicationLimit}&folder=${this.currentChatFolder}&orderby=${this.currentOrderBy}&filter=${this.currentFilterBy}`)
          .then(response => response.json())
          .then(data => {
              if (data && Array.isArray(data.applications)) {
                  this.textLoadMore = data.text_load_more;
                  this.showLoadMoreBtn = data.load_more;
                  this.textMoveTo = data.text_move_to;
                  this.applications = [...this.applications, ...data.applications];
                  this.applicationSkip += this.applicationLimit;
              }
          })
          .catch(error => {
            this.applications = [];
            console.error("Error fetching applications:", error);
          })
          .finally(() => {
              this.isApplicationsLoading = false;
              this.initializeTooltips();
              // console.log('Application fetched')
          });
    },

    setRating(rating, applicationid) {
      fetch(`https://www.onlinecasting.dk/api/applications/rate_application_profile.asp?rating=${rating}&applicationid=${applicationid}`)
          .then(response => response.json())
          .then(data => {
            if (data.Status === 'OK') {
              console.log(data.StatusMessage);
            }
          })
          .catch(error => {
            console.error("Error setting ratings:", error);
          })
    },

      isFetchingNotes: false,
      notes: [], 
      statusMessageHeadline: '',
      textSubmitButton: '',
      textHeaderInputNote: '',
      statusMessage: '',
      currentApplicationID: '',
      currentProfileID: '',
      
      fetchNotes(applicationId, profileId) {
        this.isFetchingNotes = true;
        this.currentApplicationID = applicationId,
        this.currentProfileID = profileId,
        fetch(`https://www.onlinecasting.dk/api/notes_profile.asp?profileid=${profileId}&applicationid=${applicationId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  
                  // profileModalInstance.hide(); 

                  this.notes = data.notes;
                  this.statusMessageHeadline = data.StatusMessageHeadline;
                  this.textSubmitButton = data.text_submit_button;
                  this.textHeaderInputNote = data.text_header_input_note;
                  this.textClose = data.text_close;

                  notesModalInstance.show(); 
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {

                  // profileModalInstance.hide(); 

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error fetching Notes:", error);
            })
            .finally(() => {
                this.isFetchingNotes = false;
            });
      },


      newNote: '',
      isCreatingNote: false,
      createNote() {
        this.isCreatingNote = true;
        fetch(`https://www.onlinecasting.dk/api/notes_profile_submit.asp?profileid=${this.currentProfileID}&applicationid=${this.currentApplicationID}&note=${this.newNote}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  const newNote = {
                    note_id: data.note_id, 
                    title: data.title,  
                    text: data.text,
                    delete_link_text: data.delete_link_text  
                  };
                  
                  this.notes.push(newNote); 
                }
                 
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  notesModalInstance.hide(); 

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error adding note:", error);
            })
            .finally(() => {
                this.newNote = '';
                this.isCreatingNote = false;
            });
      },

      deleteNote(noteId) {
        this.isDeletingNote = true;

        fetch(`https://www.onlinecasting.dk/api/notes_profile_delete.asp?noteid=${noteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  this.notes = this.notes.filter(note => note.note_id !== noteId);
                }
                 
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  notesModalInstance.hide(); 

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error deleting note:", error);
            })
            .finally(() => {
                this.isDeletingNote = false;
            });
      },

      isFetchingSms: false,
      textHtml: '', 
      textClose : '',
      textHeaderInput: '',
      casterPhoneValidated : '',

      fetchSMS(applicationId, profileId) {
        this.isFetchingSms = true;
        this.currentApplicationID = applicationId,
        this.currentProfileID = profileId,
        fetch(`https://www.onlinecasting.dk/api/sms_to_profile_from_caster.asp?profileid=${profileId}&applicationid=${applicationId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {

                  // profileModalInstance.hide(); 
                  
                  this.casterPhoneValidated = data.caster_phone_validated;
                  this.textHtml = data.text_html;
                  this.statusMessageHeadline = data.StatusMessageHeadline;
                  this.textSubmitButton = data.text_submit_button;
                  this.textHeaderInput = data.text_header_input;
                  this.textClose = data.text_close;

                  sendSmsModalInstance.show(); 
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {

                  // profileModalInstance.hide(); 
                  
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error sending sms to profile:", error);
            })
            .finally(() => {
                this.isFetchingSms = false;
            });
      },

      newSMS: '',
      isSendingSMS: false,
      sendSMS() {
        this.isSendingSMS = true;        
        fetch(`https://www.onlinecasting.dk/api/sms_to_profile_from_caster_send.asp?profileid=${this.currentProfileID}&applicationid=${this.currentApplicationID}&text=${this.newSMS}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  sendSmsModalInstance.hide(); 

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  if (data.ShowMessage == 'YES') { 
                    statusModalInstance.show(); 
                  }
                }
                 
                else if (data.Status == 'ERROR') {
                  sendSmsModalInstance.hide(); 

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
                  
                  if (data.ShowMessage == 'YES') { 
                    statusModalInstance.show(); 
                  }
                }  
            })
            .catch(error => {
                console.error("Error adding note:", error);
            })
            .finally(() => {
                this.newSMS = '';
                this.isSendingSMS = false;
            });
      },

      isChangingHiring: false,
      changeHiring(newStatus, applicationId) {
        this.isChangingHiring = true;

        fetch(`https://www.onlinecasting.dk/api/applications/change_hired.asp?applicationid=${applicationId}&hired=${newStatus}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  const application = this.applications.find(app => app.applicationid === applicationId);
                 
                  if (application) {
                    application.hired = newStatus;
                    this.profile.hired = newStatus;
                  }
                  if (data.ShowMessage == 'YES') {
                      this.statusMessageHeadline = data.StatusMessageHeadline
                      this.statusMessage = data.StatusMessage
                      this.textClose = data.text_close
                      statusModalInstance.show(); 
                  }
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                    this.statusMessageHeadline = data.StatusMessageHeadline
                    this.statusMessage = data.StatusMessage
                    this.textClose = data.text_close
                    statusModalInstance.show(); 
                }  
            })
            .catch(error => {
                console.error("Error changing Hiring:", error);
            })
            .finally(() => {
                this.isChangingHiring = false;
            });
      },

      

      isFetchingProfile : false,
      profile: '',
      currentApplication : '',
      totalApplications : '',
      fetchProfile(applicationId) {
        this.isFetchingProfile = true;
        fetch(`https://www.onlinecasting.dk/api/applications/application_profile.asp?applicationid=${applicationId}&orderby=${this.currentOrderBy}&folder=${this.currentChatFolder}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data,'data')
                this.profile = data;
                this.currentApplication = this.profile.text_numberofapplications.split(' af ')[0];
                this.totalApplications = this.profile.text_numberofapplications.split(' af ')[1];
                profileModalInstance.show(); 

                const newUrl = `${window.location.pathname}?applicationid=${applicationId}`;
                history.pushState({ applicationId: applicationId }, '', newUrl);
            })
            .catch(error => {
                console.error("Error fetching Profile:", error);
            })
            .finally(() => {
                this.isFetchingProfile = false;
                
                this.initializeTooltips();
                // refreshMasonry();
                reloadMasonry();
                
                document.querySelector('#profileModal .modal-body').scrollTo({ top: 0, behavior: 'smooth' }); 
                setTimeout(() => {
                  initializeMasonry()  
                }, 500);
            });
      },

      handleModalClose() {
        // Remove the applicationid parameter from the URL
        const newUrl = window.location.pathname;
        history.pushState({}, '', newUrl);
      },
  }
}