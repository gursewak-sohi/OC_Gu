 document.addEventListener("alpine:init", () => {
  Alpine.data('applicationComponent', () => ({

    currentView: 'list',
  
    folders : [],
    currentChatFolder: '',
    fetchFolders() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications_folders.asp?auditionid=23406`)
          .then(response => response.json())
          .then(data => {
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
              console.log('Folder fetched')
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
    moveToFolder(newFolder, applicationid) {
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
               
              console.log(data.StatusMessage);
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
              console.log('Orderby fetched')
          });
    },

    changeOrderBy(newOrder) {
      this.currentOrderBy = newOrder;
      this.applications = [];
      this.applicationSkip = 0;
      this.applicationLimit = 5;

      this.fetchApplications()
    },

    applications : [],
    applicationSkip: 0,
    applicationLimit: 5,
    fetchApplications() {
      fetch(`https://www.onlinecasting.dk/api/applications/applications.asp?skip=${this.applicationSkip}&limit=${this.applicationLimit}&folder=${this.currentChatFolder}&orderby=${this.currentOrderBy}`)
          .then(response => response.json())
          .then(data => {
              if (data && Array.isArray(data.applications)) {
                  // this.applications = data.applications;
                  this.applications = [...this.applications, ...data.applications];
                  this.applicationSkip += this.applicationLimit;
              }
          })
          .catch(error => {
            console.error("Error fetching applications:", error);
          })
          .finally(() => {
              console.log('Application fetched')
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


    init() {
       this.fetchFolders();
       this.fetchOrderBy();
       this.fetchApplications();
    },
 
  }));
});

 