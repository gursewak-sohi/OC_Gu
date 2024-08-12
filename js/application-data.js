
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

let shareChatModal = document.getElementById('shareChatModal');
let shareChatModalInstance = bootstrap.Modal.getInstance(shareChatModal);
if (!shareChatModalInstance) {
  shareChatModalInstance = new bootstrap.Modal(shareChatModal);
}

let profileModal = document.getElementById('profileModal');
let profileModalInstance = bootstrap.Modal.getInstance(profileModal);
if (!profileModalInstance) {
  profileModalInstance = new bootstrap.Modal(profileModal);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

 
// When click browser back button close application modal
// window.onpopstate = (event) => {
//   if (event.state && event.state.applicationId) {
//     window.fetchProfile(event.state.applicationId);
//   } else {
//     profileModalInstance.hide();
//   }
// };

// Function to initialize or reinitialize Masonry
function initializeMasonry() {
  $(".grid").imagesLoaded(function() {
      $(".grid").masonry({
          itemSelector: ".grid-item"
      });
  });
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
    currentView: '',
    showLoadMoreBtn: '',
    folders : [],
    currentChatFolder: '',
    shareLinkText: '',

    setCurrentView(view) {
      this.currentView = view;
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('view', view);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      history.pushState({ view: view }, '', newUrl);
    },

    fetchFolders() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_folders.asp?auditionid=23406`)
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'folders'); 
              if (data && Array.isArray(data.folders)) {
                  this.shareLinkText = data.text_sharelink;
                  this.folders = data.folders.map(folder => {
                    return {
                      ...folder,
                      number_of_applications: parseInt(folder.number_of_applications, 10)
                    };
                  });
                  // Find the folder with default set to True
                  // const defaultFolder = data.folders.find(folder => folder.default === "True");
                  // if (defaultFolder) {
                  //     this.currentChatFolder = defaultFolder.searchname;
                  // }
              }
          })
          .catch(error => {
              console.error("Error fetching applications folders:", error);
          })
          .finally(() => {
              // console.log('Folder fetched')
          });
    },

    linkToShare : '',
    textCopyLink : '',
    shareChatFolder() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_share.asp?auditionid=23406&folder=YES`)
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'share chat'); 
              if (data.Status === 'OK') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.textHtml = data.text_html;
                  this.statusMessage = data.StatusMessage;
                  this.textClose = data.text_close;
                  this.linkToShare = data.link_to_share;
                  this.textCopyLink = data.text_copy_link;
                  this.textCopiedLink = data.text_link_copied;
                  shareChatModalInstance.show(); 
              }
              else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                this.statusMessageHeadline = data.StatusMessageHeadline
                this.statusMessage = data.StatusMessage
                this.textClose = data.text_close
                statusModalInstance.show();  
              } 
          })
          .catch(error => {
              console.error("Error sharing chat:", error);
          })
          .finally(() => {
              // console.log('Folder fetched')
          });
    },
    
    isCopied : null,
    copyLink(linkToShare, type) {
      navigator.clipboard.writeText(linkToShare)
          .then(() => {
              this.isCopied = type,
              setTimeout(() => {
                this.isCopied = null;
              }, 2000);
          })
          .catch(err => {
              console.error('Failed to copy text: ', err);
          });
    },

    changeChatFolder(newFolder) {
      this.currentChatFolder = newFolder;
      this.applications = [];
      this.applicationSkip = 0;
      this.applicationLimit = 5;

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('folder', newFolder);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      history.pushState({ folder: newFolder }, '', newUrl);

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
              // console.log(data, 'isApplicationsLoading')
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
                  this.notes = data.notes;
                  this.statusMessageHeadline = data.StatusMessageHeadline;
                  this.textSubmitButton = data.text_submit_button;
                  this.textHeaderInputNote = data.text_header_input_note;
                  this.textClose = data.text_close;

                  notesModalInstance.show(); 
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
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
                if (this.notes.length > 0) {
                  this.applicationHasNotes = true
                }
                else {
                  this.applicationHasNotes = false
                }
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
                if (this.notes.length > 0) {
                  this.applicationHasNotes = true
                }
                else {
                  this.applicationHasNotes = false
                }
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
                  
                  this.casterPhoneValidated = data.caster_phone_validated;
                  this.textHtml = data.text_html;
                  this.statusMessageHeadline = data.StatusMessageHeadline;
                  this.textSubmitButton = data.text_submit_button;
                  this.textHeaderInput = data.text_header_input;
                  this.textClose = data.text_close;

                  sendSmsModalInstance.show(); 
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  
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

      applicationHasNotes: false,
      fetchProfile(applicationId) {
        this.isFetchingProfile = true;
        this.applicationHasNotes = false;
        fetch(`https://www.onlinecasting.dk/api/applications/application_profile.asp?applicationid=${applicationId}&orderby=${this.currentOrderBy}&folder=${this.currentChatFolder}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data,'data')
                this.profile = data;
                if (data.notes_on_profile === "YES") {
                  this.applicationHasNotes = true
                }
                this.currentApplication = this.profile.text_numberofapplications.split(' af ')[0];
                this.totalApplications = this.profile.text_numberofapplications.split(' af ')[1];
                profileModalInstance.show(); 
                document.querySelector('#profileModal .modal-body').scrollTo({ top: 0 });     
                debounce(() => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set('applicationid', applicationId);
                  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
                  history.pushState({ applicationId: applicationId }, '', newUrl);
              }, 100)(); 

            })
            .catch(error => {
                console.error("Error fetching Profile:", error);
            })
            .finally(() => {
                this.initializeTooltips();
                // refreshMasonry();
                reloadMasonry();
                
                setTimeout(() => {
                  initializeMasonry()  
                  setTimeout(() => {
                    this.isFetchingProfile = false;
                  }, 100);
                }, 500);
            });
      },

      handleModalClose() {
        // Debounced URL cleanup
        debounce(() => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.delete('applicationid');  // Remove only the applicationid parameter
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({}, '', newUrl);
            profileModalInstance.hide();
        }, 100)(); // Adjust the debounce delay as necessary
    }    
  }
}