let sendMessage = document.getElementById('sendMessage');
let sendMessageInstance = bootstrap.Modal.getInstance(sendMessage);
if (!sendMessageInstance) {
    sendMessageInstance = new bootstrap.Modal(sendMessage);
}

let statusModal = document.getElementById('statusModal');
let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
if (!statusModalInstance) {
    statusModalInstance = new bootstrap.Modal(statusModal);
}

let shareModal = document.getElementById('shareModal');
if (shareModal) {
    let shareModalInstance = bootstrap.Modal.getInstance(shareModal);
    if (!shareModalInstance) {
        shareModalInstance = new bootstrap.Modal(shareModal);
    }
}



const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'));

function initializeOwlSlider() {
    $('.latestProfile').each(function () {
        var $carousel = $(this);

        // ✅ STEP 1: Clone all 'a' tags (slides)
        var slides = $carousel.find('a').clone();

        // ✅ STEP 2: Remove any <template> tags left
        $carousel.children('template').remove();

        // ✅ STEP 3: Clean ':style' attribute from each slide
        slides.each(function () {
            $(this).find('.profileCard').removeAttr(':style'); // Remove Alpine :style binding
        });

        // ✅ STEP 4: Clear existing content and re-insert cleaned slides
        $carousel.html(slides);

        // ✅ STEP 5: Initialize Owl only if not already initialized
        if (!$carousel.hasClass('owl-loaded')) {
            $carousel.owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                responsive: {
                    0: { items: 1 },
                    600: { items: 1 },
                    1000: { items: 1 }
                }
            });
        }
    });
}
 

document.addEventListener("alpine:init", () => {
    Alpine.data('messageProfilesComponent', () => ({
        textHtml: '', 
        statusMessageHeadline: '',
        statusMessage: '',
        statusImage: '',
        textClose: '',
        isFetchingMsgData: false,
        messageData: {},
        msgSingleImageUrl: '',
        msgMaxChar: 0,
        msgInputText: '',
        msgProfiles: [],
        currentSelectedTemplate: '',
        currentPage: '',
        currentCasterListId: '',

        htmlToPlainText(html) {
            return html
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/\\n/g, '\n');
        },

        profileData: {},
        profiles : [],
        isProfilesLoading: false,
        profileSkip: 0,
        profileLimit: 0,
       
        image: '',
        selectedProfiles: [],
        pagination: [],

        orderBy : [],
        currentOrderBy: '',

        get currentOrderByName() {
            const selectedOrder = this.orderBy.find(order => order.searchname === this.currentOrderBy);
            return selectedOrder ? selectedOrder.name : '';
        },

        fetchOrderBy() {
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/page_saved_profiles_orderbyWIP.asp`)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.folders)) {
                    this.orderBy = data.folders;
                    // Find the folder with default set to True
                    const defaultFolder = data.folders.find(folder => folder.default === "True");
                    if (defaultFolder) {
                        this.currentOrderBy = defaultFolder.searchname;
                    }
                    // this.fetchProfiles();
                }
            })
            .catch(error => {
                console.error("Error fetching applications order by:", error);
            })
            .finally(() => {
                // console.log('Orderby fetched')
            });
        },

       

        fetchProfiles() {
            this.isProfilesLoading = true;
            fetch(`https://www.onlinecasting.dk/api/savedprofiles/page_saved_profiles_folder_fullWIP.asp?&orderby=${this.currentOrderBy}&casterlistid=${this.currentCasterListId}&skip=${this.profileSkip}&limit=${this.profileLimit}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data, 'profileData')
                    this.profileData = data;
                    this.profiles = data.savedprofiles;
                    this.pagination = data.pagination;
                })
                .catch(error => {
                    this.profiles = [];
                    console.error("Error fetching applications:", error);
                })
                .finally(() => {
                    this.isProfilesLoading = false;
                    this.$nextTick(() => { 
                        initializeOwlSlider()    
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        this.initializeTooltips();
                    });
                });
        },

        deleteProfile(profileId) {
            // if (!confirm('Are you sure you want to delete this profile?')) return;
            
            fetch(`https://www.onlinecasting.dk/api/savedprofiles/page_saved_profiles_folder_full_delete_profileWIP.asp?casterlistid=${this.currentCasterListId}&profileid=${profileId}`)
            .then(response => response.json())
            .then(data => {
                if (data.Status === 'OK') {
                    // Remove profile from local profiles array
                    this.profiles = this.profiles.filter(profile => profile.profileid !== profileId);
                    
                    this.statusMessage = data.StatusMessage;
                    toastBootstrap.show();

                    this.$nextTick(() => { 
                        this.profiles = [];
                        this.fetchProfiles()
                    });
                    
                } else if (data.Status == 'ERROR') {
                    this.statusMessageHeadline = data.StatusMessageHeadline;
                    this.statusMessage = data.StatusMessage;
                    this.textClose = data.text_close;

                    statusModalInstance.show();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
 

        sendMessageModalData(profileids, page = '', template = '', casterId = '') {
            this.isFetchingMsgData = true;
            this.currentPage = page;
            this.currentCasterListId = casterId;
            fetch(`https://www.onlinecasting.dk/api/messages/message_profile_2025WIP.asp?profileid=${profileids}&page=${page}&casterlistid=${casterId}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data, 'send Messages');
                    if (data.Status == 'OK') {
                        this.messageData = data;
                        this.msgInputText = this.htmlToPlainText(data.text_messagebox);
                        this.msgProfiles = data.profiles;
                        this.msgSingleImageUrl = data.profiles[0].imageurl;
                        this.msgMaxChar = data.max_characters;
                        sendMessageInstance.show();

                        this.fetchMsgTemplates(template);

                    } else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                        this.statusMessageHeadline = data.StatusMessageHeadline;
                        this.statusMessage = data.StatusMessage;
                        this.textClose = data.text_close;

                        statusModalInstance.show();
                    }
                })
                .catch(error => {
                    console.error("Error fetching message modal data:", error);
                })
                . finally(() => {
                    this.isFetchingMsgData = false;
                });
        },

        //  Remove Profiles
        removeMsgProfiles(profileId) {
            // console.log(profileId, 'profileId')
            // Ensure profileId is a number for comparison
            const idToRemove = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
            this.msgProfiles = this.msgProfiles.filter(profile => profile.profileid !== idToRemove);
            this.selectedProfiles = this.selectedProfiles.filter(id => parseInt(id, 10) !== idToRemove);
        },

        // New code ends here
        isFetchingTemplateData: false,
        msgTemplates: [],
        fetchMsgTemplates(template) {
            this.isFetchingTemplateData = true;
            fetch(`https://www.onlinecasting.dk/api/messages/message_profile_2025_templateWIP.asp?template=${template}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data.templates, 'templates')
                    this.msgTemplates = data.templates;
                    this.currentSelectedTemplate = data.templates.find(template => template.default === "True").searchname;
                    this.changeMsgTemplate(this.currentSelectedTemplate)
                })
                .catch(error => {
                    console.error("Error fetching message template data:", error);
                })
                . finally(() => {
                    this.isFetchingTemplateData = false;
                });
        },

        //  Post Messages
       sendNewMessage() {  
          const profileIds = this.msgProfiles.map(profile => profile.profileid).join(',');
    
           const url = "https://www.onlinecasting.dk/api/messages/message_profile_2025_sendWIP.asp";
           // Convert newlines to <br/> tags
           const formattedMessage = this.msgInputText.replace(/\n/g, '<br/>');

           const data = {
               profileid: profileIds,
               page: this.currentPage,
               template: this.currentSelectedTemplate,
               casterlistid: this.currentCasterListId,
               message: formattedMessage,
           };
           fetch(url, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
               },
               body: new URLSearchParams(data).toString()
           })
           .then(response => response.text())
           .then(data => {
              const parsedData = JSON.parse(data);
               if (parsedData.Status == 'OK') {                  
                  sendMessageInstance.hide();
                    this.statusMessage = parsedData.StatusMessage;
                    this.statusImage = parsedData.image;	
                    toastBootstrap.show();
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
            this.selectedProfiles = [];
           });
       },


        changeMsgTemplate(searchname) {
            const selectedTemplate = this
                .msgTemplates
                .find(template => template.searchname === searchname);
            if (selectedTemplate) {
                this.currentSelectedTemplate = selectedTemplate.searchname;
                this.msgInputText = selectedTemplate.templatecontent;
            } else {
                console.error('Template not found for searchname:', searchname);
            }
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

        linkToShare : '',
        textCopyLink : '',
        shareProfiles() {
        fetch(`https://www.onlinecasting.dk/api/savedprofiles/page_saved_profiles_folder_full_shareWIP.asp?casterlistid=${this.currentCasterListId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'share'); 
                if (data.Status === 'OK') {
                    this.statusMessageHeadline = data.StatusMessageHeadline
                    this.textHtml = data.text_html;
                    this.statusMessage = data.StatusMessage;
                    this.textClose = data.text_close;
                    this.linkToShare = data.link_to_share;
                    this.textCopyLink = data.text_copy_link;
                    this.textCopiedLink = data.text_link_copied;
                    shareModalInstance.show(); 
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

        initializeTooltips() {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        },
         
        setOrderBy(newOrder, fetch = false) {
            this.currentOrderBy = newOrder;

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('orderby', newOrder);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ orderby: newOrder }, '', newUrl);

            if (fetch) {
                this.profiles = [];
                this.fetchProfiles();
            }
        },

        
        setLimit(limit, fetch = false) {
            this.profileLimit = limit;

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('limit', limit);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ limit: limit }, '', newUrl);

            if (fetch) {
                this.profiles = [];
                this.fetchProfiles();
            }
        },

           
        setSkip(skip, fetch = false) {
            this.profileSkip = skip;

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('skip', skip);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ skip: skip }, '', newUrl);

            if (fetch) {
                this.profiles = [];
                this.fetchProfiles();
            }
        },

        setCasterId(casterId, fetch = false) {
            this.currentCasterListId = casterId;

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('casterlistid', casterId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ casterlistid: casterId }, '', newUrl);

            if (fetch) {
                this.profiles = [];
                this.fetchProfiles();
            }
        },

 
        init() {
            this.fetchOrderBy()

             // Handling URL PARAMS
             const urlParams = new URLSearchParams(window.location.search);

             const orderBy = urlParams.get('orderby') || 'NAME_ASC';
             this.setOrderBy(orderBy);

             const casterId = urlParams.get('casterlistid') || '4294';
             this.setCasterId(casterId);

             const skip = urlParams.get('skip') || '0';
             this.setSkip(skip);

             const limit = urlParams.get('limit') || '30';
             this.setLimit(limit);

             this.profiles = [];
             this.fetchProfiles();
        }
    }));
});