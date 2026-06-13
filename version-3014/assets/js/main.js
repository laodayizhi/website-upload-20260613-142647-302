(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('.poster-img, .hero-bg-wrap img').forEach(function (img) {
      img.addEventListener('error', function () {
        var wrap = img.closest('.poster-wrap');
        if (wrap) {
          wrap.classList.add('is-missing');
        }
        img.style.opacity = '0';
      });
    });

    document.querySelectorAll('.hero-slider').forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
      var index = 0;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });

      show(0);
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    });

    document.querySelectorAll('.movie-search').forEach(function (input) {
      var scope = input.closest('main') || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));
      var empty = scope.querySelector('.empty-result');

      function filter() {
        var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var matched = words.every(function (word) {
            return haystack.indexOf(word) !== -1;
          });
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          scope.classList.toggle('has-empty-result', visible === 0);
        }
      }

      input.addEventListener('input', filter);
    });
  });
})();
