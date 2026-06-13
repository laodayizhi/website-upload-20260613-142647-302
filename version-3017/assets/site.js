(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");

    if (header && toggle) {
      toggle.addEventListener("click", function () {
        header.classList.toggle("is-open");
      });
    }

    document.querySelectorAll(".top-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          return;
        }
        event.preventDefault();
        var action = form.getAttribute("action") || "search.html";
        window.location.href = action + "?q=" + encodeURIComponent(input.value.trim());
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var current = 0;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
        });
      });

      if (slides.length > 1) {
        setInterval(function () {
          show(current + 1);
        }, 5200);
      }
    }

    var pageFilter = document.querySelector(".page-filter");
    var typeFilter = document.querySelector(".type-filter");
    var regionFilter = document.querySelector(".region-filter");
    var list = document.querySelector(".searchable-list");
    var empty = document.querySelector(".empty-state");

    function normalize(value) {
      return (value || "").toString().trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.year,
        card.dataset.tags
      ].join(" "));
    }

    function applyFilter() {
      if (!list) {
        return;
      }
      var query = normalize(pageFilter ? pageFilter.value : "");
      var typeValue = normalize(typeFilter ? typeFilter.value : "");
      var regionValue = normalize(regionFilter ? regionFilter.value : "");
      var visible = 0;

      list.querySelectorAll(".movie-card, .rank-card").forEach(function (card) {
        var text = cardText(card);
        var typeMatch = !typeValue || normalize(card.dataset.type) === typeValue;
        var regionMatch = !regionValue || normalize(card.dataset.region) === regionValue;
        var keywordMatch = !query || text.indexOf(query) !== -1;
        var keep = typeMatch && regionMatch && keywordMatch;
        card.hidden = !keep;
        if (keep) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q && pageFilter) {
      pageFilter.value = q;
    }

    [pageFilter, typeFilter, regionFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".filter-chip").forEach(function (item) {
          item.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        if (pageFilter) {
          pageFilter.value = chip.dataset.filterValue || chip.textContent || "";
        }
        applyFilter();
      });
    });

    applyFilter();
  });
})();
