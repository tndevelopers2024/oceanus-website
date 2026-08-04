(function($) {
    "use strict";
  
    const $documentOn = $(document);
    const $windowOn = $(window);
  
    $documentOn.ready( function() {
  
      /* ================================
       Mobile Menu Js Start
    ================================ */
    
      $('#mobile-menu').meanmenu({
        meanMenuContainer: '.mobile-menu',
        meanScreenWidth: "1199",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

       $('#mobile-menus').meanmenu({
        meanMenuContainer: '.mobile-menus',
        meanScreenWidth: "19920",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

     $documentOn.on("click", ".mean-expand", function () {
        let icon = $(this).find("i");

        if (icon.hasClass("fa-plus")) {
            icon.removeClass("fa-plus").addClass("fa-minus"); 
        } else {
            icon.removeClass("fa-minus").addClass("fa-plus"); 
        }
    });

    /* ================================
        Sidebar Toggle & Sticky Item Logic
        ================================ */

        // Open offcanvas
        $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__info").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");

        // Hide sticky item
        $(".sidebar-sticky-item").fadeOut().removeClass("active");
        });

        // Close offcanvas
        $(".offcanvas__close, .offcanvas__overlay").on("click", function () {
        $(".offcanvas__info").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");

        // Show sticky item
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Body Overlay Js Start
        ================================ */

        $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("offcanvas-opened");
        $(".df-search-area").removeClass("opened");
        $(".body-overlay").removeClass("opened");

        // Show sticky item when overlay clicked
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Offcanvas Link Click (Optional)
        ================================ */

        $(".offcanvas a").on("click", function () {
        $(".sidebar-sticky-item").fadeIn().addClass("active");
    });

    
      /* ================================
       Sticky Header Js Start
    ================================ */

       $windowOn.on("scroll", function () {
        if ($(this).scrollTop() > 250) {
          $("#header-sticky").addClass("sticky");
        } else {
          $("#header-sticky").removeClass("sticky");
        }
      });      
      
       /* ================================
       Video & Image Popup Js Start
    ================================ */

      $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });

      $(".video-popup").magnificPopup({
        type: "iframe",
        callbacks: {},
      });
  
      /* ================================
       Counterup Js Start
    ================================ */

      $(".count").counterUp({
        delay: 15,
        time: 4000,
      });
  
      /* ================================
       Wow Animation Js Start
    ================================ */

      new WOW().init();
  
      /* ================================
       Nice Select Js Start
    ================================ */

    if ($('.single-select').length) {
        $('.single-select').niceSelect();
    }

      /* ================================
       Parallaxie Js Start
    ================================ */

      if ($('.parallaxie').length && $(window).width() > 991) {
          if ($(window).width() > 768) {
              $('.parallaxie').parallaxie({
                  speed: 0.55,
                  offset: 0,
              });
          }
      }

        /* ================================
      Hover Active Js Start
    ================================ */

    $(".internation-travel-items").hover(
		// Function to run when the mouse enters the element
		function () {
			// Remove the "active" class from all elements
			$(".internation-travel-items").removeClass("active");
			// Add the "active" class to the currently hovered element
			$(this).addClass("active");
		}
	);


    /* ================================
      Brand Slider Js Start
    ================================ */

   if ($('.brand-slider-2').length > 0) {
    const brandSlider2 = new Swiper(".brand-slider-2", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1399: {
                slidesPerView: 7,
            },
            1199: {
                slidesPerView: 6,
            },
            991: {
                slidesPerView: 5,
            },
            767: {
                slidesPerView: 4,
            },
            575: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

   if ($('.brand-slider-3').length > 0) {
    const brandSlider3 = new Swiper(".brand-slider-3", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1199: {
                slidesPerView: 7,
            },
            991: {
                slidesPerView: 6,
            },
            767: {
                slidesPerView: 5,
            },
            575: {
                slidesPerView: 4,
            },
            400: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

   /* ================================
      Project Slider Js Start
    ================================ */

    if ($('.project-slider').length > 0) {
        const projectSlider = new Swiper(".project-slider", {
            slidesPerView: 4,
            spaceBetween: 0,
            speed: 1000,
            loop: false,

            breakpoints: {
                1599: {
                    slidesPerView: 4,
                },
                1399: {
                    slidesPerView: 3.5,
                },
                1199: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    if ($('.project-slider-3').length > 0) {
    const projectSlider3 = new Swiper(".project-slider-3", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
       pagination: {
            el: ".dot",
            clickable: true,
        },
        breakpoints: {
            1399: {
                slidesPerView: 3,
            },
            1199: {
                slidesPerView: 2.5,
            },
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1.6,
            },
            575: {
                slidesPerView: 1.4,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

   /* ================================
      Testimonial Slider Js Start
    ================================ */

    if ($('.client-slider').length > 0) {
    const clientSlider = new Swiper(".client-slider", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
    });
   }

    if ($('.testimonial-slider-3').length > 0) {
    const testimonialSlider3 = new Swiper(".testimonial-slider-3", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
         pagination: {
            el: ".testimonial-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1).toString().padStart(2, '0') + '</span>';
            },
        },
    });
   }

   if ($('.testi-slider-in').length > 0) {
    const testiSliderin = new Swiper(".testi-slider-in", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1199: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 2.5,
            },
            767: {
                slidesPerView: 2,
            },
            575: {
                slidesPerView: 1.5,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    /* ================================
      Custom Accordion Js Start
    ================================ */

    if ($('.accordion-box').length) {

    $('.accordion-box').on('click', '.acc-btn', function () {

        var outerBox = $(this).closest('.accordion-box');
        var target = $(this).closest('.accordion');

        if (target.hasClass('active-block')) {

            target.removeClass('active-block');
            $(this).removeClass('active');
            target.find('.acc-content').slideUp(300);

        } else {

            outerBox.find('.accordion').removeClass('active-block');
            outerBox.find('.acc-btn').removeClass('active');
            outerBox.find('.acc-content').slideUp(300);

            target.addClass('active-block');
            $(this).addClass('active');
            target.find('.acc-content').slideDown(300);

        }

    });

    }

    /* ================================
      Hover Image Js Start
    ================================ */

    const $missionMainBox = $(".mission-main-box");

    const mq = window.matchMedia("(min-width: 1200px)");

    function removeActiveAll() {
        $missionMainBox.removeClass("active");
    }

    function handleHover(e) {
        removeActiveAll();
        $(e.currentTarget).addClass("active");
    }

    function enableHover() {
        $missionMainBox.on("mouseenter.mission", handleHover);
    }

    function disableHover() {
        $missionMainBox.off("mouseenter.mission");
        removeActiveAll();
    }

    function handleBreakpoint(e) {
        if (e.matches) {
            enableHover();   // XL and above
        } else {
            disableHover();  // below XL
        }
    }

    // init
    handleBreakpoint(mq);
    mq.addEventListener("change", handleBreakpoint);


     /* ================================
           Project Slider Hover Tab
    ================================ */

    $documentOn.on("mouseenter click", ".project-slider .swiper-slide", function () {

        var tab_id = $(this).data("tab");

        $(".project-slider .swiper-slide").removeClass("active");
        $(this).addClass("active");

        $(".project-hover-image .tab-img").removeClass("active");
        $("#" + tab_id).addClass("active");

    });

    initRipples();

    /*=============================================
        =              Ripples Init               =
    =============================================*/
    function initRipples() {

        $(".ripple-image").each(function () {

            var $container = $(this);
            var $img = $container.find("img").first();

            if (!$img.length) return;

            var img = new Image();
            img.src = $img.attr("src");

            img.onload = function () {

                var imgURL = img.src;

                $container.css({
                    "background-image": "url(" + imgURL + ")",
                    "background-size": "cover",
                    "background-position": "center center"
                });

                if (typeof $container.ripples === "function") {
                    $container.ripples({
                        resolution: 400,
                        perturbance: 0.03,
                        imageUrl: imgURL
                    });
                }

                $img.hide();
            };

        });
    }

     /* ================================
        Mouse Cursor Animation Js Start
    ================================ */

    if ($(".mouseCursor").length > 0) {
        function itCursor() {
            var myCursor = jQuery(".mouseCursor");
            if (myCursor.length) {
                if ($("body")) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    let n, i = 0, o = !1;
                    window.onmousemove = function(s) {
                        if (!o) {
                            t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        }
                        e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        n = s.clientY;
                        i = s.clientX;
                    };
                    $("body").on("mouseenter", "button, a, .cursor-pointer", function() {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    });
                    $("body").on("mouseleave", "button, a, .cursor-pointer", function() {
                        if (!($(this).is("a", "button") && $(this).closest(".cursor-pointer").length)) {
                            e.classList.remove("cursor-hover");
                            t.classList.remove("cursor-hover");
                        }
                    });
                    e.style.visibility = "visible";
                    t.style.visibility = "visible";
                }
            }
        }
        itCursor();
    }

    /* ================================
        Back To Top Button Js Start
    ================================ */
    $windowOn.on('scroll', function() {
        var windowScrollTop = $(this).scrollTop();

        if (windowScrollTop > 300) {
            $("#back-top").addClass("show");
            $(".whatsapp-fab").addClass("show");
        } else {
            $("#back-top").removeClass("show");
            $(".whatsapp-fab").removeClass("show");
        }
    });

    $documentOn.on('click', '#back-top', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    /* ================================
       Search Popup Toggle Js Start
    ================================ */

    if ($(".search-toggler").length) {
        $(".search-toggler").on("click", function(e) {
            e.preventDefault();
            $(".search-popup").toggleClass("active");
            $("body").toggleClass("locked");
        });
    }
   
	
    /* ================================
       Smooth Scroller And Title Animation Js Start
    ================================ */
    if ($('#smooth-wrapper').length && $('#smooth-content').length) {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

        gsap.config({
            nullTargetWarn: false,
        });

        let smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
        });
    }

     /* ================================
       Text Anim Js Start
    ================================ */

      if (
    typeof SplitText !== "undefined" &&
        document.querySelectorAll(".split-title").length > 0
        ) {
    document.querySelectorAll(".split-title").forEach((title) => {

        // split by words + chars (IMPORTANT)
        const split = new SplitText(title, {
        type: "words,chars"
        });

        // add class to chars
        split.chars.forEach((char) => {
        char.classList.add("char");
        });

        // GSAP animation
        gsap.to(split.chars, {
        scrollTrigger: {
            trigger: title,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        duration: 0.8,
        clipPath: "inset(0% 0% -15% 0%)",
        x: 0,
        opacity: 1,
        ease: "power4.out",
        stagger: 0.03
        });

    });
    }

     if (typeof gsap !== "undefined") {
          gsap.registerPlugin(ScrollTrigger, SplitText);

          let mm = gsap.matchMedia();

          mm.add("(min-width: 1200px)", () => {

              let splits = [];

              // ===== tz-sub-tilte =====
              $('.tz-sub-tilte').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0,
                  x: 7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ===== tz-itm-title =====
              $('.tz-itm-title').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0.3,
                  x: -7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 92%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ðŸ”¥ MOST IMPORTANT PART
              ScrollTrigger.refresh();

              // ðŸ”¥ cleanup on breakpoint change
              return () => {
              splits.forEach(split => split.revert());
              ScrollTrigger.getAll().forEach(st => st.kill());
              };

          });
    }

    /* ================================
      Text Invert Js Start
    ================================ */

    const split2 = new SplitText(".text_invert-2", { type: "lines" });

    split2.lines.forEach((target) => {
        gsap.to(target, {
            backgroundPositionX: 0,
            ease: "none",
            scrollTrigger: {
                trigger: target,
                scrub: 1,
                start: 'top 85%',
                end: "bottom center",
            }
        });
    });

     /* ================================
       Des Portfolio Anim Js Start
    ================================ */
    
    if (document.querySelector(".des-portfolio-wrap")) {
        const pr = ScrollTrigger.matchMedia();

        pr.add("(min-width: 1199px)", () => {

            const sections = document.querySelectorAll(".des-portfolio-panel");
            const wrap = document.querySelector(".des-portfolio-wrap");

            if (!sections.length || !wrap) return;

            // Initial state
            gsap.set(sections, { scale: 1 });

            // Animate each section except the last one
            sections.forEach((section, index) => {
                const isLast = index === sections.length - 1;

                gsap.to(section, {
                    scale: isLast ? 1 : 0.8, // 👈 last one stays full-size
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 14%",
                        end: "bottom 80%",
                        scrub: true,
                        pin: true,
                        pinSpacing: false,
                        endTrigger: wrap,
                        markers: false,
                    },
                });
            });

            // Cleanup on condition change
            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        });
    }

     /* ================================
      Oit Panel Pin Js Start
    ================================ */
    if (window.innerWidth >= 1199) {
    let panels = document.querySelectorAll('.oit-panel-pin');

    panels.forEach((section) => {
        let startVal = section.dataset.start || 'top 30%';
        let endVal = section.dataset.end || 'bottom 50%';

        gsap.fromTo(
            section,
            {
                transformOrigin: '100% 0% 0px',
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
            },
            {
                yPercent: 5,
                rotate: 20,
                scale: 0.75,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: startVal,
                    end: endVal,
                    endTrigger: '.oit-panel-pin-area',
                    pinSpacing: false,
                },
            }
        );
    });
    }

    /* ================================
     Clip Animation Js Start
    ================================ */

    const ClipAnimation = {
        init: function () {
        this.createMasks();
        this.animateMasks();
        },

        initialClipPaths: [
        "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
        "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
        "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
        "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
        "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
        "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
        "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
        "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
        ],

        finalClipPaths: [
        "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
        "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
        "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
        "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
        "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
        "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
        "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
        "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
        "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
        ],

        createMasks: function () {
        $(".clip-animation").each(function () {
            const $wrapper = $(this);
            const $img = $wrapper.find(".clip-animation-img[data-animate='true']");

            if (!$img.length) return;

            const url = $img.attr("src");

            $wrapper.find(".mask").remove();

            for (let i = 0; i < 9; i++) {
            $("<div>", {
                class: `mask mask-${i + 1}`,
                css: {
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                inset: 0
                }
            }).appendTo($wrapper);
            }
        });
        },

        animateMasks: function () {
        const self = this;

        $(".clip-animation").each(function () {
            const wrapper = this;
            const $masks = $(wrapper).find(".mask");

            if (!$masks.length) return;

            gsap.set($masks.toArray(), {
            clipPath: function (i) {
                return self.initialClipPaths[i];
            }
            });

            const order = [
            [".mask-1"],
            [".mask-2", ".mask-4"],
            [".mask-3", ".mask-5", ".mask-7"],
            [".mask-6", ".mask-8"],
            [".mask-9"]
            ];

            const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top 75%"
            }
            });

            order.forEach((targets, i) => {
            const elements = targets
                .map(sel => wrapper.querySelector(sel))
                .filter(Boolean);

            if (!elements.length) return;

            tl.to(elements, {
                clipPath: (j, el) =>
                self.finalClipPaths[$masks.toArray().indexOf(el)],
                duration: 1,
                ease: "power4.out",
                stagger: 0.1
            }, i * 0.125);
            });
        });
        }
    };

    ClipAnimation.init();
    
    }); // End Document Ready Function

    


    /* ================================
       Preloader Js Start
    ================================ */
    $windowOn.on('load', function() {
        $(".preloader").fadeOut(600);
    });


  
  })(jQuery); // End jQuery

