import { H as Hls } from "./hls-dru42stk.js";

const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
    body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
  });
}

const hero = document.querySelector("[data-hero]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  let current = 0;

  const showSlide = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
    dots.forEach((dot, index) => dot.classList.toggle("is-active", index === current));
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(current + 1), 5200);
  }
}

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const filterPanel = document.querySelector("[data-filter-panel]");
const cardList = document.querySelector("[data-card-list]");

if (filterPanel && cardList) {
  const textInput = filterPanel.querySelector("[data-filter-text]");
  const yearSelect = filterPanel.querySelector("[data-filter-year]");
  const typeSelect = filterPanel.querySelector("[data-filter-type]");
  const genreSelect = filterPanel.querySelector("[data-filter-genre]");
  const countNode = filterPanel.querySelector("[data-visible-count]");
  const cards = Array.from(cardList.querySelectorAll(".movie-card"));

  const applyFilter = () => {
    const text = normalize(textInput?.value);
    const year = normalize(yearSelect?.value);
    const type = normalize(typeSelect?.value);
    const genre = normalize(genreSelect?.value);
    let visible = 0;

    cards.forEach((card) => {
      const content = normalize(card.innerText);
      const cardYear = normalize(card.dataset.year);
      const cardType = normalize(card.dataset.type);
      const matchesText = !text || content.includes(text);
      const matchesYear = !year || cardYear === year;
      const matchesType = !type || cardType === type;
      const matchesGenre = !genre || content.includes(genre);
      const shouldShow = matchesText && matchesYear && matchesType && matchesGenre;

      card.classList.toggle("is-hidden-card", !shouldShow);
      if (shouldShow) {
        visible += 1;
      }
    });

    if (countNode) {
      countNode.textContent = String(visible);
    }
  };

  [textInput, yearSelect, typeSelect, genreSelect].forEach((control) => {
    control?.addEventListener("input", applyFilter);
    control?.addEventListener("change", applyFilter);
  });
}

const players = Array.from(document.querySelectorAll("[data-player]"));

players.forEach((player) => {
  const video = player.querySelector("video[data-m3u8]");
  const startButton = player.querySelector("[data-player-start]");

  if (!video || !startButton) {
    return;
  }

  const loadAndPlay = async () => {
    const source = video.dataset.m3u8;

    if (!source) {
      return;
    }

    startButton.classList.add("is-hidden");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    try {
      await video.play();
    } catch (error) {
      startButton.classList.remove("is-hidden");
      console.warn("需要用户再次点击播放。", error);
    }
  };

  startButton.addEventListener("click", loadAndPlay);
  video.addEventListener("play", () => startButton.classList.add("is-hidden"));
  video.addEventListener("pause", () => {
    if (video.currentTime === 0) {
      startButton.classList.remove("is-hidden");
    }
  });
});
