(function () {
  function loadHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function bindPlayer(panel) {
    var video = panel.querySelector('video');
    var button = panel.querySelector('.player-start');
    var source = panel.getAttribute('data-src');
    var started = false;
    var hlsInstance = null;

    function attach() {
      if (!video || !source) {
        return Promise.resolve();
      }

      if (started) {
        return Promise.resolve();
      }

      started = true;
      panel.classList.add('is-playing');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
      }

      return loadHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }).catch(function () {
        video.src = source;
      });
    }

    function play() {
      attach().then(function () {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          play();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.js-player').forEach(bindPlayer);
    });
  } else {
    document.querySelectorAll('.js-player').forEach(bindPlayer);
  }
})();
