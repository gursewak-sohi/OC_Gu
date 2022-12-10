 $(document).ready(function() {

     // Range Init
     var rangeSlider1 = document.getElementById('slider-range-1');
     var rangeSlider2 = document.getElementById('slider-range-2');
     var rangeSlider3 = document.getElementById('slider-range-3');
     var rangeSlider4 = document.getElementById('slider-range-4');
     if (rangeSlider1) {
         var moneyFormat = wNumb({
             decimals: 0,
             thousand: ',',
             prefix: ''
         });
         noUiSlider.create(rangeSlider1, {
             start: [0, 100],
             step: 1,
             range: {
                 'min': [0],
                 'max': [100]
             },
             format: moneyFormat,
             connect: true
         });

         // Set visual min and max values and also update value hidden form inputs
         rangeSlider1.noUiSlider.on('update', function(values, handle) {
             document.getElementById('slider-range-1-1').innerHTML = values[0];
             document.getElementById('slider-range-1-2').innerHTML = values[1];
             document.getElementsByName('min-value').value = moneyFormat.from(
                 values[0]);
             document.getElementsByName('max-value').value = moneyFormat.from(
                 values[1]);
         });
     }
     if (rangeSlider2) {
         var moneyFormat = wNumb({
             decimals: 0,
             thousand: ',',
             prefix: ''
         });
         noUiSlider.create(rangeSlider2, {
             start: [0, 220],
             step: 1,
             range: {
                 'min': [0],
                 'max': [220]
             },
             format: moneyFormat,
             connect: true
         });

         // Set visual min and max values and also update value hidden form inputs
         rangeSlider2.noUiSlider.on('update', function(values, handle) {
             document.getElementById('slider-range-2-1').innerHTML = values[0];
             document.getElementById('slider-range-2-2').innerHTML = values[1];
             document.getElementsByName('min-value').value = moneyFormat.from(
                 values[0]);
             document.getElementsByName('max-value').value = moneyFormat.from(
                 values[1]);
         });
     }
     if (rangeSlider3) {
         var moneyFormat = wNumb({
             decimals: 0,
             thousand: ',',
             prefix: ''
         });
         noUiSlider.create(rangeSlider3, {
             start: [0, 150],
             step: 1,
             range: {
                 'min': [0],
                 'max': [150]
             },
             format: moneyFormat,
             connect: true
         });

         // Set visual min and max values and also update value hidden form inputs
         rangeSlider3.noUiSlider.on('update', function(values, handle) {
             document.getElementById('slider-range-3-1').innerHTML = values[0];
             document.getElementById('slider-range-3-2').innerHTML = values[1];
             document.getElementsByName('min-value').value = moneyFormat.from(
                 values[0]);
             document.getElementsByName('max-value').value = moneyFormat.from(
                 values[1]);
         });
     }
     if (rangeSlider4) {
         var moneyFormat = wNumb({
             decimals: 0,
             thousand: ',',
             prefix: ''
         });
         noUiSlider.create(rangeSlider4, {
             start: [0, 100],
             step: 1,
             range: {
                 'min': [0],
                 'max': [100]
             },
             format: moneyFormat,
             connect: true
         });

         var inputAgeStart = document.getElementById('slider-range-4-3');
         var inputAgeEnd = document.getElementById('slider-range-4-4');

         // Set visual min and max values and also update value hidden form inputs
         rangeSlider4.noUiSlider.on('update', function(values, handle) {
             document.getElementById('slider-range-4-1').innerHTML = values[0];
             document.getElementById('slider-range-4-2').innerHTML = values[1];
             document.getElementsByName('min-value').value = moneyFormat.from(
                 values[0]);
             document.getElementsByName('max-value').value = moneyFormat.from(
                 values[1]);
             var value = values[handle];
             if (handle) {
                 inputAgeEnd.value = value;

             } else {
                 inputAgeStart.value = value;
             }
         });
         inputAgeStart.addEventListener('change', function() {
             rangeSlider4.noUiSlider.set([this.value, null]);
         });

         $('#slider-range-4-3').keypress(function(e) {
             var key = e.which;
             if (key == 13) // the enter key code
             {
                 rangeSlider4.noUiSlider.set([this.value, null]);
                 $(this).select();
             }
         });

         inputAgeEnd.addEventListener('change', function() {
             rangeSlider4.noUiSlider.set([null, this.value]);
         });

         $('#slider-range-4-4').keypress(function(e) {
             var key = e.which;
             if (key == 13) // the enter key code
             {
                 rangeSlider4.noUiSlider.set([null, this.value]);
                 $(this).select();
             }
         });
         $("#slider-range-4-3").on("click", function() {
             $(this).select();
         });
         $("#slider-range-4-4").on("click", function() {
             $(this).select();
         });

         $(document).on('keypress', '.numbersOnly', function(event) {
             var regex = /^\d+$/;
             var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
             if (!regex.test(key)) {
                 event.preventDefault();
                 return false;
             }
         });

     }

     //  Show All 
     let all = document.getElementById("all");
     if (all) {
         var $btns = $('.btn').click(function() {
             if (this.id == 'all') {
                 $('#parent > div').fadeIn(450);
             } else {
                 var $el = $('.' + this.id).fadeIn(450);
                 $('#parent > div').not($el).hide();
             }
             $btns.removeClass('active');
             $(this).addClass('active');
         })
     }

     // Viewport Height
     let vh = window.innerHeight * 0.01;
     document.documentElement.style.setProperty("--vh", `${vh}px`);
     window.addEventListener("resize", () => {
         let vh = window.innerHeight * 0.01;
         document.documentElement.style.setProperty("--vh", `${vh}px`);
     });

     // Toggle Menu
     const toggleMenu = (toggleID, toggleNav) => {
         let toggleLink = document.querySelector(toggleID),
             toggleItem = document.querySelector(toggleNav),
             headerHeight = document.querySelector('#header').clientHeight;
         root = document.getElementsByTagName("html")[0];

         toggleItem.style.top = `${headerHeight}px`;

         if (toggleLink && toggleItem) {
             toggleLink.onclick = (e) => {
                 if (toggleItem.classList.contains("active")) {
                     toggleLink.classList.remove("closed");
                     root.classList.remove("hide-scroll");
                     toggleItem.classList.remove("active");
                 } else {
                     toggleLink.classList.add("closed");
                     root.classList.add("hide-scroll");
                     toggleItem.classList.add("active");
                 }
             };

             toggleItem.onclick = () => {
                 toggleLink.classList.remove("closed");
                 toggleItem.classList.remove("active");
                 root.classList.remove("hide-scroll");
             }

             toggleItem.querySelector(':scope>nav').onclick = (e) => {
                 e.stopPropagation();
             }
         }
     };

     toggleMenu("#top-nav-toggle", "#top-bar__nav");



     // Hide Header on on scroll down
     let figureScroll = document.querySelector('#figure');
     if (figureScroll && window.innerWidth < 768) {


         var didScroll;
         var lastScrollTop = 0;
         var delta = 5;
         var navbarHeight = $('#figure').outerHeight();

         $(window).scroll(function(event) {
             didScroll = true;
         });

         setInterval(function() {
             if (didScroll) {
                 hasScrolled();
                 didScroll = false;
             }
         }, 5);

         function hasScrolled() {
             var st = $(this).scrollTop();

             // Make sure they scroll more than delta
             if (Math.abs(lastScrollTop - st) <= delta)
                 return;

             // If they scrolled down and are past the navbar, add class .nav-up.
             // This is necessary so you never see what is "behind" the navbar.
             if (st > lastScrollTop && st > navbarHeight) {
                 // Scroll Down
                 $('#figure').removeClass('nav-down').addClass('nav-up');
             } else {
                 // Scroll Up
                 if (st + $(window).height() < $(document).height()) {
                     $('#figure').removeClass('nav-up').addClass('nav-down');
                 }
             }

             lastScrollTop = st;
         }

     }


     //  More Show Hide 

     // Configure/customize these variables.

     let more = document.querySelector('.more')
     if (more) {
         var showChar = 230; // How many characters are shown by default
         var ellipsestext = "...";
         var moretext = "Show more";
         var lesstext = "Show less";


         $('.more').each(function() {
             var content = $(this).html();
             if (content.length > showChar) {
                 var c = content.substr(0, showChar);
                 var h = content.substr(showChar, content.length - showChar);
                 var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink text-decoration-underline">' + moretext + '</a></span>';

                 $(this).html(html);
             }
         });

         $(".morelink").click(function() {
             if ($(this).hasClass("less")) {
                 $(this).removeClass("less");
                 $(this).html(moretext);
             } else {
                 $(this).addClass("less");
                 $(this).html(lesstext);
             }
             $(this).parent().prev().toggle();
             $(this).prev().toggle();
             return false;
         });
     }

     //  OWL INIT
     let latestProfile = document.querySelector('.latestProfile');
     if (latestProfile) {
         $('.latestProfile').owlCarousel({
             loop: true,
             margin: 10,
             nav: true,
             responsive: {
                 0: {
                     items: 1
                 },
                 600: {
                     items: 1
                 },
                 1000: {
                     items: 1
                 }
             }
         })
     }


     let successExp = document.querySelector('.successExp');
     if (successExp) {
         $('.successExp').owlCarousel({
             loop: true,
             margin: 25,
             dots: false,
             // nav: true,
             responsive: {
                 0: {
                     items: 1
                 },
                 600: {
                     items: 2
                 },
                 1000: {
                     items: 3
                 }
             }
         })
     }

     let toggleform = document.querySelector('.toggleform');
     if (toggleform) {
         $(".toggleform").hide();
         $(".applyBtn").click(function() {
             $(this).text($(this).text() === "Apply" ? "Apply" : "Apply");
             $(".toggleform").slideToggle(400);
         });
     }

 });




 function importData() {
     let input = document.createElement('input');
     input.type = 'file';
     input.onchange = _ => {
         // you can use this method to get file and perform respective operations
         let files = Array.from(input.files);
         console.log(files);
     };
     input.click();

 }


 // Get all the dropdown from document
 document.querySelectorAll('.dropdown-toggle').forEach(dropDownFunc);

 // Dropdown Open and Close function
 function dropDownFunc(dropDown) {
     console.log(dropDown.classList.contains('click-dropdown'));

     if (dropDown.classList.contains('click-dropdown') === true) {
         dropDown.addEventListener('click', function(e) {
             e.preventDefault();

             if (this.nextElementSibling.classList.contains('dropdown-active') === true) {
                 // Close the clicked dropdown
                 this.parentElement.classList.remove('dropdown-open');
                 this.nextElementSibling.classList.remove('dropdown-active');

             } else {
                 // Close the opend dropdown
                 closeDropdown();

                 // add the open and active class(Opening the DropDown)
                 this.parentElement.classList.add('dropdown-open');
                 this.nextElementSibling.classList.add('dropdown-active');
             }
         });
     }

     if (dropDown.classList.contains('hover-dropdown') === true) {

         dropDown.onmouseover = dropDown.onmouseout = dropdownHover;

         function dropdownHover(e) {
             if (e.type == 'mouseover') {
                 // Close the opend dropdown
                 closeDropdown();

                 // add the open and active class(Opening the DropDown)
                 this.parentElement.classList.add('dropdown-open');
                 this.nextElementSibling.classList.add('dropdown-active');

             }

         }
     }

 };


 // Listen to the doc click
 window.addEventListener('click', function(e) {
     // Close the menu if click happen outside menu
     if (e.target.closest('.dropdown-container') === null) {
         // Close the opend dropdown
         closeDropdown();
     }
 });



 /*******************************************************************************************/


 // Close the openend Dropdowns
 function closeDropdown() {

     // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
     document.querySelectorAll('.dropdown-container').forEach(function(container) {
         container.classList.remove('dropdown-open')
     });

     document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
         menu.classList.remove('dropdown-active');
     });
 }

 // close the dropdown on mouse out from the dropdown list
 document.querySelectorAll('.dropdown-menu').forEach(function(dropDownList) {
     // close the dropdown after user leave the list
     // dropDownList.onmouseleave = closeDropdown;
 });


 /*******************************************************************************************/