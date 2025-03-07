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

document.addEventListener("alpine:init", () => {
    Alpine.data('messageProfilesComponent', () => ({
        statusMessageHeadline: '',
        statusMessage: '',
        textClose: '',
        isFetchingMsgData: false,
        messageData: {},
        msgSingleImageUrl: '',
        msgMaxChar: 0,
        msgInputText: '',
        msgProfiles: [],
        currentSelectedTemplate: '',

        htmlToPlainText(html) {
            return html
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/\\n/g, '\n');
        },

        sendMessageModalData(profileids, page = '', template = '') {
            console.log(profileids, 'profileids')
            this.isFetchingMsgData = true;
            fetch(`https://www.onlinecasting.dk/api/messages/message_profile_2025WIP.asp?profileid=${profileids}&page=${page}&casterlistid=7`)
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
            const idToRemove = typeof profileId === 'string'
                ? parseInt(profileId, 10)
                : profileId;

            this.msgProfiles = this
                .msgProfiles
                .filter(profile => profile.profileid !== idToRemove);
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

        init() {}
    }));
});