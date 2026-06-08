// ── Theme init (runs before render to avoid flash) ──
(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();

var _sunIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
var _moonIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('theme',t);
  var btn=document.getElementById('themeToggle');
  if(btn) btn.innerHTML = t==='light'?_moonIcon:_sunIcon;
}

window.addEventListener('DOMContentLoaded',function(){
  var saved=localStorage.getItem('theme')||'dark';
  applyTheme(saved);
  var btn=document.getElementById('themeToggle');
  if(btn) btn.addEventListener('click',function(){
    applyTheme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light');
  });
});

// ── Cursor ──
const cd=document.getElementById('cd'),cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px';});
(function tick(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(tick);})();
document.querySelectorAll('a,button,.ecard,.film-card,.ig-card,.cov-card,.sc,.tmcard,.soc-row').forEach(function(el){
  el.addEventListener('mouseenter',function(){cd.classList.add('h');cr.classList.add('h');});
  el.addEventListener('mouseleave',function(){cd.classList.remove('h');cr.classList.remove('h');});
});

// ── Scroll-to-explore button ──
var scrollBtn=document.querySelector('.scroll-glass');
if(scrollBtn){scrollBtn.addEventListener('click',function(){var about=document.getElementById('about');if(about){var offset=getNavOffset?getNavOffset():80;window.scrollTo({top:about.getBoundingClientRect().top+window.pageYOffset-offset,behavior:'smooth'});}});}

// ── Nav scroll helper ──
var navEl=document.getElementById('nav');
var sectionIds=['hero','about','gallery','events','team','connect'];

function getNavOffset(){
  return navEl.getBoundingClientRect().height + 14 + 8;
}

// ── Smooth scroll — all internal links ──
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=this.getAttribute('href').slice(1);
    var target=document.getElementById(id);
    if(!target)return;
    e.preventDefault();
    var offset=getNavOffset();
    var top=target.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
    // close mobile menu
    if(typeof setMenuOpenState==='function') setMenuOpenState(false);
  });
});

// ── Nav shrink + active link on scroll ──
window.addEventListener('scroll',function(){
  navEl.classList.toggle('s',window.pageYOffset>60);
  var cur='hero';
  sectionIds.forEach(function(id){
    var el=document.getElementById(id);
    if(el && el.getBoundingClientRect().top <= 110) cur=id;
  });
  document.querySelectorAll('.nav-center a').forEach(function(a){
    a.classList.toggle('active', a.getAttribute('href')==='#'+cur);
  });
});

// ── Mobile menu toggle ──
function setMenuOpenState(isOpen){
  var menu=document.getElementById('mobileMenu');
  var btn=document.getElementById('hambBtn');
  menu.classList.toggle('open',isOpen);
  if(btn) btn.setAttribute('aria-expanded',isOpen?'true':'false');
  document.body.style.overflow=isOpen?'hidden':'';
}

window.addEventListener('DOMContentLoaded',function(){
  var btn=document.getElementById('hambBtn');
  if(btn) btn.setAttribute('aria-expanded','false');
});

function toggleMenu(){
  var menu=document.getElementById('mobileMenu');
  setMenuOpenState(!menu.classList.contains('open'));
}
// Close menu if clicked outside
document.addEventListener('click',function(e){
  var menu=document.getElementById('mobileMenu');
  var btn=document.getElementById('hambBtn');
  if(menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)){
    setMenuOpenState(false);
  }
});

window.addEventListener('resize',function(){
  if(window.innerWidth>960){
    setMenuOpenState(false);
  }
});

// ── Gallery tabs ──
document.querySelectorAll('.g-tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.g-tab').forEach(function(t){t.classList.remove('active');});
    document.querySelectorAll('.g-group').forEach(function(g){g.classList.remove('active');});
    this.classList.add('active');
    var activeGroup=document.getElementById('tab-'+this.dataset.tab);
    activeGroup.classList.add('active');
    activeGroup.querySelectorAll('.reveal').forEach(function(el){revealObs.observe(el);});
  });
});

// ── Film cards: make whole card clickable ──
document.querySelectorAll('.film-card').forEach(function(card){
  var link=card.querySelector('.film-play');
  if(!link) return;
  card.setAttribute('role','link');
  card.setAttribute('tabindex','0');
  card.addEventListener('click',function(e){
    if(e.target.closest('.film-play')) return;
    window.open(link.href,'_blank','noopener,noreferrer');
  });
  card.addEventListener('keydown',function(e){
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      window.open(link.href,'_blank','noopener,noreferrer');
    }
  });
});

// ── All Members Modal ──
window.addEventListener('DOMContentLoaded', function() {
  function bindModal(openId, modalId, closeId) {
    var openBtn = document.getElementById(openId);
    var modal = document.getElementById(modalId);
    var closeBtn = document.getElementById(closeId);
    if (!openBtn || !modal || !closeBtn) return;

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
        closeModal();
      }
    });
  }

  bindModal('viewAllMembersBtn', 'allMembersModal', 'closeAllMembersModal');
  bindModal('wingNoteOpen', 'wingNoteModal', 'wingNoteClose');
  bindModal('viewTeacherInChargeBtn', 'teacherInChargeModal', 'closeTeacherInChargeModal');
});


// ── Scroll reveal ──
var revealObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('v');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.08});

document.querySelectorAll('#tab-films .film-card').forEach(function(card,i){
  card.classList.add('reveal');
  card.style.transitionDelay=(120 + i*70)+'ms';
});

document.querySelectorAll('.team-section .tmcard').forEach(function(card,i){
  card.classList.add('reveal');
  card.style.transitionDelay=((i%3)*90)+'ms';
});

document.querySelectorAll('#tab-events-cov .cov-card').forEach(function(card,i){
  card.classList.add('reveal');
  card.style.transitionDelay=(120 + i*70)+'ms';
});

document.querySelectorAll('.reveal').forEach(function(el){revealObs.observe(el);});
