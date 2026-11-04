(() => {
  const activities = window.portfolioGalleryActivities || [];
  const grid = document.getElementById('gallery-grid');
  const filter = document.getElementById('gallery-filter');
  const count = document.getElementById('gallery-count');
  const loadMore = document.getElementById('gallery-load-more');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('gallery-lightbox-image');
  const lightboxMeta = document.getElementById('gallery-lightbox-meta');
  const lightboxTitle = document.getElementById('gallery-lightbox-title');
  const lightboxDescription = document.getElementById('gallery-lightbox-description');
  const previousButton = document.getElementById('gallery-previous');
  const nextButton = document.getElementById('gallery-next');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const pageSize = 9;
  let visibleCount = pageSize;
  let filteredActivities = activities;
  let activeIndex = -1;
  let lastFocusedElement = null;
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

  const populateFilters = () => {
    [...new Set(activities.map((activity) => activity.category))]
      .sort((first, second) => first.localeCompare(second))
      .forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filter.appendChild(option);
      });
  };

  const createCard = (activity, index) => {
    const date = activity.date ? `<span>${escapeHtml(activity.date)}</span>` : '';
    const detail = activity.detail ? `<span>${escapeHtml(activity.detail)}</span>` : '';
    return `
      <article class="gallery-card reveal-up">
        <button class="gallery-image-button" type="button" data-gallery-index="${index}" aria-label="View ${escapeHtml(activity.title)} photo">
          <img src="${escapeHtml(activity.image)}" alt="${escapeHtml(activity.title)}" loading="lazy" />
          <span class="gallery-image-overlay" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
        </button>
        <div class="gallery-card-content">
          <h2>${escapeHtml(activity.title)}</h2>
          <div class="gallery-card-meta">
            <span class="gallery-card-category">${escapeHtml(activity.category)}</span>
            ${detail}
            ${date}
          </div>
          <p class="gallery-card-description">${escapeHtml(activity.description)}</p>
        </div>
      </article>`;
  };

  const render = () => {
    const visibleActivities = filteredActivities.slice(0, visibleCount);
    grid.querySelectorAll('.gallery-card').forEach((card) => revealObserver.unobserve(card));
    grid.innerHTML = visibleActivities.map((activity) => createCard(activity, filteredActivities.indexOf(activity))).join('');
    grid.querySelectorAll('.gallery-card').forEach((card) => revealObserver.observe(card));
    count.textContent = `Showing ${visibleActivities.length} of ${filteredActivities.length} activities`;
    loadMore.hidden = visibleActivities.length >= filteredActivities.length;
  };

  const updateLightbox = () => {
    const activity = filteredActivities[activeIndex];
    if (!activity) return;
    lightboxImage.src = activity.image;
    lightboxImage.alt = activity.title;
    lightboxMeta.textContent = [activity.category, activity.detail, activity.date].filter(Boolean).join(' · ');
    lightboxTitle.textContent = activity.title;
    lightboxDescription.textContent = activity.description;
  };

  const openLightbox = (index, trigger) => {
    activeIndex = index;
    lastFocusedElement = trigger;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const moveLightbox = (offset) => {
    activeIndex = (activeIndex + offset + filteredActivities.length) % filteredActivities.length;
    updateLightbox();
  };

  populateFilters();
  render();

  filter.addEventListener('change', () => {
    filteredActivities = filter.value === 'all'
      ? activities
      : activities.filter((activity) => activity.category === filter.value);
    visibleCount = pageSize;
    render();
  });

  loadMore.addEventListener('click', () => {
    visibleCount += pageSize;
    render();
  });

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-gallery-index]');
    if (trigger) openLightbox(Number(trigger.dataset.galleryIndex), trigger);
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => moveLightbox(-1));
  nextButton.addEventListener('click', () => moveLightbox(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });
})();