 



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

      isDownloadingPDF : false,
      downloadPDF(profileId, folderid, pageId) {
          this.isDownloadingPDF = true;
          
          let url = "https://www.onlinecasting.dk/api/profile_folders_pdf.asp";
          let params = [];
          if (profileId) params.push(`profileid=${profileId}`);
          if (folderid) params.push(`folderid=${folderid}`);
          if (pageId) params.push(`page=${pageId}`);

          if (params.length > 0) url += `?${params.join('&')}`;

          
          fetch(url)
              .then(response => response.json())
              .then(data => {
                  if (data.Status == 'OK') {
                    this.generatePDF(data.profiles, data.filename);
                  }
                  else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
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
                  console.error("Error downloading pdf:", error);
              })
              .finally(() => {
                  this.isDownloadingPDF = false;
              });
      },

    

    async generatePDF(profiles, filename) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
    
        for (const [index, profile] of profiles.entries()) {
            if (index !== 0) doc.addPage();

            // Draw a border around the page
            doc.setDrawColor(0); // Set color to black
            doc.setLineWidth(4); // Set line width to approximately 4 pixels (1mm ≈ 2.83 px)
            doc.rect(0, 0, 210, 297, 'S'); // Draw rectangle for the border (A4: 210x297mm, reduced by 4mm on each side)
            doc.setTextColor(0, 0, 0);
            
           // Add light font
            doc.addFont('./fonts/mulish/Mulish-Light.ttf', 'Mulish', 'light');
            doc.addFont('./fonts/mulish/Mulish-Regular.ttf', 'Mulish', 'normal');
            doc.addFont('./fonts/mulish/Mulish-SemiBold.ttf', 'Mulish', 'semibold');
            doc.addFont('./fonts/mulish/Mulish-Bold.ttf', 'Mulish', 'bold');
            doc.addFont('./fonts/mulish/Mulish-Black.ttf', 'Mulish', 'black');
            

           

            // Calculate the position of 'CPH' to center it.
            if (profile.logo) {
                // Set 'CPH' in light font
                doc.setFont('Mulish', 'light');
                doc.setFontSize(22);
                let cphText = 'CPH';
                let castingText = 'CASTING';
                let cphWidth = doc.getTextWidth(cphText);
                let castingWidth = doc.getTextWidth(castingText);
                let totalWidth = cphWidth + castingWidth;
                let startX = 105 - (totalWidth / 2);
                doc.text(cphText, startX, 20);
                doc.setFont('Mulish', 'bold');
                startX += cphWidth;
                doc.text(castingText, startX, 20);
            }
           
            // Main Image
            const mainImageInfo = await this.loadImage(profile.images[0], 400, 500);
            doc.addImage(mainImageInfo, 'JPEG', 15, 35, 80, 100);

            // Profile Name and Details
            doc.setFont('Mulish', 'bold');
            doc.setFontSize(22);
            doc.text(`${profile.name}`, 105, 41);

            doc.setTextColor(150, 150, 150);
            doc.setFont('Mulish', 'bold');
            doc.setFontSize(15);
            doc.text(`${profile.age}, ${profile.area}`, 105, 48, 'left');
            
          

            // Attributes List/Table
            // Use doc.text() to place attribute names and values
            let startY = 58;

       
            doc.setFontSize(12);
            doc.setFont('Mulish', 'normal');

            profile.attributes.forEach(attr => {
              doc.setTextColor(0, 0, 0); // Black for attribute names
              doc.text(attr.Name, 105, startY, 'left');
              doc.setTextColor(150, 150, 150); // Grey for attribute values
              doc.text(attr.Value, 185, startY, 'right');
              startY += 9.5; // Increment the Y position for the next attribute
            });

 

            // Smaller Images         
            const smallerImages = await Promise.all(profile.images.map(imageUrl => this.loadImage(imageUrl, 300, 300)));
            smallerImages.forEach((imageData, index) => {
              // Calculate x and y positions based on your desired grid layout
              let x = 15 + (index % 3) * 60; // Adjust grid column spacing
              let y = 150 + Math.floor(index / 3) * 60; // Adjust grid row spacing
              doc.addImage(imageData, 'JPEG', x, y, 50, 50); // Size of each small image
            });

            

            // Footer text and URL
            if (profile.showbottom == 'TRUE') {

                 // Footer background
                const footerHeight = 20; // for example, 20 mm high footer
                doc.setFillColor(0); // black color
                doc.rect(0, 297 - footerHeight, 210, footerHeight, 'F');

                doc.setTextColor(255); // white color text
                doc.setFont('Mulish', 'bold');
                doc.setFontSize(14);
                const textY = 297 - footerHeight / 2; 
                doc.text(profile.profileurl_text, 70, textY - 1.5); 

                // Footer clickable URL
                doc.setFontSize(10);
                doc.setFont('Mulish', 'normal');
                doc.textWithLink(profile.profileurl, 70, textY + 4.5, { url: profile.profileurl });

                // Add logo image in the footer
                const logoImage = await this.loadImage(profile.logo); 
                doc.addImage(logoImage, 'JPEG', 11, 297 - footerHeight + 6, 50, 7.5);  
                // Overlay Link
                doc.link(10, 297 - footerHeight + 6, 50, 7.5, { url: "https://www.onlinecasting.dk/" });
            }
        }
    
        doc.save(filename);
    },

    async loadImage(url, targetWidth, targetHeight) {
      return new Promise((resolve, reject) => {
          let img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
              // If target dimensions are not provided, use image's natural size
              let canvasWidth = targetWidth || img.width;
              let canvasHeight = targetHeight || img.height;
  
              let canvas = document.createElement('canvas');
              canvas.width = canvasWidth;
              canvas.height = canvasHeight;
              let ctx = canvas.getContext('2d');
  
              // Only adjust aspect ratio if both targetWidth and targetHeight are provided
              if (targetWidth && targetHeight) {
                  let aspectRatio = img.width / img.height;
                  let targetAspectRatio = targetWidth / targetHeight;
  
                  if (aspectRatio > targetAspectRatio) {
                      // Image is too wide
                      let scaledHeight = targetHeight;
                      let scaledWidth = img.width * (scaledHeight / img.height);
                      let offsetX = (targetWidth - scaledWidth) / 2; // Center horizontally
                      ctx.drawImage(img, offsetX, 0, scaledWidth, scaledHeight);
                  } else {
                      // Image is too tall or perfectly fits
                      let scaledWidth = targetWidth;
                      let scaledHeight = img.height * (scaledWidth / img.width);
                      let offsetY = (targetHeight - scaledHeight) / 2; // Center vertically
                      ctx.drawImage(img, 0, offsetY, scaledWidth, scaledHeight);
                  }
              } else {
                  // Draw the image as is
                  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
              }
  
              resolve(canvas.toDataURL('image/jpeg')); // Change to 'image/jpeg' to reduce size
          };
          img.onerror = () => reject(new Error(`Could not load image at ${url}`));
          img.src = url;
      });
  },

  
    
    
    
    init() {},
  }));
});

 