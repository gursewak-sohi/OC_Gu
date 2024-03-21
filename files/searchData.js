 

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'));


document.addEventListener("alpine:init", () => {
  Alpine.data('searchComponent', () => ({

      enableClick: window.innerWidth < 576,
      positionLeft: false,
      updatePosition(submenuRef) {
        if (!submenuRef) return;
        let submenuRect = submenuRef.getBoundingClientRect();
        let rightSpace = window.innerWidth - submenuRect.right;
        const submenuWidth = 260;
        this.positionLeft = rightSpace < submenuWidth;
    },

  
      submenuOpen:false,
      isLoadingImages: false,
      images: [],
      fetchImages(profileId) {
        this.isLoadingImages = true;
        fetch(`https://proxy.cors.sh/https://www.onlinecasting.dk/api/profile_images.asp?profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
                this.images = data.images;
                this.$nextTick(() => {
                  const fancyBoxItems = this.images.map(image => ({
                    src: image.imageurl,
                    type: 'image',  
                    opts: {
                      caption: `${image.datecreated}`,
                    }
                 }));
                  $.fancybox.open(fancyBoxItems, {
                      loop: true,
                  });
              });
            })
            .catch(error => {
                console.error("Error fetching video data:", error);
            })
            .finally(() => {
                this.isLoadingImages = false;
            });
      },

      isLoadingVideos: false,
      videos: [],
      fetchVideos(profileId) {
          this.isLoadingVideos = true;
          fetch(`https://proxy.cors.sh/https://www.onlinecasting.dk/api/profile_videos.asp?profileid=${profileId}`)
              .then(response => response.json())
              .then(data => {
                  this.videos = data.videos;
                  this.$nextTick(() => {
                    const fancyBoxItems = this.videos.map(video => ({
                        src: video.url,
                        type: 'iframe',
                        width: 960,
                        height: 540,
                        opts: {
                          iframe: {
                              preload: false,
                              css: {
                                background: 'black', 
                            }
                          }
                      }
                    }));
                    $.fancybox.open(fancyBoxItems, {
                        loop: true,
                    });
                });
              })
              .catch(error => {
                  console.error("Error fetching video data:", error);
              })
              .finally(() => {
                  this.isLoadingVideos = false;
              });
      },

      isLoadingAudios: false,
      audios: [],
      fetchAudios(profileId) {
        this.isLoadingAudios = true;
        fetch(`https://proxy.cors.sh/https://www.onlinecasting.dk/api/profile_audio.asp?profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data.audio)
                this.audios = data.audio;
                this.$nextTick(() => {
                  const fancyBoxItems = this.audios.map(audio => ({
                      src: audio.src,
                      type: 'iframe',
                      width: 340,
                      height: 200,
                      opts: {
                        iframe: {
                            preload: false,
                            css: {
                              background: 'black', 
                          }
                        },
                        afterShow: function(instance, current) {
                          $(".fancybox-content").css({
                            "padding": "20px" 
                          });
                          $(".fancybox-content").append(`<div class='audio-filename'>${audio.filename}.mp3</div>`);
                        },
                        // caption: `${audio.filename}.mp3`,
                    }
                  }));
                  $.fancybox.open(fancyBoxItems, {
                      loop: true,
                  });
              });
            })
            .catch(error => {
                console.error("Error fetching audio data:", error);
            })
            .finally(() => {
                this.isLoadingAudios = false;
            });
      },

      isLoadingOptions: false,
      castings: [],
      options: {},
      fetchOptions(profileId, submenuRef) {
       
          this.isLoadingOptions = true;
          this.updatePosition(submenuRef);
          fetch(`https://www.onlinecasting.dk/api/caster_profile_options.asp?profileid=${profileId}`)
              .then(response => response.json())
              .then(data => {
                  if (data.status == 'OK') {
                     this.castings = data.castings;
                     this.options = data;
                  }
                  else if (data.status == 'ERROR') {
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
                  console.error("Error fetching video data:", error);
              })
              .finally(() => {
                  this.isLoadingOptions = false;
              });
      },

      isAskingSelfie: false,
      sendSelfie(profileId) {
          this.isAskingSelfie = true;
          fetch(`https://www.onlinecasting.dk/api/message_profile_send_selfie.asp?profileid=${profileId}`)
              .then(response => response.json())
              .then(data => {
                  if (data.Status == 'OK') {
                    // this.statusMessageHeadline = data.StatusMessageHeadline
                    this.statusMessage = data.StatusMessage
                    this.statusImage = data.image
                    // this.messageTextClose = data.text_close
                    toastBootstrap.show();
                    // this.fetchOptions(profileId);
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
                  console.error("Error fetching video data:", error);
              })
              .finally(() => {
                  this.isAskingSelfie = false;
              });
      },

      isInvitingCasting: false,
      inviteCasting(profileId, auditionId) {
          this.isInvitingCasting = true;
          fetch(`https://www.onlinecasting.dk/api/caster_profile_options_invite.asp?profileid=${profileId}&auditionid=${auditionId}`)
              .then(response => response.json())
              .then(data => {
                  if (data.Status == 'OK') {
                    // this.statusMessageHeadline = data.StatusMessageHeadline
                    this.statusMessage = data.StatusMessage
                    this.statusImage = data.image
                    // this.messageTextClose = data.text_close
                    toastBootstrap.show();
                    // this.fetchOptions(profileId);
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
                  console.error("Error fetching video data:", error);
              })
              .finally(() => {
                  this.isInvitingCasting = false;
              });
      },

      currentProfileId: '',
      isLoadingMessage: false,
      messageHeadline: '',
      messageImage : '',
      messageTextHtml: '',
      messageHeadlineMessageBox: '',
      messageTextSubmit: '',
      messageTextClose: '',
      statusMessageHeadline: '',
      statusMessage: '',
      statusImage: '',
      messageProfile(profileId) {
        this.currentProfileId = profileId;
        this.isLoadingMessage = true;
        fetch(`https://proxy.cors.sh/https://www.onlinecasting.dk/api/message_profile.asp?profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
              if (data.Status == 'OK') {

                this.messageHeadline = data.headline
                this.messageImage = data.image
                this.messageTextHtml = data.text_html
                this.messageHeadlineMessageBox = data.headline_messagebox
                this.messageTextSubmit = data.text_submit
                this.messageTextClose = data.text_close

                let reportModal = document.getElementById('reportModal');
                let reportModalInstance = bootstrap.Modal.getInstance(reportModal);
                if (!reportModalInstance) {
                  reportModalInstance = new bootstrap.Modal(reportModal);
                }
                reportModalInstance.show();
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
                console.error("Error fetching message data:", error);
            })
            .finally(() => {
                this.isLoadingMessage = false;
            });
      },

      //  Post Messages
      newMessage: '',
      postProfileMessage() {  
          const url = "https://proxy.cors.sh/https://www.onlinecasting.dk/api/message_profile_send.asp";

          const data = {
              profileid: this.currentProfileId,
              message: this.newMessage,
          };
          
          fetch(url, {
              method: 'POST',
              headers: {
                  'x-cors-api-key': 'temp_eef745625cb54bc7665a1785f4bee6a9',
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams(data).toString()
          })
          .then(response => response.json())
          .then(data => {
              let reportModal = document.getElementById('reportModal');
              let reportModalInstance = bootstrap.Modal.getInstance(reportModal);
              if (!reportModalInstance) {
                reportModalInstance = new bootstrap.Modal(reportModal);
              }
              reportModalInstance.hide();


              this.newMessage = '';
              this.statusMessageHeadline = data.StatusMessageHeadline
              this.statusMessage = data.StatusMessage
              this.messageTextClose = data.text_close

              let statusModal = document.getElementById('statusModal');
              let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
              if (!statusModalInstance) {
                statusModalInstance = new bootstrap.Modal(statusModal);
              }
              statusModalInstance.show();  
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      },
      init() {
          // Optional
      }
  }));
});

 