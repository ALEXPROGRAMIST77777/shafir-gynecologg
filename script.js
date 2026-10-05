(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var fab = document.querySelector('.fab');

  /* --- Плавное появление при прокрутке --- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Шапка, плавающая кнопка, линия шагов --- */
  var steps = document.getElementById('steps');
  var fill = document.getElementById('stepsFill');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (fab) fab.classList.toggle('show', y > 520);

    if (steps && fill) {
      var r = steps.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / (r.height + vh * 0.2);
      p = Math.max(0, Math.min(1, p));
      fill.style.width = (p * 100) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* --- Мобильное меню --- */
  function closeMenu() {
    if (!burger || !nav) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* --- Лёгкий 3D-наклон фото (только на устройствах с мышью) --- */
  var tilt = document.getElementById('tilt');
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (tilt && canHover && !reduceMotion) {
    var hero = tilt.closest('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      tilt.style.transform = 'perspective(1000px) rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 5).toFixed(2) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* --- Мягкий наклон карточек при наведении --- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tx', (x * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ty', (-y * 6).toFixed(2) + 'deg');
        card.style.transform = 'translateY(-8px) perspective(900px) rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 5).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* --- FAQ: одновременно открыт только один вопрос --- */
  var items = document.querySelectorAll('.faq__item');
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        items.forEach(function (other) { if (other !== item) other.open = false; });
      }
    });
  });
})();
