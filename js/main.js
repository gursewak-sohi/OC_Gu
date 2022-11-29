//$(window).scroll(function() 
//{
// if ($(this).scrollTop() > 1)
// {
// $('#header').addClass("sticky_header");
//}
//else
// {
// $('#header').removeClass("sticky_header");
//}
//});







/*******************************************************************************************/


$(document).ready(function() {


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
});



/*******************************************************************************************/





// (function() {
//     if (document.querySelector("#top-nav-toggle")) {
//         var navToggle = document.querySelector("#top-nav-toggle");

//         function watchNavClose(e) {
//             var topNav = document.querySelector(".top-bar");
//             if (!e.path.includes(topNav)) {
//                 openCloseNav();
//                 document.documentElement.removeEventListener("click", watchNavClose);
//             }
//         }

//         function openCloseNav() {
//             var navToggle = document.querySelector("#top-nav-toggle");
//             if (!navToggle.classList.contains("closed")) {
//                 navToggle.classList.add("closed");
//                 document.querySelector("#top-bar__nav").classList.remove("collapsed");
//                 document.querySelector("html").addEventListener("click", watchNavClose);
//             } else {
//                 navToggle.classList.remove("closed");
//                 document.querySelector("#top-bar__nav").classList.add("collapsed");
//                 document.documentElement.removeEventListener("click", watchNavClose);
//             }
//         }

//         navToggle.addEventListener("click", openCloseNav);
//     }
// })();

// Toggle Menu
const toggleMenu = (toggleID, toggleNav) => {
    let toggleLink = document.querySelector(toggleID),
        toggleItem = document.querySelector(toggleNav),
        headerHeight = document.querySelector('#innerNav').clientHeight;
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




/*******************************************************************************************/

new WOW().init();

/*******************************************************************************************/


// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('figure').outerHeight();

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
        $('figure').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('figure').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}



/*******************************************************************************************/


$(document).ready(function() {
    // Configure/customize these variables.
    var showChar = 230; // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "Show more";
    var lesstext = "Show less";


    $('.more').each(function() {
        var content = $(this).html();

        if (content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

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
});





/*******************************************************************************************/


$('#companies').owlCarousel({
    loop: true,
    margin: 20,
    //nav:true,
    //dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    responsive: {
        0: {
            items: 3
        },
        600: {
            items: 4
        },
        800: {
            items: 5
        },
        1000: {
            items: 5
        }
    }
});


/*******************************************************************************************/


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



/*******************************************************************************************/



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






/*******************************************************************************************/



$(document).ready(function() {
    // apply form button toggle
    $(".toggleform").hide();
    $(".applyBtn").click(function() {
        $(this).text($(this).text() === "Apply" ? "Apply" : "Apply");
        $(".toggleform").slideToggle(400);
    });
});




/*******************************************************************************************/


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


/*******************************************************************************************/





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

            // if(e.type == 'mouseout'){
            //     // close the dropdown after user leave the list
            //     e.target.nextElementSibling.onmouseleave = closeDropdown;
            // }
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
    console.log('run');

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


const range = document.querySelectorAll(".range-slider span input");
progress = document.querySelector(".range-slider .progress");
let gap = 0.1;
const inputValue = document.querySelectorAll(".numberVal input");

range.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minRange = parseInt(range[0].value);
        let maxRange = parseInt(range[1].value);

        if (maxRange - minRange < gap) {
            if (e.target.className === "range-min") {
                range[0].value = maxRange - gap;
            } else {
                range[1].value = minRange + gap;
            }
        } else {
            progress.style.left = (minRange / range[0].max) * 100 + "%";
            progress.style.right = 100 - (maxRange / range[1].max) * 100 + "%";
            inputValue[0].value = minRange;
            inputValue[1].value = maxRange;
        }
    });
});



/*******************************************************************************************/


window.onload = function() {
    slideOne();
    slideTwo();
};

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let minGap = 0;
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;

function slideOne() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor();
}

function slideTwo() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor();
}

function fillColor() {
    percent1 = (sliderOne.value / sliderMaxValue) * 100;
    percent2 = (sliderTwo.value / sliderMaxValue) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #FC7028 ${percent1}% , #FC7028 ${percent1}% , #FC7028 ${percent2}%, #FC7028 ${percent2}%)`;
}



/*******************************************************************************************/