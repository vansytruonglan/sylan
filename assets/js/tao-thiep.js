(function () {
  "use strict";

  var form = document.getElementById("guestForm");
  var input = document.getElementById("guestName");
  var errorEl = document.getElementById("formError");
  var result = document.getElementById("result");
  var groomInput = document.getElementById("groomLink");
  var brideInput = document.getElementById("brideLink");
  var statusEl = document.getElementById("copyStatus");

  var statusTimer = 0;

  function normalizeName(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function makeLink(page, name) {
    var url = new URL(page, window.location.href);
    url.searchParams.set("guest", name);
    return url.href;
  }

  function showError(message) {
    if (!errorEl) {
      return;
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function setStatus(message) {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    window.clearTimeout(statusTimer);
    if (message) {
      statusTimer = window.setTimeout(function () {
        statusEl.textContent = "";
      }, 3200);
    }
  }

  function fallbackCopy(target) {
    if (!target) {
      return false;
    }
    target.focus();
    target.select();
    if (typeof target.setSelectionRange === "function") {
      target.setSelectionRange(0, target.value.length);
    }
    try {
      return document.execCommand("copy");
    } catch (err) {
      return false;
    }
  }

  function copyText(text, target) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(target);
        }
      );
    }
    return Promise.resolve(fallbackCopy(target));
  }

  function resetResult() {
    if (result) {
      result.hidden = true;
    }
    if (groomInput) {
      groomInput.value = "";
    }
    if (brideInput) {
      brideInput.value = "";
    }
    setStatus("");
  }

  if (form && input && result && groomInput && brideInput) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError();

      var name = normalizeName(input.value);
      if (!name) {
        resetResult();
        showError("Vui lòng nhập tên khách.");
        input.focus();
        return;
      }

      groomInput.value = makeLink("index.html", name);
      brideInput.value = makeLink("nha-gai.html", name);
      result.hidden = false;
      setStatus("");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        result.scrollIntoView({ block: "nearest" });
      } else {
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    input.addEventListener("input", clearError);

    Array.prototype.forEach.call(document.querySelectorAll(".tool-copy"), function (button) {
      button.addEventListener("click", function () {
        var target = document.getElementById(button.getAttribute("data-copy"));
        if (!target || !target.value) {
          return;
        }

        var label = button.getAttribute("data-copy") === "groomLink" ? "nhà trai" : "nhà gái";

        copyText(target.value, target).then(function (ok) {
          if (ok) {
            setStatus("Đã sao chép link " + label + ".");
          } else {
            target.focus();
            target.select();
            setStatus("Không sao chép tự động được. Hãy chọn link và sao chép thủ công.");
          }
        });
      });
    });
  }
})();
