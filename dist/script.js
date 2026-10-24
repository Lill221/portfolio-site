document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.header');
const progressBar = document.querySelector('.reading-progress');
const heroArt = document.querySelector('.hero-art');
const statement = document.querySelector('.scroll-statement');
const statementText = statement.textContent;
statement.setAttribute('aria-label', statementText);
statement.textContent = '';
statementText.split(' ').forEach((word, i) => {
  if (i) statement.append(document.createTextNode(' '));
  const span = document.createElement('span');
  span.className = 'word'; span.textContent = word; span.setAttribute('aria-hidden', 'true'); statement.append(span);
});
const words = [...statement.querySelectorAll('.word')];
let scrollScheduled = false;
function updateScroll() {
  const y = window.scrollY, vh = window.innerHeight;
  header.classList.toggle('scrolled', y > 100);
  const max = document.documentElement.scrollHeight - vh;
  progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!reduceMotion.matches && y < vh * 1.2) heroArt.style.transform = `translateY(${y * .18}px)`;
  const rect = statement.getBoundingClientRect();
  const fraction = Math.max(0, Math.min(1, (vh * .87 - rect.top) / (vh * .46 + rect.height * .15)));
  words.forEach((word, i) => word.classList.toggle('lit', reduceMotion.matches || i / words.length <= fraction));
  scrollScheduled = false;
}
window.addEventListener('scroll', () => { if (!scrollScheduled) { requestAnimationFrame(updateScroll); scrollScheduled = true; } }, { passive: true });
window.addEventListener('resize', updateScroll);
reduceMotion.addEventListener('change', updateScroll);
updateScroll();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.desktop-nav a').forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id)); }), { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(el => navObserver.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
setTimeout(() => document.querySelector('.intro')?.remove(), reduceMotion.matches ? 0 : 2000);

const menuButton = document.querySelector('.menu-toggle'), mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) { header.classList.toggle('menu-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); mobileNav.inert = !open; document.body.style.overflow = open ? 'hidden' : ''; }
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); menuButton.focus(); } });
window.addEventListener('resize', () => { if (window.innerWidth > 700) setMenu(false); });
// Keep native details semantics, but animate both directions and rapid reversals.
const serviceStates = new Map();
function settleService(details, expanded) {
  const state = serviceStates.get(details);
  if (state.animation) state.animation.onfinish = null;
  state.animation?.cancel();
  state.fade?.cancel();
  state.animation = state.fade = null;
  state.expanded = expanded;
  details.open = expanded;
  details.style.height = '';
  details.style.overflow = '';
  details.classList.remove('is-closing');
  state.content.style.opacity = '';
  state.summary.setAttribute('aria-expanded', String(expanded));
}
function animateService(details, expanded) {
  const state = serviceStates.get(details);
  const startHeight = details.getBoundingClientRect().height;
  const startOpacity = details.open ? Number(getComputedStyle(state.content).opacity) : 0;
  if (state.animation) state.animation.onfinish = null;
  state.animation?.cancel();
  state.fade?.cancel();
  state.expanded = expanded;
  state.summary.setAttribute('aria-expanded', String(expanded));
  if (reduceMotion.matches || document.body.classList.contains('motion-paused') || !details.animate) {
    settleService(details, expanded);
    return;
  }
  // Leave the panel rendered until a closing animation actually finishes.
  details.open = true;
  details.style.height = `${startHeight}px`;
  details.style.overflow = 'hidden';
  details.classList.toggle('is-closing', !expanded);
  const box = getComputedStyle(details);
  const edges = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
    .reduce((sum, property) => sum + parseFloat(box[property]), 0);
  const endHeight = state.summary.offsetHeight + edges + (expanded ? state.content.offsetHeight : 0);
  const timing = { duration: expanded ? 560 : 460, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' };
  state.animation = details.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], timing);
  state.fade = state.content.animate([{ opacity: startOpacity }, { opacity: expanded ? 1 : 0 }], timing);
  state.animation.onfinish = () => settleService(details, expanded);
}
document.querySelectorAll('.service-item').forEach(details => {
  const summary = details.querySelector('summary');
  serviceStates.set(details, { summary, content: details.querySelector('.service-detail'), expanded: details.open, animation: null, fade: null });
  summary.setAttribute('aria-expanded', String(details.open));
  summary.addEventListener('click', event => {
    event.preventDefault();
    const expanded = !serviceStates.get(details).expanded;
    if (expanded) serviceStates.forEach((state, other) => { if (other !== details && state.expanded) animateService(other, false); });
    animateService(details, expanded);
  });
});
function settleServices() {
  serviceStates.forEach((state, details) => { if (state.animation) settleService(details, state.expanded); });
}
window.addEventListener('resize', settleServices);
reduceMotion.addEventListener('change', settleServices);
let toastTimer;
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => { const toast = document.querySelector('.toast'); toast.textContent = 'Способ связи добавим на следующем этапе.'; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3500); }));
const dialog = document.querySelector('.video-dialog');
const player = document.querySelector('.full-video');
const previewVideos = [...document.querySelectorAll('.ambient-video')];
const visiblePreviews = new Set();
let motionPaused = reduceMotion.matches;
const motionButton = document.querySelector('.motion-toggle');
function syncPreviews() {
  previewVideos.forEach(video => {
    const shouldPlay = !motionPaused && !document.hidden && !dialog.open && visiblePreviews.has(video) && video.getBoundingClientRect().width > 0;
    if (shouldPlay) { if (!video.getAttribute('src')) video.src = video.dataset.src; video.play().catch(() => {}); }
    else video.pause();
  });
}
function setMotion(paused) {
  motionPaused = paused;
  document.body.classList.toggle('motion-paused', paused);
  if (paused) settleServices();
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.innerHTML = paused ? '▶ <span>Включить анимацию</span>' : 'Ⅱ <span>Пауза анимации</span>';
  syncPreviews();
}
motionButton.addEventListener('click', () => setMotion(!motionPaused));
reduceMotion.addEventListener('change', () => setMotion(reduceMotion.matches));
document.addEventListener('visibilitychange', syncPreviews);
if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(entries => { entries.forEach(entry => entry.isIntersecting ? visiblePreviews.add(entry.target) : visiblePreviews.delete(entry.target)); syncPreviews(); }, { threshold: .15 });
  previewVideos.forEach(video => videoObserver.observe(video));
}
setMotion(motionPaused);
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  document.getElementById('video-title').textContent = button.dataset.title;
  document.getElementById('video-description').textContent = button.dataset.description;
  player.poster = `assets/poster-${button.dataset.video}.webp`;
  player.src = `assets/work-${button.dataset.video}.mp4`;
  player.muted = false;
  dialog.showModal();
  syncPreviews();
  player.play().catch(() => {});
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { player.pause(); player.removeAttribute('src'); player.load(); syncPreviews(); });
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
