 


document.addEventListener("alpine:init", () => {
  Alpine.data('profileDetailsComponent', () => ({
    
      messageTextClose: '',
      statusMessageHeadline: '',
      statusMessage: '',
      statusImage: '',

      savedProfilesFolders: [],
      isBookmarkingProfile: false,
      createNewListHeadline: '',

      bookmarkProfile(profileId) {
        this.currentProfileId = profileId;
        this.isBookmarkingProfile = true;
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/saved_profiles_folders.asp?profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {

                  this.statusMessageHeadline = data.headline
                  this.messageTextClose = data.text_close
                  this.savedProfilesFolders = data.saved_profiles_folders;
                  this.createNewListHeadline = data.create_new_list_headline;

                  let savedProfileModal = document.getElementById('savedProfileModal');
                  let savedProfileModalInstance = bootstrap.Modal.getInstance(savedProfileModal);
                  if (!savedProfileModalInstance) {
                    savedProfileModalInstance = new bootstrap.Modal(savedProfileModal);
                  }
                  savedProfileModalInstance.show();  
                  
                }
                else if (data.Status == 'ERROR') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.messageTextClose = data.text_close
  
                  let statusModal = document.getElementById('statusModal');
                  let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                  if (!statusModalInstance) {
                    statusModalInstance = new bootstrap.Modal(statusModal);
                  }
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error bookmarking profile:", error);
            })
            .finally(() => {
                this.isBookmarkingProfile = false;
            });
      },

      newListName: '',
      currentProfileId: '',
      createListTextHeadline : '',
      createListTextSumbit: '',
      createListTextName: '',
      createListTextClose : '',
      createList() {
        this.isCreatingList = true;
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/create_list.asp?profileid=${this.currentProfileId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  this.createListTextHeadline = data.text_headline
                  this.createListTextSumbit = data.text_submit
                  this.createListTextName = data.text_name;
                  this.createListTextClose = data.text_close;

                  let savedProfileModal = document.getElementById('savedProfileModal');
                  let savedProfileModalInstance = bootstrap.Modal.getInstance(savedProfileModal);
                  if (!savedProfileModalInstance) {
                    savedProfileModalInstance = new bootstrap.Modal(savedProfileModal);
                  }
                  savedProfileModalInstance.hide();

                  let createListModal = document.getElementById('createListModal');
                  let createListModalInstance = bootstrap.Modal.getInstance(createListModal);
                  if (!createListModalInstance) {
                    createListModalInstance = new bootstrap.Modal(createListModal);
                  }
                  createListModalInstance.show();  
                  
                }
                else if (data.Status == 'ERROR') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.messageTextClose = data.text_close
  
                  let statusModal = document.getElementById('statusModal');
                  let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                  if (!statusModalInstance) {
                    statusModalInstance = new bootstrap.Modal(statusModal);
                  }
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error bookmarking profile:", error);
            })
            .finally(() => {
                this.isCreatingList = false;
            });
      },

      isListNameExist : false,
      createListSumbit() {
        this.isCreatingList = true;
        this.isListNameExist = false;
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/create_list_submit.asp?profileid=${this.currentProfileId}&list_name=${this.newListName}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data, 'data')
                if (data.Status == 'OK' && data.ShowMessage == 'YES') {

                  let starIconClass = data.change_profile_starred === 'ON' ? 'stariconFill' : 'stariconoutline';
                  let starBtnText = data.change_profile_starred === 'ON' ? 'Gemt' : 'Gem';
                  $(`[data-profile="${this.currentProfileId}"] ion-icon`).removeClass('stariconFill stariconoutline').addClass(starIconClass);
                  $(`[data-profile="${this.currentProfileId}"] span`).text(starBtnText);

                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.messageTextClose = data.text_close
                  
                  let createListModal = document.getElementById('createListModal');
                  let createListModalInstance = bootstrap.Modal.getInstance(createListModal);
                  if (!createListModalInstance) {
                    createListModalInstance = new bootstrap.Modal(createListModal);
                  }
                  createListModalInstance.hide();

                  let statusModal = document.getElementById('statusModal');
                  let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                  if (!statusModalInstance) {
                    statusModalInstance = new bootstrap.Modal(statusModal);
                  }
                  this.$nextTick(() => {
                    setTimeout(() => {
                      statusModalInstance.show();  
                    }, 500);
                  });
                  this.newListName = '';
                }
                else if (data.Status == 'ERROR' && data.listname_exists == 'YES') {
                  this.isListNameExist = true;
                  this.statusMessage = data.StatusMessage 
                } 
                else if (data.Status == 'ERROR') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.messageTextClose = data.text_close
                  
                  let createListModal = document.getElementById('createListModal');
                  let createListModalInstance = bootstrap.Modal.getInstance(createListModal);
                  if (!createListModalInstance) {
                    createListModalInstance = new bootstrap.Modal(createListModal);
                  }
                  createListModalInstance.hide();

                  let statusModal = document.getElementById('statusModal');
                  let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                  if (!statusModalInstance) {
                    statusModalInstance = new bootstrap.Modal(statusModal);
                  }

                  this.$nextTick(() => {
                    setTimeout(() => {
                      statusModalInstance.show();  
                    }, 500);
                  });  
                }  
                this.newListName = '';
            })
            .catch(error => {
                console.error("Error bookmarking profile:", error);
            })
            .finally(() => {
                this.isCreatingList = false;
            });
      },

      isTextClickedVisible: true,
      isUpdatingBookingProfile: false,
      addRemoveBookmarkProfile(profileId, casterListId) {
        this.isUpdatingBookingProfile = true;
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/saved_profiles_folders.asp?profileid=${profileId}&casterlistid=${casterListId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status == 'OK') {
                  this.changeProfileStarred = data.change_profile_starred;
                  this.savedProfilesFolders = data.saved_profiles_folders;
                  this.isTextClickedVisible =  true;
                  this.$nextTick(() => {
                    setTimeout(() => {
                        this.isTextClickedVisible =  false;
                    }, 500);
                  });
                  let starIconClass = data.change_profile_starred === 'ON' ? 'stariconFill' : 'stariconoutline';
                  let starBtnText = data.change_profile_starred === 'ON' ? 'Gemt' : 'Gem';
                  $(`[data-profile="${profileId}"] ion-icon`).removeClass('stariconFill stariconoutline').addClass(starIconClass);
                  $(`[data-profile="${profileId}"] span`).text(starBtnText);
                }
                
                else if (data.Status == 'ERROR') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.messageTextClose = data.text_close
  
                  let statusModal = document.getElementById('statusModal');
                  let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
                  if (!statusModalInstance) {
                    statusModalInstance = new bootstrap.Modal(statusModal);
                  }
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error updaing bookmarking profile:", error);
            })
            .finally(() => {
                this.isUpdatingBookingProfile = false;
            });
      },

    
      init() {
          // Optional
      }
  }));
});

 