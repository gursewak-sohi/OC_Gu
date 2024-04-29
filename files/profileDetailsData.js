 



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

      profiles: [

        {

            "name": "Teresa",

            "area": "København",

            "age": 37,

            "profileurl_text": "Link til profil:",

            "profileurl": "https://www.onlinecasting.dk/vistype1profil.asp?Profil_Id=171903",

            "logo": "img/logo.png",

            "attributes": [

                {

                    "Name": "Højde",

                    "Value": "170 cm"

                },

                {

                    "Name": "Vægt",

                    "Value": "65 kg"

                },

                {

                    "Name": "Øjenfarve",

                    "Value": "Grøn"

                },

                {

                    "Name": "Hårfarve",

                    "Value": "Brun"

                },

                {

                    "Name": "Hårlængde",

                    "Value": "Langt"

                },

                {

                    "Name": "Skostørrelse",

                    "Value": "37"

                },

                {

                    "Name": "Bluse str.",

                    "Value": "M"

                },

                {

                    "Name": "Bukse str.",

                    "Value": ""

                },

                {

                    "Name": "Etnicitet",

                    "Value": "Latino"

                }

            ],

            "images": [

              "img/modal.jpeg",    

            ],

            "profileid": "171903",

            "imagepath": ""

        },

        {

            "name": "Hooman",

            "area": "Rødovre",

            "age": 16,

            "profileurl_text": "Link til profil:",

            "profileurl": "https://www.onlinecasting.dk/vistype1profil.asp?Profil_Id=171939",

            "logo": "img/logo.png",

            "attributes": [

                {

                    "Name": "Højde",

                    "Value": "180 cm"

                },

                {

                    "Name": "Vægt",

                    "Value": "64 kg"

                },

                {

                    "Name": "Øjenfarve",

                    "Value": "Brun"

                },

                {

                    "Name": "Hårfarve",

                    "Value": "Sort"

                },

                {

                    "Name": "Hårlængde",

                    "Value": "Langt"

                },

                {

                    "Name": "Skostørrelse",

                    "Value": "43"

                },

                {

                    "Name": "Bluse str.",

                    "Value": "S"

                },

                {

                    "Name": "Bukse str.",

                    "Value": "M"

                },

                {

                    "Name": "Etnicitet",

                    "Value": "Mellemøstligt"

                }

            ],

            "images": [

                "img/modal.jpeg",    
                "img/profile-2.png",
                "img/profile-2.png",
                "img/profile-2.png",
                "img/profile-2.png",

            ],

            "profileid": "171939",

            "imagepath": ""

        },

        {

            "name": "Laura",

            "area": "Sjælland",

            "age": 10,

            "profileurl_text": "Link til profil:",

            "profileurl": "https://www.onlinecasting.dk/vistype1profil.asp?Profil_Id=171952",

            "logo": "img/logo.png",

            "attributes": [

                {

                    "Name": "Højde",

                    "Value": "156 cm"

                },

                {

                    "Name": "Vægt",

                    "Value": "45 kg"

                },

                {

                    "Name": "Øjenfarve",

                    "Value": "Blå"

                },

                {

                    "Name": "Hårfarve",

                    "Value": "Mørk blond"

                },

                {

                    "Name": "Hårlængde",

                    "Value": "Langt"

                },

                {

                    "Name": "Skostørrelse",

                    "Value": "43"

                },

                {

                    "Name": "Bluse str.",

                    "Value": "158"

                },

                {

                    "Name": "Bukse str.",

                    "Value": "164"

                },

                {

                    "Name": "Etnicitet",

                    "Value": "Skandinavisk / Europæisk"

                }

            ],

            "images": [
              "img/modal.jpeg",    
              "img/profile-2.png",
              "img/profile-2.png",
               
            ],

            "profileid": "171952",

            "imagepath": ""

        },

        {

            "name": "Sascha",

            "area": "Randers",

            "age": 29,

            "profileurl_text": "Link til profil:",

            "profileurl": "https://www.onlinecasting.dk/vistype1profil.asp?Profil_Id=172068",

            "logo": "img/logo.png",

            "attributes": [

                {

                    "Name": "Højde",

                    "Value": "168 cm"

                },

                {

                    "Name": "Vægt",

                    "Value": "83 kg"

                },

                {

                    "Name": "Øjenfarve",

                    "Value": "Brun"

                },

                {

                    "Name": "Hårfarve",

                    "Value": "Brun"

                },

                {

                    "Name": "Hårlængde",

                    "Value": "Langt"

                },

                {

                    "Name": "Skostørrelse",

                    "Value": "41"

                },

                {

                    "Name": "Bluse str.",

                    "Value": "M"

                },

                {

                    "Name": "Bukse str.",

                    "Value": "M"

                },

                {

                    "Name": "Etnicitet",

                    "Value": "Skandinavisk / Europæisk"

                }

            ],

            "images": [

              "img/modal.jpeg",    
              "img/profile-2.png",
              "img/profile-2.png",
              "img/profile-2.png",
              "img/profile-2.png",
            ],

            "profileid": "172068",

            "imagepath": ""

        }

    ],

    filename: "172068.pdf",


      
    // profiles : [
    //         {
    //             "name": "Sascha",
    //             "area": "Randers",
    //             "age": 29,
    //             "profileurl_text": "Link til profil:",
    //             "profileurl": "https://www.onlinecasting.dk/vistype1profil.asp?Profil_Id=172068",
    //             "logo": "img/logo.png",
    //             "attributes": [
    //                 {
    //                     "Name": "Højde",
    //                     "Value": "168 cm"
    //                 },
    //                 {
    //                     "Name": "Vægt",
    //                     "Value": "83 kg"
    //                 },
    //                 {
    //                     "Name": "Øjenfarve",
    //                     "Value": "Brun"
    //                 },
    //                 {
    //                     "Name": "Hårfarve",
    //                     "Value": "Brun"
    //                 },
    //                 {
    //                     "Name": "Hårlængde",
    //                     "Value": "Langt"
    //                 },
    //                 {
    //                     "Name": "Skostørrelse",
    //                     "Value": "41"
    //                 },
    //                 {
    //                     "Name": "Bluse str.",
    //                     "Value": "M"
    //                 },
    //                 {
    //                     "Name": "Bukse str.",
    //                     "Value": "M"
    //                 },
    //                 {
    //                     "Name": "Etnicitet",
    //                     "Value": "Skandinavisk / Europæisk"
    //                 }
    //             ],
    //             "images": [
    //               "img/modal.jpeg",    
    //               "img/profile-2.png",    
    //               "img/profile-3.png",    
    //               "img/profile-4.png",    
    //               "img/profile-5.png",    
    //               "img/profile-5.png",    
    //             ],
    
    //             "profileid": "172068",
    //             "imagepath": ""
    //         }
    //     ],
    

    async generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
    
        for (const [index, profile] of this.profiles.entries()) {
            if (index !== 0) doc.addPage();

            // Draw a border around the page
            doc.setDrawColor(0); // Set color to black
            doc.setLineWidth(4); // Set line width to approximately 4 pixels (1mm ≈ 2.83 px)
            doc.rect(0, 0, 210, 297, 'S'); // Draw rectangle for the border (A4: 210x297mm, reduced by 4mm on each side)
            doc.setTextColor(0, 0, 0);
            
           // Add light font
            doc.addFont('../fonts/mulish/Mulish-Light.ttf', 'Mulish', 'light');
            doc.addFont('../fonts/mulish/Mulish-Regular.ttf', 'Mulish', 'normal');
            doc.addFont('../fonts/mulish/Mulish-SemiBold.ttf', 'Mulish', 'semibold');
            doc.addFont('../fonts/mulish/Mulish-Bold.ttf', 'Mulish', 'bold');
            doc.addFont('../fonts/mulish/Mulish-Black.ttf', 'Mulish', 'black');
            

           // Set 'CPH' in light font
            doc.setFont('Mulish', 'light');
            doc.setFontSize(22);

            // Calculate the position of 'CPH' to center it.
            let cphText = 'CPH';
            let castingText = 'CASTING';
            let cphWidth = doc.getTextWidth(cphText);
            let castingWidth = doc.getTextWidth(castingText);
            let totalWidth = cphWidth + castingWidth;

            // Center the entire text block
            let startX = 105 - (totalWidth / 2);

            // Print 'CPH'
            doc.text(cphText, startX, 20);

            // Set 'CASTING' in bold font
            doc.setFont('Mulish', 'bold');

            // Adjust startX for the 'CASTING' part
            startX += cphWidth;

            // Print 'CASTING'
            doc.text(castingText, startX, 20);
           

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
            // Add more text elements for each profile detail (age, location, etc.)
          

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
            // Assuming these images are loaded similarly to the main image
            const smallerImages = await Promise.all(profile.images.map(imageUrl => this.loadImage(imageUrl, 300, 300)));
            smallerImages.forEach((imageData, index) => {
              // Calculate x and y positions based on your desired grid layout
              let x = 15 + (index % 3) * 60; // Adjust grid column spacing
              let y = 150 + Math.floor(index / 3) * 60; // Adjust grid row spacing
              doc.addImage(imageData, 'JPEG', x, y, 50, 50); // Size of each small image
            });

             // Footer background
            const footerHeight = 20; // for example, 20 mm high footer
            doc.setFillColor(0); // black color
            doc.rect(0, 297 - footerHeight, 210, footerHeight, 'F');

            // Footer text and URL
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
    
        doc.save(this.filename);
    },

    async loadImage(url, targetWidth, targetHeight) {
      return new Promise((resolve, reject) => {
          let img = new Image();
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
  
    
    
    
    init() {
      // fetch('https://www.onlinecasting.dk/api/profile_folders_pdf.asp?profileid=172068&folderid=0')
      //     .then(response => response.json())
      //     .then(data => {
      //       console.log(data.profiles, 'data.profiles')
      //         this.profiles = data.profiles;
      //     });
    },
  }));
});

 