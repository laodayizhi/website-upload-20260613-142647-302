(function () {
  function attach(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function mount(videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var loaded = false;

    if (!video || !source) {
      return;
    }

    function play() {
      if (!loaded) {
        attach(video, source);
        loaded = true;
      }

      if (button) {
        button.classList.add("is-hidden");
      }

      var started = video.play();
      if (started && typeof started.catch === "function") {
        started.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  }

  window.MoviePlayer = {
    mount: mount
  };
})();
