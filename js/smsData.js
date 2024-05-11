 


let changePhoneNumberModal = document.getElementById('changePhoneNumberModal');
let changePhoneNumberModalInstance = bootstrap.Modal.getInstance(changePhoneNumberModal);
if (!changePhoneNumberModalInstance) {
  changePhoneNumberModalInstance = new bootstrap.Modal(changePhoneNumberModal);
}


let statusModal = document.getElementById('statusModal');
let statusModalInstance = bootstrap.Modal.getInstance(statusModal);
if (!statusModalInstance) {
  statusModalInstance = new bootstrap.Modal(statusModal);
}

document.addEventListener("alpine:init", () => {
  Alpine.data('smsComponent', () => ({

      selectedCountry: null,
      countries: [
        { code: '45', flagUrl: 'https://www.onlinecasting.dk/graphics/flags/danmark.png', name: 'Denmark' },
        { code: '47', flagUrl: 'https://www.onlinecasting.dk/graphics/flags/norge.png', name: 'Norge' },
        { code: '46', flagUrl: 'https://www.onlinecasting.dk/graphics/flags/sverige.png', name: 'Sverige' }
      ],

      updateCountry(selected) {
        this.selectedCountry = selected;
      },

      isConfirmingNumber : false,
      statusMessageHeadline: '',
      textClose: '',
      textSubmitButton: '',
      textLabelInputNumber: '',
      currentPhoneNumber: '',
      textInputPlaceholder: '',
      statusMessage: '',

      smsConfirmNumber(profileId) {
        this.isConfirmingNumber = true;
        this.showOTPBlock = false
        fetch(`https://www.onlinecasting.dk/api/sms/sms_confirm_number.asp?page=${profileId}`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
                if (data.Status == 'OK') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.textClose = data.text_close;
                  this.textSubmitButton = data.text_submit_button
                  this.textLabelInputNumber = data.text_header_input_number
                  this.currentPhoneNumber = data.current_phone_number
                  this.textInputPlaceholder = data.text_placeholder_input_number
                  this.countryCode = data.current_country_code

                  // Attempt to find the country using the current_country_code
                  if (data.current_country_code) {
                    const matchedCountry = this.countries.find(country => country.code === data.current_country_code);
                    if (matchedCountry) {
                      this.selectedCountry = matchedCountry;
                    } else {
                      // Fallback to the first country if no match is found
                      this.selectedCountry = this.countries[0];
                      console.error("No matching country found or invalid code:", data.current_country_code);
                    }
                  } else {
                    // Fallback to the first country if the code is empty
                    this.selectedCountry = this.countries[0];
                    console.warn("Empty country code received, defaulting to first country.");
                  }
                  
                  changePhoneNumberModalInstance.show();  
                  
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
  
                  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error Confirming Number:", error);
            })
            .finally(() => {
                this.isConfirmingNumber = false;
            });
      },

      isSendingNumber: false,
      textInputPlaceholderCode: '',
      textHtml: '',
      showOTPBlock : false,
      textHeaderInputCode: '',
      sendConfirmNumber() {
        this.isSendingNumber = true;
        fetch(`https://www.onlinecasting.dk/api/sms/sms_confirm_number_send.asp?phone=${this.currentPhoneNumber}&countrycode=${this.selectedCountry.code}`)
            .then(response => response.json())
            .then(data => {

                if (data.Status == 'OK') {
                  this.showOTPBlock = true
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.textClose = data.text_close
                  this.textSubmitButton = data.text_submit_button
                  this.textHeaderInputCode = data.text_header_input_code
                  this.textInputPlaceholderCode = data.text_placeholder_input_activation_code
                  this.textHtml = data.text_html
                  
                }
                else if (data.Status == 'ERROR' && data.ShowMessage == 'YES') {
                  changePhoneNumberModalInstance.hide(); 
                  
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.StatusMessage
                  this.textClose = data.text_close
  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error Sending Number:", error);
            })
            .finally(() => {
                this.isSendingNumber = false;
            });
      },

      currentCode: '',
      isActivating: false,
      activateConfirmNumber() {
        this.isActivating = true;
        fetch(`https://www.onlinecasting.dk/api/sms/sms_confirm_number_activate.asp?phone=${this.currentPhoneNumber}&countrycode=${this.selectedCountry.code}&activationcode=${this.currentCode}`)
            .then(response => response.json())
            .then(data => {

                if (data.Status == 'OK') {
                  this.showOTPBlock = false
                  changePhoneNumberModalInstance.hide(); 
                  
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.text_html
                  this.textClose = data.text_close

                  statusModalInstance.show();  
                  if (data.Refreshpage == 'OK') {
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }
                }
                else if (data.Status == 'ERROR') {
                  changePhoneNumberModalInstance.hide(); 
                  
                  this.statusMessageHeadline = data.StatusMessageHeadline
                  this.statusMessage = data.text_html
                  this.textClose = data.text_close
  
                  statusModalInstance.show();  
                }  
            })
            .catch(error => {
                console.error("Error Activating Number:", error);
            })
            .finally(() => {
                this.currentCode = ''
                this.isActivating = false;
            });
      },
 
      init() {
        this.selectedCountry = this.countries[0];
      },

      get countryFlagUrl() {
        return this.selectedCountry ? this.selectedCountry.flagUrl : '';
      }
  }));
});

 