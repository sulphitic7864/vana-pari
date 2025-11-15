/* Updated cookie.js — adds GA4 guard and optional Clarity consent handling */

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem('cookieConsent')) || null;
  } catch (e) { return null; }
}

function storeConsent(consent) {
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
}

function updateAnalyticsConsent(consent) {
  window.dataLayer = window.dataLayer || [];
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied'
    });
  }
  if (window.clarity) {
    try { window.clarity('consent', consent.analytics); } catch (e) {}
  }
}

function showModal(show) {
  const modal = document.getElementById('cookie-banner');
  if (!modal) return;
  modal.setAttribute('aria-hidden', !show);
  modal.style.display = show ? 'flex' : 'none';
  document.body.style.overflow = show ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', function () {
  const consent = readConsent();
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (!consent) showModal(true);
  else updateAnalyticsConsent(consent);

  document.querySelectorAll('[data-cookie-accept]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.cookieAccept;
      const consentObj = { analytics: choice !== 'necessary', marketing: false };
      storeConsent(consentObj);
      updateAnalyticsConsent(consentObj);
      showModal(false);
    });
  });

  document.getElementById('cookie-manage')?.addEventListener('click', () => showModal(true));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') showModal(false);
  });
});
