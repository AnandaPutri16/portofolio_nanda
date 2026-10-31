document.addEventListener('DOMContentLoaded', () => {
  const certificates = [...(window.portfolioCertificates || [])].sort((first, second) => {
    if (!first.issuedAt) return second.issuedAt ? 1 : 0;
    if (!second.issuedAt) return -1;
    return new Date(second.issuedAt) - new Date(first.issuedAt);
  });
  const grid = document.getElementById('certificate-grid');
  const loadMoreButton = document.getElementById('load-more-certificates');
  const count = document.getElementById('certificate-count');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxPdf = lightbox.querySelector('.certificate-pdf-lightbox');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const pageSize = 6;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visibleCount = 0;
  let activeTrigger = null;

  const revealObserver = reducedMotion
    ? null
    : new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

  const createActionButton = (certificate) => {
    const button = document.createElement('button');
    button.className = 'btn certificate-open-trigger';
    button.type = 'button';
    button.dataset.asset = certificate.asset;
    button.dataset.assetType = certificate.type;
    button.setAttribute('aria-label', `Lihat sertifikat: ${certificate.title}`);

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-arrow-up-right-from-square';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, document.createTextNode(' Lihat Sertifikat'));
    return button;
  };

  const createMedia = (certificate) => {
    if (certificate.type === 'pdf') {
      const media = document.createElement('div');
      media.className = 'certificate-media certificate-pdf-media';

      const frame = document.createElement('iframe');
      frame.src = `${certificate.asset}#toolbar=0&navpanes=0&view=FitH`;
      frame.title = `${certificate.title} preview`;
      frame.loading = 'lazy';
      media.appendChild(frame);

      const openButton = document.createElement('button');
      openButton.className = 'certificate-pdf-overlay certificate-open-trigger';
      openButton.type = 'button';
      openButton.dataset.asset = certificate.asset;
      openButton.dataset.assetType = certificate.type;
      openButton.setAttribute('aria-label', `Lihat preview: ${certificate.title}`);
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-up-right-and-down-left-from-center';
      icon.setAttribute('aria-hidden', 'true');
      openButton.appendChild(icon);
      media.appendChild(openButton);
      return media;
    }

    const button = document.createElement('button');
    button.className = 'certificate-media certificate-open-trigger';
    button.type = 'button';
    button.dataset.asset = certificate.asset;
    button.dataset.assetType = certificate.type;
    button.setAttribute('aria-label', `Lihat preview: ${certificate.title}`);

    const image = document.createElement('img');
    image.src = certificate.asset;
    image.alt = certificate.title;
    image.loading = 'lazy';
    button.appendChild(image);
    return button;
  };

  const createCertificateCard = (certificate) => {
    const card = document.createElement('article');
    card.className = 'certificate-card reveal-up';

    const info = document.createElement('div');
    info.className = 'certificate-info';

    const title = document.createElement('h3');
    title.textContent = certificate.title;

    const issuer = document.createElement('p');
    issuer.className = 'certificate-issuer';
    issuer.textContent = certificate.issuer;

    const date = document.createElement('p');
    date.className = 'certificate-date';
    date.textContent = certificate.dateLabel;

    const description = document.createElement('p');
    description.className = 'certificate-description';
    description.textContent = certificate.description;

    info.append(title, issuer, date, description, createActionButton(certificate));
    card.append(createMedia(certificate), info);
    return card;
  };

  const renderNextPage = () => {
    const nextCertificates = certificates.slice(visibleCount, visibleCount + pageSize);
    const fragment = document.createDocumentFragment();
    nextCertificates.forEach((certificate) => {
      const card = createCertificateCard(certificate);
      fragment.appendChild(card);
      if (revealObserver) revealObserver.observe(card);
      else card.classList.add('visible');
    });
    grid.appendChild(fragment);
    visibleCount += nextCertificates.length;
    count.textContent = `Menampilkan ${visibleCount} dari ${certificates.length} sertifikat`;
    loadMoreButton.hidden = visibleCount >= certificates.length;
  };

  const openPreview = (trigger) => {
    const { asset, assetType } = trigger.dataset;
    activeTrigger = trigger;
    if (assetType === 'pdf') {
      lightboxImage.hidden = true;
      lightboxPdf.hidden = false;
      lightboxPdf.src = `${asset}#toolbar=0&navpanes=0&view=FitH`;
    } else {
      lightboxPdf.hidden = true;
      lightboxPdf.src = '';
      lightboxImage.hidden = false;
      lightboxImage.src = asset;
      lightboxImage.alt = trigger.getAttribute('aria-label').replace(/^(Lihat preview|Lihat sertifikat): /, '');
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
  };

  const closePreview = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxPdf.src = '';
    lightboxPdf.hidden = true;
    lightboxImage.src = '';
    lightboxImage.hidden = false;
    if (activeTrigger?.isConnected) activeTrigger.focus();
    activeTrigger = null;
  };

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('.certificate-open-trigger');
    if (trigger) openPreview(trigger);
  });

  loadMoreButton.addEventListener('click', renderNextPage);
  lightboxClose.addEventListener('click', closePreview);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closePreview();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closePreview();
  });

  renderNextPage();
});