 // JS TOLONEWS//
 (function() {

     $(window).scroll(function(event) {
         // A chaque fois que l'utilisateur va scroller (descendre la page)
         var y = $(this).scrollTop(); // On récupérer la valeur du scroll vertical

         //si cette valeur > à 200 on ajouter la class
         if (y >= 130) {
             $('.navigation-sticky').addClass('fixed');
         } else {
             // sinon, on l'enlève
             $('.navigation-sticky').removeClass('fixed');
         }
     });

     jQuery(document).ready(function($) {
         // MENU JS
         $('.lvl1').on('click', function(event) {
             event.preventDefault();
             if ($(this).hasClass('open')) {
                 $(this).removeClass('open');
             } else {
                 $('.lvl1').removeClass('open');
                 $(this).addClass('open');
             }
         });

         // MENU MOBILE
         $('.navbar-toggle').on('click', function(event) {
             event.preventDefault();

             $('.container-herder').addClass('open');
             $(this).addClass('open');
             setTimeout(function() {
                 $('body').toggleClass('open-menu');
             }, 20);
             if (!$(this).hasClass('open')) {
                 setTimeout(function() {
                     $('.container-herder').removeClass('open');
                 }, 20);
             }
         });

         $('.news-bar .close').on('click', function(event) {
             event.preventDefault();
             $(".news-bar").hide();

         });


         //cal unfiorm js
         $("select, input[type=radio], input[type=checkbox], input[type=file]").uniform();
         //photos slider
         $('.thumbs-photo').delegate('img', 'click', function() {
             $('#largeImage').attr('src', $(this).attr('src').replace('thumb', 'large'));
             $('#description').html($(this).attr('alt'));
         });

         //Global tabulation TOLONEWS
         $('ul.tabulations-tolo').each(function() {
             // For each set of tabs, we want to keep track of
             // which tab is active and it's associated content
             var $active, $content, $links = $(this).find('a');

             // If the location.hash matches one of the links, use that as the active tab.
             // If no match is found, use the first link as the initial active tab.
             $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
             $active.addClass('active');

             $content = $($active[0].hash);

             // Hide the remaining content
             $links.not($active).each(function() {
                 $(this.hash).hide();
             });

             // Bind the click event handler
             $(this).on('click', 'a', function(e) {
                 // Make the old tab inactive.
                 $active.removeClass('active');
                 $content.hide();

                 // Update the variables with the new link and content
                 $active = $(this);
                 $content = $(this.hash);

                 // Make the tab active.
                 $active.addClass('active');
                 $content.show();

                 // Prevent the anchor's default click action
                 e.preventDefault();
             });
         });
     });



 })();