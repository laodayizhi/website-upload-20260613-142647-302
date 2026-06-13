const movies = Array.isArray(window.MOVIE_SEARCH_DATA) ? window.MOVIE_SEARCH_DATA : [];
const app = document.querySelector("[data-search-app]");
const results = document.querySelector("[data-search-results]");

const normalize = (value) => (value || "").toString().trim().toLowerCase();
const uniqueSorted = (items) => Array.from(new Set(items.filter(Boolean))).sort();

const renderOptions = (select, values) => {
  if (!select) {
    return;
  }

  const currentFirst = select.querySelector("option")?.outerHTML || "";
  select.innerHTML = currentFirst + values.map((value) => `<option value="${value}">${value}</option>`).join("");
};

const createCard = (movie) => {
  const tags = movie.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("");

  return `
<article class="movie-card">
  <a class="movie-card__poster" href="${movie.url}" aria-label="观看${movie.title}">
    <img src="${movie.cover}" alt="${movie.title}封面" loading="lazy" />
    <span class="movie-card__shade"></span>
    <span class="play-pill">立即播放</span>
  </a>
  <div class="movie-card__body">
    <div class="movie-card__meta">
      <a href="${movie.categoryUrl}">${movie.category}</a>
      <span>${movie.year}</span>
      <span>${movie.region}</span>
    </div>
    <h3><a href="${movie.url}">${movie.title}</a></h3>
    <p>${movie.oneLine}</p>
    <div class="tag-row">${tags}</div>
  </div>
</article>`;
};

if (app && results) {
  const form = app.querySelector("[data-search-form]");
  const input = app.querySelector("[data-search-input]");
  const yearSelect = app.querySelector("[data-search-year]");
  const regionSelect = app.querySelector("[data-search-region]");
  const typeSelect = app.querySelector("[data-search-type]");
  const countNode = app.querySelector("[data-search-count]");

  renderOptions(yearSelect, uniqueSorted(movies.map((movie) => movie.year)).reverse());
  renderOptions(regionSelect, uniqueSorted(movies.map((movie) => movie.region)));
  renderOptions(typeSelect, uniqueSorted(movies.map((movie) => movie.type)));

  const params = new URLSearchParams(window.location.search);
  const queryFromUrl = params.get("q") || "";

  if (input && queryFromUrl) {
    input.value = queryFromUrl;
  }

  const search = () => {
    const query = normalize(input?.value);
    const year = normalize(yearSelect?.value);
    const region = normalize(regionSelect?.value);
    const type = normalize(typeSelect?.value);

    const matched = movies.filter((movie) => {
      const haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        movie.tags.join(" "),
      ].join(" "));

      return (!query || haystack.includes(query))
        && (!year || normalize(movie.year) === year)
        && (!region || normalize(movie.region) === region)
        && (!type || normalize(movie.type) === type);
    }).slice(0, 200);

    countNode.textContent = String(matched.length);
    results.innerHTML = matched.map(createCard).join("\n");
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });

  [input, yearSelect, regionSelect, typeSelect].forEach((control) => {
    control?.addEventListener("input", search);
    control?.addEventListener("change", search);
  });

  search();
}
