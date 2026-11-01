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
  var MUSIC_VIDEO_ID = "XqgyD0yadH0";

  var ENDPOINTS = window.WEDDING_ENDPOINTS || {};
  var WISH_ENDPOINT = ENDPOINTS.guestbook || "";
  var RSVP_ENDPOINT = ENDPOINTS.rsvp || "";
  var SIDE = (document.body && document.body.getAttribute("data-side")) || "nha-trai";

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

  var musicToggle = document.getElementById("musicToggle");
  var musicLabel = musicToggle ? musicToggle.querySelector(".music-toggle__label") : null;
  var ytPlayerEl = document.getElementById("ytPlayer");

  var musicWanted = false;
  var musicPlaying = false;
  var ytPlayer = null;
  var ytReady = false;
  var ytLoading = false;
  var ytFailed = false;
  var ytCallbacks = [];

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
    playMusic();
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

  function setMusicUi(playing) {
    musicPlaying = !!playing;
    if (musicToggle) {
      musicToggle.classList.toggle("is-playing", playing);
      musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
      musicToggle.setAttribute("aria-label", playing ? "Tắt nhạc" : "Bật nhạc");
    }
    if (musicLabel) {
      musicLabel.textContent = playing ? "Tắt nhạc" : "Bật nhạc";
    }
  }

  function ensureYouTubeApi(callback) {
    if (window.YT && typeof window.YT.Player === "function") {
      callback();
      return;
    }
    if (ytFailed) {
      return;
    }
    if (ytCallbacks.indexOf(callback) === -1) {
      ytCallbacks.push(callback);
    }
    if (ytLoading) {
      return;
    }
    ytLoading = true;

    var previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof previousReady === "function") {
        try {
          previousReady();
        } catch (err) {}
      }
      ytLoading = false;
      var queue = ytCallbacks.slice();
      ytCallbacks = [];
      queue.forEach(function (fn) {
        try {
          fn();
        } catch (err) {}
      });
    };

    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = function () {
      ytFailed = true;
      ytLoading = false;
      ytCallbacks = [];
      musicWanted = false;
      setMusicUi(false);
    };
    document.head.appendChild(tag);
  }

  function createMusicPlayer() {
    if (ytPlayer || ytFailed || !ytPlayerEl) {
      return;
    }
    ensureYouTubeApi(function () {
      if (ytPlayer || ytFailed || !window.YT || typeof window.YT.Player !== "function") {
        return;
      }
      try {
        ytPlayer = new window.YT.Player("ytPlayer", {
          videoId: MUSIC_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: MUSIC_VIDEO_ID,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            fs: 0,
            disablekb: 1,
            iv_load_policy: 3
          },
          events: {
            onReady: function (event) {
              ytReady = true;
              try {
                event.target.setVolume(55);
              } catch (err) {}
              var iframe = typeof event.target.getIframe === "function" ? event.target.getIframe() : null;
              if (iframe) {
                iframe.setAttribute("aria-hidden", "true");
                iframe.setAttribute("tabindex", "-1");
                iframe.style.position = "fixed";
                iframe.style.top = "-9999px";
                iframe.style.left = "-9999px";
                iframe.style.width = "1px";
                iframe.style.height = "1px";
                iframe.style.opacity = "0";
                iframe.style.pointerEvents = "none";
              }
              if (musicWanted) {
                try {
                  event.target.playVideo();
                } catch (err) {}
              }
            },
            onStateChange: function (event) {
              if (!window.YT || !window.YT.PlayerState) {
                return;
              }
              if (event.data === window.YT.PlayerState.PLAYING) {
                setMusicUi(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setMusicUi(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                if (musicWanted) {
                  try {
                    event.target.seekTo(0);
                    event.target.playVideo();
                  } catch (err) {}
                } else {
                  setMusicUi(false);
                }
              }
            },
            onError: function () {
              ytFailed = true;
              musicWanted = false;
              setMusicUi(false);
            }
          }
        });
      } catch (err) {
        ytFailed = true;
        ytPlayer = null;
        setMusicUi(false);
      }
    });
  }

  function playMusic() {
    musicWanted = true;
    if (ytFailed) {
      musicWanted = false;
      setMusicUi(false);
      return;
    }
    if (ytPlayer && ytReady && typeof ytPlayer.playVideo === "function") {
      try {
        ytPlayer.playVideo();
      } catch (err) {}
      return;
    }
    createMusicPlayer();
  }

  function pauseMusic() {
    musicWanted = false;
    setMusicUi(false);
    if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === "function") {
      try {
        ytPlayer.pauseVideo();
      } catch (err) {}
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", function () {
      if (musicToggle.classList.contains("is-playing")) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
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

  playMusic();

  function retryMusicOnFirstGesture(event) {
    if (event.target && event.target.closest && event.target.closest(".music-toggle")) {
      return;
    }
    if (musicWanted && !musicPlaying) {
      playMusic();
    }
  }

  if (window.PointerEvent) {
    document.addEventListener("pointerdown", retryMusicOnFirstGesture, { once: true });
  } else {
    document.addEventListener("click", retryMusicOnFirstGesture, { once: true });
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

  function postForm(url, payload) {
    if (!url) {
      return Promise.resolve();
    }
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(payload).toString()
    });
  }

  function updateEndpointNotes() {
    var rsvpNote = document.getElementById("rsvpNote");
    var wishNote = document.getElementById("wishNote");

    if (rsvpNote) {
      rsvpNote.textContent = RSVP_ENDPOINT
        ? "Thông tin sẽ được gửi đến gia đình."
        : "Thông tin được lưu trên thiết bị của bạn.";
    }
    if (wishNote) {
      wishNote.textContent = WISH_ENDPOINT
        ? "Lời chúc sẽ được gửi và hiển thị cho mọi người."
        : "Lời chúc được lưu trên thiết bị của bạn.";
    }
  }

  updateEndpointNotes();

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
  var remoteWishes = [];

  if (!Array.isArray(wishes)) {
    wishes = [];
  }

  function mergeWishes() {
    var merged = [];
    var seen = {};

    remoteWishes.concat(wishes).forEach(function (item) {
      var name = String(item.name || "").trim();
      var text = String(item.wish || "").trim();

      if (!name || !text) {
        return;
      }

      var key = name + "|" + text;
      if (seen[key]) {
        return;
      }
      seen[key] = true;
      merged.push({
        name: name,
        wish: text,
        time: Number(item.time) || 0,
        side: item.side || ""
      });
    });

    return merged;
  }

  function renderWishes() {
    if (!wishesEl) {
      return;
    }

    wishesEl.textContent = "";
    var items = mergeWishes().sort(function (a, b) {
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

  function loadRemoteWishes() {
    if (!WISH_ENDPOINT) {
      return;
    }

    var callbackName = "syLanWishes" + Date.now() + Math.floor(Math.random() * 1000);
    var script = document.createElement("script");
    var timeout = window.setTimeout(cleanup, 8000);

    function cleanup() {
      window.clearTimeout(timeout);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      try {
        delete window[callbackName];
      } catch (err) {
        window[callbackName] = undefined;
      }
    }

    window[callbackName] = function (payload) {
      cleanup();
      if (!payload || !Array.isArray(payload.wishes)) {
        return;
      }
      remoteWishes = payload.wishes;
      renderWishes();
    };

    script.onerror = cleanup;
    script.src =
      WISH_ENDPOINT +
      (WISH_ENDPOINT.indexOf("?") === -1 ? "?" : "&") +
      "action=wishes&callback=" +
      encodeURIComponent(callbackName);
    document.body.appendChild(script);
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

      var entry = {
        action: "wish",
        name: name,
        wish: text,
        guest: guestName,
        side: SIDE,
        time: Date.now()
      };

      wishes.unshift(entry);
      wishes = wishes.slice(0, 50);
      writeStore(WISH_KEY, wishes);
      renderWishes();

      postForm(WISH_ENDPOINT, entry).catch(function () {});

      wishForm.reset();
      showToast(
        WISH_ENDPOINT
          ? "Đã gửi lời chúc. Cảm ơn bạn!"
          : "Đã lưu lời chúc trên thiết bị này."
      );

      if (WISH_ENDPOINT) {
        window.setTimeout(loadRemoteWishes, 1500);
      }
    });
  }

  renderWishes();
  loadRemoteWishes();

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
      var entry = {
        action: "rsvp",
        name: name,
        attend: attend,
        count: count,
        guest: guestName,
        side: SIDE,
        time: Date.now()
      };

      list.unshift(entry);
      writeStore(RSVP_KEY, list.slice(0, 100));

      postForm(RSVP_ENDPOINT, entry).catch(function () {});

      rsvpForm.reset();
      showToast(
        RSVP_ENDPOINT
          ? "Đã gửi xác nhận tham dự. Cảm ơn bạn!"
          : "Đã lưu xác nhận tham dự trên thiết bị này."
      );
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
