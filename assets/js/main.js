(function () {
  "use strict";

  var PHOTOS = [
    { src: "assets/img/p21.webp", w: 933, h: 1400 },
    { src: "assets/img/p40.webp", w: 933, h: 1400 },
    { src: "assets/img/p03.webp", w: 933, h: 1400 },
    { src: "assets/img/p25.webp", w: 933, h: 1400 },
    { src: "assets/img/p31.webp", w: 933, h: 1400 },
    { src: "assets/img/p08.webp", w: 933, h: 1400 }
  ];
  var WISH_KEY = "sy-lan-wishes-v1";
  var RSVP_KEY = "sy-lan-rsvp-v1";

  var cover = document.getElementById("cover");
  var openBtn = document.getElementById("openInvitation");
  var coverGuest = document.getElementById("coverGuest");
  var page = document.getElementById("page");
  var main = document.getElementById("main");

  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCount = document.getElementById("lbCount");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");

  var toastEl = document.getElementById("toast");
  var toastTimer = 0;

  var lightboxOpen = false;
  var lbIndex = 0;
  var lbTrigger = null;

  function showToast(message) {
    if (!toastEl) {
      return;
    }
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 3000);
  }

  function syncLock() {
    var locked = (cover && !cover.hidden && !cover.classList.contains("is-open")) || lightboxOpen;
    document.documentElement.classList.toggle("is-locked", locked);
  }

  function openInvitation() {
    if (!cover || cover.classList.contains("is-open")) {
      return;
    }
    cover.classList.add("is-open");
    if (page) {
      page.removeAttribute("inert");
    }
    document.documentElement.classList.remove("is-locked");
    if (main) {
      main.focus({ preventScroll: true });
    }
    window.setTimeout(function () {
      cover.hidden = true;
      syncLock();
    }, 780);
  }

  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (err) {
    params = null;
  }

  var guestName = "";
  if (params) {
    guestName = (params.get("guest") || params.get("ten") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  if (guestName && coverGuest) {
    coverGuest.textContent = guestName;
    document.title = "Thân mời " + guestName + " · Văn Sỹ & Trương Lan";
  }

  if (params && params.get("open") === "1") {
    if (cover) {
      cover.hidden = true;
    }
    if (page) {
      page.removeAttribute("inert");
    }
    document.documentElement.classList.remove("is-locked");
  } else {
    document.documentElement.classList.add("is-locked");
    if (page) {
      page.setAttribute("inert", "");
    }
    if (openBtn) {
      openBtn.addEventListener("click", openInvitation);
    }
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function buildCalendar() {
    var calendar = document.getElementById("calendar");
    if (!calendar) {
      return;
    }

    var year = 2026;
    var monthIndex = 10;
    var highlight = 28;
    calendar.textContent = "";

    var title = document.createElement("p");
    title.className = "cal__title";
    title.textContent = "Tháng 11 / 2026";
    calendar.appendChild(title);

    var week = document.createElement("div");
    week.className = "cal__week";
    ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach(function (label) {
      var cell = document.createElement("span");
      cell.textContent = label;
      week.appendChild(cell);
    });
    calendar.appendChild(week);

    var grid = document.createElement("div");
    grid.className = "cal__grid";
    var firstDay = new Date(year, monthIndex, 1).getDay();
    var offset = (firstDay + 6) % 7;
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (var i = 0; i < offset; i += 1) {
      var blank = document.createElement("span");
      blank.className = "cal__cell";
      grid.appendChild(blank);
    }

    for (var day = 1; day <= daysInMonth; day += 1) {
      var cell = document.createElement("span");
      cell.className = "cal__cell";

      if (day === highlight) {
        cell.classList.add("cal__cell--special");
        var heart = document.createElement("span");
        heart.className = "cal__heart";
        heart.setAttribute("aria-hidden", "true");
        heart.textContent = "♥";
        var number = document.createElement("b");
        number.textContent = String(day);
        cell.appendChild(heart);
        cell.appendChild(number);
      } else {
        cell.textContent = String(day);
      }

      grid.appendChild(cell);
    }

    calendar.appendChild(grid);
  }

  buildCalendar();

  var target = new Date("2026-11-28T15:00:00+07:00").getTime();
  var cdDays = document.getElementById("cdDays");
  var cdHours = document.getElementById("cdHours");
  var cdMinutes = document.getElementById("cdMinutes");
  var cdSeconds = document.getElementById("cdSeconds");

  function updateCountdown() {
    var diff = Math.max(0, target - Date.now());
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    if (cdDays) {
      cdDays.textContent = pad(days);
    }
    if (cdHours) {
      cdHours.textContent = pad(hours);
    }
    if (cdMinutes) {
      cdMinutes.textContent = pad(minutes);
    }
    if (cdSeconds) {
      cdSeconds.textContent = pad(seconds);
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  function readStore(key, fallback) {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(key) || "null");
      return parsed == null ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      return;
    }
  }

  function formatTime(timestamp) {
    var date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "";
    }
    return (
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      " " +
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  }

  var wishForm = document.getElementById("wishForm");
  var wishName = document.getElementById("wishName");
  var wishText = document.getElementById("wishText");
  var wishesEl = document.getElementById("wishes");
  var wishes = readStore(WISH_KEY, []);

  if (!Array.isArray(wishes)) {
    wishes = [];
  }

  function renderWishes() {
    if (!wishesEl) {
      return;
    }

    wishesEl.textContent = "";
    var items = wishes.slice().sort(function (a, b) {
      return (b.time || 0) - (a.time || 0);
    });

    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "wish-empty";
      empty.textContent = "Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể.";
      wishesEl.appendChild(empty);
      return;
    }

    items.slice(0, 50).forEach(function (item) {
      var card = document.createElement("article");
      card.className = "wish";

      var head = document.createElement("div");
      head.className = "wish__head";

      var name = document.createElement("span");
      name.className = "wish__name";
      name.textContent = item.name || "";

      var time = document.createElement("span");
      time.className = "wish__time";
      time.textContent = formatTime(item.time);

      head.appendChild(name);
      head.appendChild(time);

      var text = document.createElement("p");
      text.className = "wish__text";
      text.textContent = item.wish || "";

      card.appendChild(head);
      card.appendChild(text);
      wishesEl.appendChild(card);
    });
  }

  if (wishForm) {
    wishForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = wishName ? wishName.value.trim() : "";
      var text = wishText ? wishText.value.trim() : "";

      if (!name || !text) {
        showToast("Vui lòng nhập tên và lời chúc.");
        return;
      }

      wishes.unshift({
        name: name,
        wish: text,
        time: Date.now()
      });
      wishes = wishes.slice(0, 50);
      writeStore(WISH_KEY, wishes);
      renderWishes();
      wishForm.reset();
      showToast("Đã gửi lời chúc. Cảm ơn bạn!");
    });
  }

  renderWishes();

  var rsvpForm = document.getElementById("rsvpForm");
  var rsvpName = document.getElementById("rsvpName");
  var rsvpAttend = document.getElementById("rsvpAttend");
  var rsvpCount = document.getElementById("rsvpCount");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = rsvpName ? rsvpName.value.trim() : "";
      var attend = rsvpAttend ? rsvpAttend.value : "";
      var count = rsvpCount ? parseInt(rsvpCount.value, 10) : 1;

      if (!name || !attend) {
        showToast("Vui lòng nhập tên và chọn câu trả lời.");
        return;
      }

      if (isNaN(count) || count < 1) {
        count = attend === "no" ? 0 : 1;
      }
      if (attend === "no") {
        count = 0;
      }

      var list = readStore(RSVP_KEY, []);
      if (!Array.isArray(list)) {
        list = [];
      }
      list.unshift({
        name: name,
        attend: attend,
        count: count,
        guest: guestName,
        time: Date.now()
      });
      writeStore(RSVP_KEY, list.slice(0, 100));
      rsvpForm.reset();
      showToast("Đã lưu xác nhận tham dự. Cảm ơn bạn!");
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lbImg || !PHOTOS.length) {
      return;
    }

    lbTrigger = document.activeElement;
    lbIndex = (index + PHOTOS.length) % PHOTOS.length;
    lbImg.src = PHOTOS[lbIndex].src;
    lbImg.alt = "Ảnh cưới " + (lbIndex + 1);
    if (lbCount) {
      lbCount.textContent = lbIndex + 1 + " / " + PHOTOS.length;
    }

    lightboxOpen = true;
    lightbox.hidden = false;
    window.requestAnimationFrame(function () {
      lightbox.classList.add("is-visible");
    });
    syncLock();

    if (lbClose) {
      lbClose.focus({ preventScroll: true });
    }
  }

  function closeLightbox() {
    if (!lightbox || !lightboxOpen) {
      return;
    }

    lightboxOpen = false;
    lightbox.classList.remove("is-visible");
    window.setTimeout(function () {
      lightbox.hidden = true;
      syncLock();
      if (lbTrigger && typeof lbTrigger.focus === "function") {
        lbTrigger.focus({ preventScroll: true });
      }
    }, 240);
  }

  function moveLightbox(step) {
    if (!lightboxOpen) {
      return;
    }
    openLightbox(lbIndex + step);
  }

  Array.prototype.forEach.call(document.querySelectorAll(".album__item"), function (item) {
    item.addEventListener("click", function () {
      openLightbox(parseInt(item.getAttribute("data-photo"), 10) || 0);
    });
  });

  if (lbClose) {
    lbClose.addEventListener("click", closeLightbox);
  }
  if (lbPrev) {
    lbPrev.addEventListener("click", function () {
      moveLightbox(-1);
    });
  }
  if (lbNext) {
    lbNext.addEventListener("click", function () {
      moveLightbox(1);
    });
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-close-lightbox]")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (lightboxOpen) {
        closeLightbox();
      }
      return;
    }

    if (!lightboxOpen) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveLightbox(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveLightbox(1);
    }
  });
})();
