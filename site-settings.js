document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav_link");
  navLinks.forEach((link) => {
    const linkHref = new URL(link.href).pathname; // Get path of link href
    const currentPath = window.location.pathname; // Get current page path

    // Ignore links with href="#"
    if (link.getAttribute("href") === "#") return;

    // Check if the current path starts with the link's path (to handle child pages)
    if (currentPath.startsWith(linkHref)) {
      link.classList.add("w--current");
    }
  });

  const navigation = document.querySelector(".header_nav");
  const navigation_btn = document.querySelector(".header_menu-btn");
  const body = document.body;
  const html = document.documentElement;
  const main = document.querySelector("main");

  const urls = document.querySelectorAll("[data-url]");
  urls.forEach((el) => {
    el.href = el.href + el.getAttribute("data-url");
  });

  // Disable/Enable scroll for body and html
  function disableScroll() {
    document.addEventListener("touchmove", preventDefault, { passive: false });
  }

  function enableScroll() {
    document.removeEventListener("touchmove", preventDefault, {
      passive: false,
    });
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  // Toggle navigation and prevent body scroll
  if (navigation_btn) {
    navigation_btn.addEventListener("click", () => {
      navigation.classList.toggle("active");
      navigation_btn.classList.toggle("active");
      body.classList.toggle("ov-hidden");
      html.classList.toggle("ov-hidden");

      if (body.classList.contains("ov-hidden")) {
        disableScroll();
      } else {
        enableScroll();
      }
    });
  }

  // Handle menu open/close
  const menu__open = document.querySelector(".menu-icon-closed");
  const menu__close = document.querySelector(".menu-icon-opened");
  const menu = document.querySelector(".header_nav");

  if (menu) {
    menu__open.addEventListener("click", function () {
      menu.classList.add("visible");
      menu__open.style.display = "none";
      menu__close.style.display = "block";
      document.body.classList.add("_lock");
      disableScroll(); // Disable scroll when menu opens
    });
  }

  if (menu) {
    menu__close.addEventListener("click", function () {
      menu.classList.remove("visible");
      menu__open.style.display = "block";
      menu__close.style.display = "none";
      document.body.classList.remove("_lock");
      enableScroll(); // Enable scroll when menu closes
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const request_modal = document.querySelector("#modal-request");

  const request_modal_overlay = document.querySelector(
    "#modal-request__overlay"
  );
  const request_modal_close = document.querySelector(
    "#testimonial-modal_close"
  );

  const request_form = document.querySelector('.request-modal_form')
  const request_success = document.querySelector('.modal-request_success')
	const loader = $(".loader__wrapper");
  const char = $("#charCount");
  const request_modal_open = document.querySelector("#request-open-modal");

  if (request_modal_open) {
    request_modal_open.addEventListener("click", function () {
      request_modal.classList.add("visible");
    });
  }

  request_modal_overlay.addEventListener("click", function () {
    request_modal.classList.remove("visible");
    request_success.style.display = "none";
    request_form.style.display = "block";
    request_form.reset();
    loader.css("display", "none");
    char.text("0/520");
  });

  request_modal_close.addEventListener("click", function () {
    request_modal.classList.remove("visible");
    request_success.style.display = "none";
    request_form.style.display = "block";
    request_form.reset();
    loader.css("display", "none");
    char.text("0/520");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const seoBlock = document.querySelector(".seo-block");
  if (!seoBlock) return;

  const elements = Array.from(seoBlock.children);
  if (!elements.length) return;

  let wrapper = null;

  elements.forEach((element) => {
    if (element.tagName === "H3") {
      wrapper = document.createElement("div");
      wrapper.classList.add("seo-block__item");
      seoBlock.appendChild(wrapper);
    }

    if (wrapper) {
      wrapper.appendChild(element);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
	const loader = $(".loader__wrapper");
  $('[wr-type="error"]').hide();
  $(".error").removeClass("error");

  let formErrors = false;

  const fieldError = function (field, message) {
    field.parent().find('[wr-type="error"]').text(message).show(); // Show error message
    field.parent().addClass("error"); // Add error state to this field
    formErrors = true;
    console.log(field);
  };

  const isValidUkrainianPhoneNumber = function (phone) {
    // RegEx for Ukrainian phone number (+380 followed by 9 digits)
    const ukPhoneRegex = /^\+380\d{9}$/;
    return ukPhoneRegex.test(phone);
  };

  // Click on the Submit button
  $('[wr-type="submit"]').click(function (e) {
    formErrors = false; // Reset form error state before validation
    loader.css("display", "flex");

    // Check each required field
    $('[wr-type="required-field"]').each(function () {
      // Checkbox validation
      if ($(this).attr("type") === "checkbox" && !$(this).is(":checked")) {
        fieldError(
          $(this).siblings(".w-checkbox-input"),
          "Будь ласка, виберіть цей пункт."
        );
        return;
      }

      // Text field validation
      if ($(this).val().length === 0) {
        fieldError($(this), "Це поле є обов'язковим.");
      }

      // Email validation
      else if (
        $(this).attr("type") === "email" &&
        ($(this).val().indexOf("@") === -1 || $(this).val().indexOf(".") === -1)
      ) {
        fieldError($(this), "Будь ласка, введіть коректну електронну адресу.");
      }

      // Phone number validation
      else if (
        $(this).attr("type") === "tel" &&
        !isValidUkrainianPhoneNumber($(this).val())
      ) {
        fieldError(
          $(this),
          "Будь ласка, введіть коректний український номер телефону."
        );
      }
    });

    // If errors found, prevent form submission
    if (formErrors || document.getElementById("requestTextArea").value.length < 10 ) {
      console.log(formErrors);
      e.preventDefault();
      loader.css("display", "none");
    }
  });

  // Reset error states on input/blur
  $('[wr-type="required-field"], [type="checkbox"], [type="tel"]').on(
    "keypress blur",
    function () {
      $(this).parent().find(".error").removeClass("error");
      $(this).parent().find('[wr-type="error"]').hide();
      formErrors = false;
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("requestTextArea");
  const charCount = document.getElementById("charCount");
  textarea.addEventListener("input", () => {
    const currentLength = textarea.value.length;
    charCount.textContent = `${currentLength}/520`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const openLogoutModal = document.querySelector("#logout-cta");
  const openLogoutModal2 = document.querySelector("#logout-cta2");
  const logoutModal = document.querySelector("#logout-modal");
  const logoutModalConfirm = document.querySelector("#logout-modal-confirm");
  const logoutModalCancel = document.querySelector("#logout-modal-cancel");
  const logoutOverlay = document.querySelector("#logout-modal-overlay");

  if (logoutModal) {
    openLogoutModal.addEventListener("click", function (e) {
      logoutModal.classList.add("visible");
    });

    logoutModalConfirm.addEventListener("click", function (e) {
      logoutModal.classList.remove("visible");
    });

    logoutModalCancel.addEventListener("click", function (e) {
      logoutModal.classList.remove("visible");
    });

    logoutOverlay.addEventListener("click", function (e) {
      e.stopPropagation();
      logoutModal.classList.remove("visible");
    });
  }

  if (openLogoutModal2) {
    openLogoutModal2.addEventListener("click", function (e) {
      logoutModal.classList.add("visible");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let phoneInputs = document.querySelectorAll('input[type="tel"]');

  let im = new Inputmask({
    mask: "+389999999999",
    placeholder: " ", // This sets a space as the placeholder character
    showMaskOnHover: false, // Hide the placeholder when not focused
    showMaskOnFocus: true, // Show the mask when the input is focused
  });

  phoneInputs.forEach(function (input) {
    im.mask(input);
  });
});

window.processServiceBlocks = function () {
  document
    .querySelectorAll('[data-filter-wrapper="services"]')
    .forEach((serviceBlockWrapper) => {
      const serviceBlock = serviceBlockWrapper.querySelector(
        '[data-filter-data="services"]'
      );
      if (serviceBlock) {
        const paragraphs = serviceBlock.querySelectorAll("p");
        const newContent = Array.from(paragraphs)
          .map((paragraph) => {
            const text = paragraph.textContent.trim();
            if (!text || !text.includes("|")) return "";

            const [category, type, price, gear = ""] = text
              .split("|")
              .map((item) => item.trim());
            const priceFormatted = window.formatPrice(price);
            const gearUpper = gear.toUpperCase();
            const isAutomatic =
              gearUpper.includes("АВТОМАТИЧНА") || gearUpper.includes("АКП");
            const isMechanic =
              gearUpper.includes("МЕХАНІЧНА") || gearUpper.includes("МКП");

            return `
                            <div class="content_item-service" 
                                 service-category="${category}" 
                                 service-type="${type}" 
                                 service-price="${price}" 
                                 service-automatic="${isAutomatic}" 
                                 service-mechanic="${isMechanic}">
                                <div class="content_item-service-price">${priceFormatted}</div>
                            </div>
                        `;
          })
          .join("");

        if (!newContent) return;

        const container = serviceBlockWrapper.querySelector(
          '[data-filter-content="services"]'
        );

        if (container) {
          container.innerHTML = newContent;
        }
      }
    });
};

window.hideFinsweetTextInRegionDropdown = function () {
  document
    .querySelectorAll("#select-region .select_link-text")
    .forEach((element) => {
      if (element.textContent.trim().toUpperCase() === "SELECT LINK") {
        element.closest(".select_item").classList.add("hide");
      }
    });
};

window.formatPrice = function (input) {
  const cleanedInput = input.replace(/\s+/g, "");
  const number = parseFloat(cleanedInput);

  if (!isNaN(number)) {
    return number.toLocaleString("en-US").replace(/,/g, " ");
  }

  return input;
};

document.querySelectorAll("[data-format-price]").forEach(function (element) {
  const rawPrice = element.textContent.trim();
  const formattedPrice = window.formatPrice(rawPrice);
  element.textContent = formattedPrice;
});

//------------------------------ LOADER ------------------------------

const mask = document.querySelector(".loader");

window.addEventListener("load", () => {
  if (mask) {
    setTimeout(() => {
      mask.classList.add("hide");
    }, 2000);
    setTimeout(() => {
      mask.remove();
    }, 2200);
  }
});

//------------------------------ SERVICES ------------------------------

const serviceItems = document.querySelectorAll(".instructor_services-item");

const updateSubscriptionCounts = () => {
  serviceItems.forEach(async (item) => {
    const slug = item.getAttribute("data-slug");
    try {
      const response = await fetch(
        `https://instructor-backend.vercel.app/services/${slug}/subscribers`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions for ${slug}`);
      }

      const data = await response.json();
      const countElement = item.querySelector(".services-item_count");
      const subscriptions = data.subscribers || 0;

      function getDeclension(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
          return "разів";
        }

        if (lastDigit === 1) {
          return "раз";
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          return "рази";
        } else {
          return "разів";
        }
      }

      countElement.textContent = `Записались ${subscriptions} ${getDeclension(
        subscriptions
      )}`;
    } catch (error) {
      console.error("Error updating subscription counts:", error);
    }
  });
};

(function () {
  const storageModal = document.querySelector(".storage-modal");
  const storageModalOverlay = document.querySelector(".storage-modal_overlay");
  const storageModalClose = document.querySelector(".storage-modal_close");

  const registerModal = document.getElementById("registration-modal");

  if (storageModalClose && storageModalOverlay) {
    storageModalOverlay.addEventListener("click", () => {
      storageModal.classList.remove("visible");
    });

    storageModalClose.addEventListener("click", () => {
      storageModal.classList.remove("visible");
    });
  }

  const sessionKey = "sharedSession"; // Key to track the session
  const tabsKey = "activeTabs"; // Key to track active tabs
  const reloadKey = "isPageReload"; // Key to track if the page is being reloaded
  
  // Increment active tabs count only if the tab isn't already registered
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, "true");
  
    // Increment active tabs count in localStorage
    localStorage.setItem(
      tabsKey,
      (parseInt(localStorage.getItem(tabsKey) || "0") + 1).toString()
    );
  }
  
  // Initialize session data if it doesn't exist
  if (!localStorage.getItem(sessionKey)) {
    localStorage.setItem(sessionKey, JSON.stringify({ subscribedServices: [] }));
  }
  
  let isPhoneLinkClicked = false;
  
  // Detect clicks on phone links and prevent unload decrement
  document.addEventListener("click", (event) => {
    const target = event.target.closest("a[href^='tel:']");
    if (target) {
      isPhoneLinkClicked = true; // Mark that the phone link was clicked
      setTimeout(() => {
        isPhoneLinkClicked = false; // Reset after some time to avoid interference
      }, 300); // Adjust delay as necessary
    }
  });
  
  window.addEventListener("beforeunload", () => {
    if (isPhoneLinkClicked) {
      return; // Skip decrementing active tabs
    }
  
    // Check if this tab was counted
    if (sessionStorage.getItem(reloadKey)) {
      sessionStorage.removeItem(reloadKey); // Remove the key for this tab
      const activeTabs = parseInt(localStorage.getItem(tabsKey) || "1") - 1;
      localStorage.setItem(tabsKey, activeTabs.toString());
  
      if (activeTabs === 0) {
        localStorage.removeItem(sessionKey); // Clear session if no tabs are active
      }
    }
  });
  
  // Helper functions to get and update session
  const getSession = () => JSON.parse(localStorage.getItem(sessionKey));
  const updateSession = (data) =>
    localStorage.setItem(sessionKey, JSON.stringify(data));
  
  

  window.handleSubscription = async (slug, modal = false) => {
    const session = getSession();
    const subscribedServices = session.subscribedServices;

    if (subscribedServices.includes(slug)) {
      console.log(`User already subscribed to ${slug} during this session.`);
      if (modal) {
        storageModal.classList.add("visible");
        registerModal.classList.remove("visible");
      }
      return true; // User already subscribed
    }

    try {
      const response = await fetch(
        `https://instructor-backend.vercel.app/services/${slug}/subscribers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to increment subscribers for ${slug}`);
      }

      updateSubscriptionCounts();

      subscribedServices.push(slug);
      updateSession({ ...session, subscribedServices });

      return false; // Subscription successful
    } catch (error) {
      console.error("Error incrementing subscribers:", error);
      return false; // Treat as not subscribed due to error
    }
  };
})();
