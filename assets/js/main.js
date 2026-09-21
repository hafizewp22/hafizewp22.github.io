/*==================== I18N ====================*/
let _t = {};
let _lang = 'en';
const _dataCache = {};

function t(key, fallback) {
    return _t[key] !== undefined ? _t[key] : (fallback !== undefined ? fallback : key);
}

// Pick the right language string from a bilingual field {en,id} or a plain string
function loc(field) {
    if (field && typeof field === 'object' && !Array.isArray(field)) {
        return field[_lang] || field.en || '';
    }
    return field || '';
}

function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const v = _t[el.dataset.i18n];
        if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const v = _t[el.dataset.i18nHtml];
        if (v !== undefined) el.innerHTML = v;
    });
}

async function setLang(lang) {
    if (!['en', 'id'].includes(lang)) lang = 'en';
    try {
        const r = await fetch(`assets/data/json/i18n/${lang}.json`);
        _t = await r.json();
    } catch(e) { _t = {}; }
    _lang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'en' ? 'ID' : 'EN';
    applyStaticTranslations();
    // Re-render all JS-driven sections with cached data
    if (_dataCache.experience)    renderExperience(_dataCache.experience);
    if (_dataCache.skills)        renderSkills(_dataCache.skills);
    if (_dataCache.capabilities)  renderCapabilities(_dataCache.capabilities);
    if (_dataCache.projects)      renderProjects(_dataCache.projects);
    if (_dataCache.competitions)  renderCompetitions(_dataCache.competitions);
    if (_dataCache.research)      renderResearch(_dataCache.research);
    if (_dataCache.qualification) renderQualification(_dataCache.qualification);
    if (_dataCache.strava)        renderStrava(_dataCache.strava);
    if (_dataCache.sports)        renderSports(_dataCache.sports);
    if (_dataCache.github)        renderGitHub(_dataCache.github);
    if (_dataCache.hackerrank)    renderHackerRank(_dataCache.hackerrank);
}

async function initI18n() {
    const browserLang = navigator.language.startsWith('id') ? 'id' : 'en';
    const saved = localStorage.getItem('lang') || browserLang;
    await setLang(saved);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
        setLang(_lang === 'en' ? 'id' : 'en');
    });
});

/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MOBILE MENU SHOW/HIDE WITH BACKDROP =====*/
let navBackdrop;
function ensureBackdrop(){
    if(!navBackdrop){
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav_backdrop';
        document.body.appendChild(navBackdrop);
        navBackdrop.addEventListener('click', hideMenu);
    }
}
function showMenu(){
    ensureBackdrop();
    navMenu.classList.add('show-menu');
    navBackdrop.classList.add('visible');
    document.body.classList.add('no-scroll');
}
function hideMenu(){
    navMenu.classList.remove('show-menu');
    if(navBackdrop) navBackdrop.classList.remove('visible');
    document.body.classList.remove('no-scroll');
}
if(navToggle){ navToggle.addEventListener('click', showMenu); }
if(navClose){ navClose.addEventListener('click', hideMenu); }
document.addEventListener('keydown', e => { if(e.key === 'Escape') hideMenu(); });

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav_link')

function linkAction(){ hideMenu(); }
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills_content'),
      skillHeader = document.querySelectorAll('.skills_header')

function toggleSkills(){
    let itemClass = this.parentNode.className

    for(i = 0; i < skillsContent.length; i++){
        skillsContent[i].className = 'skills_content skills_close'
    }
    if (itemClass === 'skills_content skills_close') {
        this.parentNode.className = 'skills_content skills_open'
    }
}

skillHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})


/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent =>{
            tabContent.classList.remove('qualification_active')
        })
        target.classList.add('qualification_active')

        tabs.forEach(tab =>{
            tab.classList.remove('qualification_active')
        })
        tab.classList.add('qualification_active')
    })
})

/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services_modal'),
      modalBtns = document.querySelectorAll('.services_button'),
      modalCloses = document.querySelectorAll('.services_modal-close')

let modal = function(modalClick){
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) =>{
    modalBtn.addEventListener('click', () =>{
        modal(i)
    })
})

modalCloses.forEach((modalClose) =>{
    modalClose.addEventListener('click', () =>{
        modalViews.forEach((modalView) =>{
            modalView.classList.remove('active-modal')
        })
    })
})

/*==================== SWIPER INITIALIZATION (Deferred) ====================*/
function initSwipers(){
        // Portfolio (projects)
        document.querySelectorAll('.portfolio_container').forEach(el => {
                new Swiper(el, {
                        cssMode: true,
                        loop: true,
                        navigation: {
                            nextEl: el.querySelector('.swiper-button-next'),
                            prevEl: el.querySelector('.swiper-button-prev'),
                        },
                        pagination: {
                            el: el.querySelector('.swiper-pagination'),
                            clickable: true,
                        },
                });
        });
        // Certificate style containers (certification, competition, research, certificate events)
        document.querySelectorAll('.certificate_container').forEach(el => {
                new Swiper(el, {
                        cssMode: true,
                        loop: true,
                        navigation: {
                            nextEl: el.querySelector('.swiper-button-next'),
                            prevEl: el.querySelector('.swiper-button-prev'),
                        },
                        pagination: {
                            el: el.querySelector('.swiper-pagination'),
                            clickable: true,
                        },
                });
        });
        // Testimonial (if present)
        document.querySelectorAll('.testimonial_container').forEach(el => {
                new Swiper(el, {
                        loop: true,
                        grabCursor: true,
                        spaceBetween: 48,
                        pagination: {
                            el: el.querySelector('.swiper-pagination'),
                            clickable: true,
                            dynamicBullets: true,
                        },
                        breakpoints: { 568:{ slidesPerView: 2 } }
                });
        });
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')
        const link = document.querySelector('.nav_menu a[href*=' + sectionId + ']');
        if(!link) return; // Guard when link not found
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            link.classList.add('active-link')
        }else{
            link.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== REVEAL ON SCROLL (Modern) ====================*/
const revealEls = document.querySelectorAll('.reveal')
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('reveal-visible')
            revealObserver.unobserve(entry.target)
        }
    })
}, { threshold: 0.15 })
revealEls.forEach(el => revealObserver.observe(el))

/*==================== DYNAMIC DATA LOADING ====================*/
async function loadJSON(path){
    const res = await fetch(path);
    if(!res.ok) throw new Error('HTTP '+res.status+' while loading '+path);
    return res.json();
}

function renderExperience(data){
    const wrap = document.getElementById('experience-container');
    if(!wrap) return;
    // Group by company
    const grouped = data.reduce((acc, item) => {
        const key = item.company;
        if(!acc[key]) acc[key] = { company: item.company, location: item.location, logo: item.logo, roles: [] };
        acc[key].roles.push(item);
        return acc;
    }, {});
    const html = Object.values(grouped).map(group => {
        const rolesHTML = group.roles.map(r => {
            const summaryText = loc(r.summary);
            const bullets = summaryText.split(/\.\s+(?=[A-ZÀ-ɏ])/).filter(Boolean);
            const summaryHTML = bullets.length > 1
                ? `<ul class="exp_role_bullets">${bullets.map(b=>`<li>${b.replace(/\.$/,'')}</li>`).join('')}</ul>`
                : `<p class="exp_role_summary">${summaryText}</p>`;
            return `
            <div class="exp_role">
                <div class="exp_role_header">
                    <h3 class="exp_role_title">${r.role}</h3>
                    <span class="exp_role_period">${r.start} – ${r.end}</span>
                </div>
                ${summaryHTML}
                <div class="exp_tags">${(r.technologies||[]).map(t=>`<span class="exp_tag">${t}</span>`).join('')}</div>
            </div>`;
        }).join('');
        const initials = group.company.replace(/^PT\.\s*/i,'').trim().split(/\s+/).filter(w=>/^[a-zA-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase();
        const logoHTML = group.logo
            ? `<img src="${group.logo}" alt="${group.company} logo" class="exp_company_logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/><div class="exp_company_logo exp_company_logo_fallback" style="display:none">${initials}</div>`
            : `<div class="exp_company_logo exp_company_logo_fallback">${initials}</div>`;
        return `
        <div class="exp_company_block reveal">
            <div class="exp_company_header">
                ${logoHTML}
                <div class="exp_company_meta">
                    <h2 class="exp_company_name">${group.company}</h2>
                    <span class="exp_company_location">${group.location}</span>
                </div>
            </div>
            <div class="exp_role_list">
                ${rolesHTML}
            </div>
        </div>`;
    }).join('');
    wrap.innerHTML = html;
}

async function initDynamicSections(){
    await initI18n();
    const tasks = [
        { path: 'assets/data/json/career/experience.json',      render: renderExperience,    selector: '#experience-container',   name: 'experience'     },
        { path: 'assets/data/json/about/skills.json',           render: renderSkills,         selector: '#skills-cards',           name: 'skills'         },
        { path: 'assets/data/json/about/capabilities.json',     render: renderCapabilities,   selector: '#capabilities-grid',      name: 'capabilities'   },
        { path: 'assets/data/json/portfolio/projects.json',     render: renderProjects,       selector: '#projects-wrapper',       name: 'projects'       },
        { path: 'assets/data/json/achievements/certifications.json', render: renderCertifications, selector: '#certifications-wrapper', name: 'certifications' },
        { path: 'assets/data/json/achievements/competitions.json',   render: renderCompetitions,   selector: '#competitions-wrapper',   name: 'competitions'   },
        { path: 'assets/data/json/portfolio/research.json',     render: renderResearch,       selector: '#research-wrapper',       name: 'research'       },
        { path: 'assets/data/json/achievements/events.json',    render: renderEvents,         selector: '#events-wrapper',         name: 'events'         },
        { path: 'assets/data/json/brands.json',                 render: renderBrands,         selector: '#brands-track',           name: 'brands'         },
        { path: 'assets/data/json/career/qualification.json',   render: renderQualification,  selector: '#education',              name: 'qualification'  },
        { path: 'assets/data/json/achievements/sports.json',    render: renderSports,         selector: '#running-wrapper',        name: 'sports'         },
        { path: 'assets/data/json/achievements/strava.json',    render: renderStrava,         selector: '#strava-stats',           name: 'strava'         },
        { path: 'assets/data/json/about/hackerrank.json',       render: renderHackerRank,     selector: '#hr-widget',              name: 'hackerrank'     },
        { path: 'https://api.github.com/users/hafizewp22',      render: renderGitHub,         selector: '#github-widget',          name: 'github'         }
    ];
    const results = await Promise.allSettled(tasks.map(task => loadJSON(task.path)));
    let anySuccess = false;
    const loaded = {}; // store successful datasets for stats aggregation
    results.forEach((res, i) => {
        const task = tasks[i];
        if (res.status === 'fulfilled') {
            loaded[task.name] = res.value;
            _dataCache[task.name] = res.value;
            try { task.render(res.value); anySuccess = true; } catch(renderErr){
                console.error('Render error for '+task.name, renderErr);
                setFallback(task.selector, 'Render error');
            }
        } else {
            console.warn('Failed to load '+task.name+':', res.reason.message || res.reason);
            setFallback(task.selector, 'Failed to load '+task.name);
        }
    });
    updateStats(loaded);
    // Observe reveal elements added (only if any success to avoid redundant work)
    if(anySuccess){
        document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
        initSwipers();
    }
}

document.addEventListener('DOMContentLoaded', initDynamicSections);

/*==================== MOBILE SUBMENU TOGGLE ====================*/
function initSubMenus(){
    const toggles = document.querySelectorAll('.nav_sub_toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.nav_has_sub');
            if(!parent) return;
            // Close any other open submenu
            document.querySelectorAll('.nav_has_sub.open').forEach(other => {
                if(other !== parent){
                    other.classList.remove('open');
                    const t = other.querySelector('.nav_sub_toggle');
                    if(t) t.setAttribute('aria-expanded','false');
                }
            });
            const isOpen = parent.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            // Prevent navigating when used as toggle
            if(isOpen) {
                event.preventDefault();
            }
        });
    });
    // When menu hides, collapse submenus
    const origHide = hideMenu;
    window.hideMenu = function(){
        document.querySelectorAll('.nav_has_sub.open').forEach(el => {
            el.classList.remove('open');
            const t = el.querySelector('.nav_sub_toggle');
            if(t) t.setAttribute('aria-expanded','false');
        });
        origHide();
    }
}
document.addEventListener('DOMContentLoaded', initSubMenus);

/*==================== CONTACT COPY BUTTONS ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-copy-btn]');
    function fallbackCopy(text){
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position='fixed';
        ta.style.top='-1000px';
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); }catch(e){ return false; } finally { document.body.removeChild(ta); }
        return true;
    }
    async function copyText(text){
        if(navigator.clipboard && window.isSecureContext){
            try{ await navigator.clipboard.writeText(text); return true; }catch(e){ /* fall through */ }
        }
        return fallbackCopy(text);
    }
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.contact_card');
            if(!parent) return;
            const valueEl = parent.querySelector('[data-copy]');
            if(!valueEl) return;
            const text = valueEl.getAttribute('data-copy');
            copyText(text).then(success => {
                if(success){
                    const old = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    btn.disabled = true;
                    setTimeout(()=>{btn.textContent = old;btn.classList.remove('copied');btn.disabled=false;},1400);
                } else {
                    btn.textContent = 'Failed';
                    btn.classList.add('failed');
                    setTimeout(()=>{btn.textContent = 'Copy';btn.classList.remove('failed');},1600);
                }
            });
        });
    });
});

/*==================== RENDER HELPERS FOR NEW JSON SECTIONS ====================*/
function setFallback(selector, message){
    const el = document.querySelector(selector);
    if(el) el.innerHTML = `<div class="fallback">${message}</div>`;
}

function renderSkills(data){
    const wrap = document.getElementById('skills-cards');
    if(!wrap) return;
    wrap.innerHTML = data.map(cat => `
        <div class="skill_card reveal">
            <i class="${cat.iconClass} skill_icon"></i>
            <h3 class="skill_title">${loc(cat.title)}</h3>
            <ul class="skill_list">
                ${cat.items.map(it=>`<li><span>${it.name}</span></li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderCapabilities(data){
    const wrap = document.getElementById('capabilities-grid');
    if(!wrap) return;
    wrap.innerHTML = data.map(item => `
        <div class="capability_card reveal">
            <i class="${item.iconClass} capability_icon"></i>
            <h3 class="capability_title">${loc(item.title)}</h3>
            <p class="capability_desc">${loc(item.description)}</p>
        </div>
    `).join('');
}

function renderProjects(data){
    const wrap = document.getElementById('projects-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(p => {
        const techHTML = (p.technologies||[]).map(t=>`<span class="proj_tag">${t}</span>`).join('');
        const contribHTML = p.contributors?.length ? `<p class="proj_contributors"><i class="uil uil-users-alt"></i> ${p.contributors.join(' · ')}</p>` : '';
        const assocHTML = p.association ? `<span class="proj_assoc"><i class="uil uil-university"></i> ${p.association}</span>` : '';
        const platformLinks = [];
        if(p.github)  platformLinks.push(`<a href="${p.github}"  target="_blank" class="proj_link proj_link--github"><i class="uil uil-github-alt"></i> GitHub</a>`);
        if(p.gitlab)  platformLinks.push(`<a href="${p.gitlab}"  target="_blank" class="proj_link proj_link--gitlab"><i class="uil uil-gitlab"></i> GitLab</a>`);
        if(p.figma)   platformLinks.push(`<a href="${p.figma}"   target="_blank" class="proj_link proj_link--figma"><i class="uil uil-vector-square"></i> Figma</a>`);
        if(p.link){
            const lbl = p.linkLabel || 'Demo';
            const ico = lbl.toLowerCase().includes('demo') ? 'uil-play-circle' : 'uil-external-link-alt';
            platformLinks.push(`<a href="${p.link}" target="_blank" class="proj_link proj_link--demo"><i class="uil ${ico}"></i> ${lbl}</a>`);
        }
        const linksHTML = platformLinks.join('');
        return `
        <div class="proj_card swiper-slide reveal">
            <div class="proj_img_wrap">
                <img src="${p.image}" alt="${p.title}" class="proj_img" loading="lazy" onerror="this.src='assets/img/project.png'"/>
                ${p.period ? `<span class="proj_period">${p.period}</span>` : ''}
            </div>
            <div class="proj_body">
                <h3 class="proj_title">${p.title}</h3>
                <p class="proj_desc">${loc(p.description)}</p>
                ${techHTML ? `<div class="proj_tags">${techHTML}</div>` : ''}
                ${contribHTML}
                ${assocHTML}
                <div class="proj_links">${linksHTML}</div>
            </div>
        </div>`;
    }).join('');
}

function renderCertifications(data){
    const wrap = document.getElementById('certifications-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(c => `
        <div class="certificate_content grid swiper-slide reveal">
            <div class="card_media"><img src="${c.image}" alt="${c.title}" class="portfolio_img" /></div>
            <div class="certificate_data">
                <h3 class="certificate_title">${c.title}</h3>
                <p class="certificate_description">${c.provider}</p>
                ${c.link ? `<a href="${c.link}" target="_blank" class="button button--flex button--small certificate_button">View<i class="uil uil-arrow-right button_icon"></i></a>` : ''}
            </div>
        </div>
    `).join('');
}

function renderCompetitions(data){
    const wrap = document.getElementById('competitions-wrapper');
    if(!wrap) return;
    const rankIcon = desc => {
        const d = loc(desc).toLowerCase();
        if(d.includes('1st')||d.includes('first')||d.includes('gold')) return {icon:'uil-trophy',cls:'award--gold',label:t('competition.rank1','1st Place')};
        if(d.includes('2nd')||d.includes('second')||d.includes('silver')) return {icon:'uil-trophy',cls:'award--silver',label:t('competition.rank2','2nd Place')};
        if(d.includes('3rd')||d.includes('third')||d.includes('bronze')) return {icon:'uil-medal',cls:'award--bronze',label:t('competition.rank3','3rd Place')};
        return {icon:'uil-award',cls:'award--participant',label:t('competition.participant','Participant')};
    };
    wrap.innerHTML = data.map(c => {
        const rank = rankIcon(c.description);
        return `
        <div class="award_card reveal">
            <div class="award_img_wrap">
                <img src="${c.image}" alt="${c.title}" class="award_img" loading="lazy"/>
                <div class="award_badge ${rank.cls}"><i class="uil ${rank.icon}"></i> ${rank.label}</div>
            </div>
            <div class="award_body">
                <h3 class="award_title">${c.title}</h3>
                <p class="award_desc">${loc(c.description)}</p>
                ${c.link ? `<a href="${c.link}" target="_blank" class="award_link"><i class="uil uil-external-link-alt"></i> ${t('competition.viewCert','View Certificate')}</a>` : ''}
            </div>
        </div>`;
    }).join('');
}

function renderResearch(data){
    const wrap = document.getElementById('research-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(r => {
        const authorsHTML = r.authors?.length
            ? `<div class="research_authors"><i class="uil uil-users-alt"></i> ${r.authors.join(' · ')}</div>`
            : '';
        const publisherHTML = r.publisher
            ? `<span class="research_publisher"><i class="uil uil-university"></i> ${r.publisher}</span>`
            : '';
        return `
        <div class="research_paper reveal">
            <div class="research_paper_thumb">
                <img src="${r.image}" alt="${r.title}" loading="lazy"/>
            </div>
            <div class="research_paper_body">
                <div class="research_paper_meta">
                    <span class="research_tag"><i class="uil uil-book-open"></i> ${t('research.tag','Research Paper')}</span>
                    ${r.year ? `<span class="research_year">${r.year}</span>` : ''}
                    ${publisherHTML}
                </div>
                <h3 class="research_paper_title">${r.title}</h3>
                <p class="research_paper_desc">${loc(r.description)}</p>
                ${authorsHTML}
                ${r.link ? `<a href="${r.link}" target="_blank" class="research_link">${t('research.readMore','Read Full Paper')} <i class="uil uil-arrow-right"></i></a>` : ''}
            </div>
        </div>`;
    }).join('');
}

function renderEvents(data){
    const wrap = document.getElementById('events-wrapper');
    if(!wrap) return;
    const categoryOrder = ['Training', 'Certification', 'Academic', 'Online Course'];
    const categoryIcon  = { Training: 'uil-award', Certification: 'uil-medal', Academic: 'uil-graduation-cap', 'Online Course': 'uil-play-circle' };
    const groups = {};
    data.forEach(e => {
        const cat = e.category || 'Other';
        if(!groups[cat]) groups[cat] = [];
        groups[cat].push(e);
    });
    const certCard = e => `
        <div class="cert_item reveal" role="button" tabindex="0"
             data-img="${e.image}" data-caption="${e.title}"
             onclick="openLightbox(this)" onkeydown="if(event.key==='Enter')openLightbox(this)">
            <div class="cert_img_wrap">
                <img src="${e.image}" alt="${e.title}" class="cert_img" loading="lazy"/>
                <div class="cert_overlay">
                    <span class="cert_zoom_icon"><i class="uil uil-search-plus"></i></span>
                    <p class="cert_overlay_desc">${e.description}</p>
                </div>
            </div>
            <div class="cert_info"><h4 class="cert_title">${e.title}</h4></div>
        </div>`;
    const orderedCats = [...categoryOrder.filter(c => groups[c]), ...Object.keys(groups).filter(c => !categoryOrder.includes(c))];
    wrap.innerHTML = orderedCats.map(cat => `
        <div class="cert_group">
            <div class="cert_group_header">
                <i class="uil ${categoryIcon[cat] || 'uil-folder'} cert_group_icon"></i>
                <h3 class="cert_group_title">${cat}</h3>
                <span class="cert_group_count">${groups[cat].length}</span>
            </div>
            <div class="certs_grid_inner">${groups[cat].map(certCard).join('')}</div>
        </div>
    `).join('');
}

function renderQualification(data){
    const tabMap = { education: 'education', organization: 'work', volunteering: 'volunteering' };
    Object.entries(tabMap).forEach(([key, id]) => {
        const wrap = document.getElementById(id);
        if(!wrap) return;
        const items = data[key] || [];
        wrap.innerHTML = items.map((item, idx) => {
            const isRight = idx % 2 === 1;
            const isLast  = idx === items.length - 1;
            const detailsHTML = (item.details || []).map(d =>
                `<div class="qual_detail"><i class="uil ${d.icon}"></i> ${loc(d.text)}</div>`
            ).join('');
            const contentBlock = `
                <h3 class="qualification_title">${item.title}</h3>
                <span class="qualification_subtitle">${item.subtitle}</span>
                <div class="qualification_calender"><i class="uil uil-calendar-alt"></i> ${item.period}</div>
                ${detailsHTML}`;
            const rounderBlock = `<span class="qualification_rounder"></span>${isLast ? '' : '<span class="qualification_line"></span>'}`;
            return isRight
                ? `<div class="qualification_data"><div></div><div>${rounderBlock}</div><div>${contentBlock}</div></div>`
                : `<div class="qualification_data"><div>${contentBlock}</div><div>${rounderBlock}</div></div>`;
        }).join('');
    });
}

function openLightbox(el){
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = el.dataset.img;
    document.getElementById('lightbox-caption').textContent = el.dataset.caption;
    lb.classList.add('lightbox--open');
    document.body.classList.add('no-scroll');
}
function closeLightbox(){
    document.getElementById('lightbox').classList.remove('lightbox--open');
    document.body.classList.remove('no-scroll');
}
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-backdrop')?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeLightbox(); });
});

function renderBrands(data){
    const track = document.getElementById('brands-track');
    if(!track) return;
    // Build one sequence then duplicate for smooth infinite scroll
    const sequence = data.map(b => `<div class=\"brands_item\"><img src=\"${b.logo}\" alt=\"${b.alt || b.name}\" /></div>`).join('');
    track.innerHTML = sequence + sequence; // duplicate
}

/*==================== SPORTS / RUNNING ====================*/
const GH_LANG_COLORS = {
    JavaScript:'#f1e05a', TypeScript:'#3178c6', Go:'#00ADD8', PHP:'#4F5D95',
    Python:'#3572A5', HTML:'#e34c26', CSS:'#563d7c', Vue:'#41b883',
    Kotlin:'#A97BFF', Java:'#b07219', 'C++':'#f34b7d', C:'#555555',
    Shell:'#89e051', Dockerfile:'#384d54'
};

async function renderGitHub(data){
    const wrap = document.getElementById('github-widget');
    if(!wrap) return;
    const joined = new Date(data.created_at).getFullYear();
    wrap.innerHTML = `
        <div class="gh_header">
            <div class="gh_brand">
                <img src="https://cdn.simpleicons.org/github/ffffff" class="gh_logo" width="22" height="22" alt="GitHub"
                     onerror="this.style.display='none'"/>
                <span class="gh_brand_name">GitHub</span>
            </div>
            <div class="gh_header_meta">
                <span class="gh_username">@${data.login}</span>
                ${data.bio ? `<span class="gh_dot">·</span><span class="gh_bio">${data.bio}</span>` : ''}
            </div>
            <a class="gh_profile_link" href="${data.html_url}" target="_blank" rel="noopener">
                ${t('gh.viewProfile','View Profile')} <i class="uil uil-external-link-alt"></i>
            </a>
        </div>
        <div class="gh_body">
            <div class="gh_stat">
                <span class="gh_stat_val">${data.public_repos}</span>
                <span class="gh_stat_key">${t('gh.repositories','Repositories')}</span>
            </div>
            <div class="gh_stat_divider"></div>
            <div class="gh_stat">
                <span class="gh_stat_val">${data.followers}</span>
                <span class="gh_stat_key">${t('gh.followers','Followers')}</span>
            </div>
            <div class="gh_stat_divider"></div>
            <div class="gh_stat">
                <span class="gh_stat_val">${data.following}</span>
                <span class="gh_stat_key">${t('gh.following','Following')}</span>
            </div>
            <div class="gh_stat_divider"></div>
            <div class="gh_stat">
                <span class="gh_stat_val">${joined}</span>
                <span class="gh_stat_key">${t('gh.joined','Joined')}</span>
            </div>
        </div>
        <div class="gh_repos" id="gh-repos-list">
            <span class="gh_repos_loading">${t('gh.loading','Loading repositories…')}</span>
        </div>
    `;
    try {
        const res = await fetch('https://api.github.com/users/hafizewp22/repos?sort=updated&per_page=6&type=owner');
        const repos = await res.json();
        document.getElementById('gh-repos-list').innerHTML = repos
            .filter(r => !r.fork)
            .slice(0, 6)
            .map(r => {
                const langDot = r.language
                    ? `<span class="gh_lang_dot" style="background:${GH_LANG_COLORS[r.language]||'#ccc'}"></span>${r.language}`
                    : '';
                const stars = r.stargazers_count ? `<span class="gh_repo_stat"><i class="uil uil-star"></i> ${r.stargazers_count}</span>` : '';
                const forks = r.forks_count     ? `<span class="gh_repo_stat"><i class="uil uil-code-branch"></i> ${r.forks_count}</span>` : '';
                return `
                <a class="gh_repo_card" href="${r.html_url}" target="_blank" rel="noopener">
                    <div class="gh_repo_name"><i class="uil uil-book-alt"></i> ${r.name}</div>
                    ${r.description ? `<p class="gh_repo_desc">${r.description}</p>` : ''}
                    <div class="gh_repo_meta">
                        ${langDot ? `<span class="gh_repo_lang">${langDot}</span>` : ''}
                        ${stars}${forks}
                    </div>
                </a>`;
            }).join('');
    } catch(e){
        document.getElementById('gh-repos-list').innerHTML = '';
    }
}

function renderHackerRank(data){
    const wrap = document.getElementById('hr-widget');
    if(!wrap) return;
    const levelColor = { Basic: '#00BFA5', Intermediate: '#F9A825', Advanced: '#E53935' };
    const badgesHTML = data.badges.map(b => `
        <div class="hr_badge">
            <i class="uil ${b.icon} hr_badge_icon"></i>
            <span>${b.name}</span>
        </div>`).join('');
    const certsHTML = data.certifications.map(c => `
        <span class="hr_cert" style="--cert-color:${levelColor[c.level] || '#00BFA5'}">
            ${c.name} <em>${c.level}</em>
        </span>`).join('');
    wrap.innerHTML = `
        <div class="hr_header">
            <div class="hr_brand">
                <img src="https://cdn.simpleicons.org/hackerrank/ffffff" class="hr_logo" width="26" height="26" alt="HackerRank"
                     onerror="this.style.display='none'"/>
                <span class="hr_brand_name">HackerRank</span>
            </div>
            <div class="hr_header_meta">
                <span class="hr_username">@${data.username}</span>
                <span class="hr_dot">·</span>
                <span class="hr_title">${data.title}</span>
            </div>
            <a class="hr_profile_link" href="${data.profileUrl}" target="_blank" rel="noopener">
                ${t('hr.viewProfile','View Profile')} <i class="uil uil-external-link-alt"></i>
            </a>
        </div>
        <div class="hr_body">
            <div class="hr_section">
                <h4 class="hr_section_label"><i class="uil uil-award"></i> ${t('hr.badges','Badges')}</h4>
                <div class="hr_badges">${badgesHTML}</div>
            </div>
            <div class="hr_section">
                <h4 class="hr_section_label"><i class="uil uil-medal"></i> ${t('hr.certifications','Certifications')} <span class="hr_cert_count">${data.certifications.length} ${t('hr.verified','Verified')}</span></h4>
                <div class="hr_certs">${certsHTML}</div>
            </div>
        </div>
    `;
}

function renderStrava(data){
    const wrap = document.getElementById('strava-stats');
    if(!wrap) return;
    const all    = data.all_run_totals    || {};
    const ytd    = data.ytd_run_totals    || {};
    const recent = data.recent_run_totals || {};
    const km  = m => (m / 1000).toFixed(1);
    if(!all.count){ wrap.closest('.strava_widget')?.classList.add('strava_widget--loading'); return; }
    wrap.innerHTML = `
        <div class="strava_stat_card">
            <span class="strava_stat_val">${all.count}</span>
            <span class="strava_stat_key">${t('strava.totalRuns','Total Runs')}</span>
        </div>
        <div class="strava_stat_card">
            <span class="strava_stat_val">${km(all.distance)} <small>km</small></span>
            <span class="strava_stat_key">${t('strava.totalDistance','Total Distance')}</span>
        </div>
        <div class="strava_stat_card">
            <span class="strava_stat_val">${Math.round(all.elevation_gain)} <small>m</small></span>
            <span class="strava_stat_key">${t('strava.totalElevation','Total Elevation')}</span>
        </div>
        <div class="strava_stat_card strava_stat_card--accent">
            <span class="strava_stat_val">${ytd.count}</span>
            <span class="strava_stat_key">${t('strava.runsYear','Runs This Year')}</span>
        </div>
        <div class="strava_stat_card strava_stat_card--accent">
            <span class="strava_stat_val">${km(ytd.distance)} <small>km</small></span>
            <span class="strava_stat_key">${t('strava.distanceYear','Distance This Year')}</span>
        </div>
        <div class="strava_stat_card strava_stat_card--accent">
            <span class="strava_stat_val">${recent.count}</span>
            <span class="strava_stat_key">${t('strava.runsRecent','Runs (4 Weeks)')}</span>
        </div>
    `;
}

function renderSports(data){
    const wrap = document.getElementById('running-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(r => {
        const color      = r.color      || 'var(--first-color)';
        const colorLight = r.colorLight || 'var(--first-color-lighter)';
        return `
        <div class="run_card reveal" style="--run-color:${color};--run-color-light:${colorLight}">
            <div class="run_header">
                <div>
                    <span class="run_category">${r.category}</span>
                    <h3 class="run_event">${r.event}</h3>
                    <span class="run_meta"><i class="uil uil-calendar-alt"></i> ${r.year} &nbsp;·&nbsp; <i class="uil uil-map-marker"></i> ${r.location}</span>
                </div>
                <div class="run_bib">#${r.bibNumber}</div>
            </div>
            <div class="run_time_wrap">
                <span class="run_time_label">${t('run.finishTime','Finish Time')}</span>
                <span class="run_time">${r.finishTime}</span>
                <span class="run_pace">${r.pace}</span>
            </div>
            <div class="run_stats">
                <div class="run_stat">
                    <span class="run_stat_val">${r.overallRank}</span>
                    <span class="run_stat_label">of ${r.overallTotal}</span>
                    <span class="run_stat_key">${t('run.overall','Overall')}</span>
                </div>
                <div class="run_stat_divider"></div>
                <div class="run_stat">
                    <span class="run_stat_val">${r.genderRank}</span>
                    <span class="run_stat_label">of ${r.genderTotal}</span>
                    <span class="run_stat_key">${t('run.gender','Gender')}</span>
                </div>
            </div>
            <div class="run_links">
                <button class="run_btn run_btn--cert" onclick="openPdfModal('${r.event}','${r.certificateUrl}')">
                    <i class="uil uil-file-alt"></i> ${t('run.certificate','Certificate')}
                </button>
                <a class="run_btn run_btn--result" href="${r.resultUrl}" target="_blank" rel="noopener">
                    <i class="uil uil-chart-bar"></i> ${t('run.results','Results')}
                </a>
            </div>
        </div>`;
    }).join('');
}

function openPdfModal(title, url){
    const modal = document.getElementById('pdf-modal');
    document.getElementById('pdf-modal-title').textContent = title;
    document.getElementById('pdf-modal-frame').src = url;
    document.getElementById('pdf-modal-link').href = url;
    document.getElementById('pdf-modal-fallback-link').href = url;
    modal.classList.add('pdf_modal--open');
    document.body.classList.add('no-scroll');
}
function closePdfModal(){
    const modal = document.getElementById('pdf-modal');
    modal.classList.remove('pdf_modal--open');
    document.getElementById('pdf-modal-frame').src = '';
    document.body.classList.remove('no-scroll');
}
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('pdf-modal-close')?.addEventListener('click', closePdfModal);
    document.getElementById('pdf-modal-backdrop')?.addEventListener('click', closePdfModal);
    document.addEventListener('keydown', e => { if(e.key==='Escape') closePdfModal(); });
});

/*==================== STATS UPDATE ====================*/
function updateStats(loaded){
    // NOTE: We removed the old stats section IDs (stat-*) from the HTML snapshot.
    // To keep About metrics working, compute counts regardless of presence of those elements.

    // Competitions (if about-competitions exists)
    const competitionsCount = loaded.competitions ? loaded.competitions.length + (loaded.competitions.length >= 2 ? '+' : '') : '?';
    const compEl = document.getElementById('stat-competitions');
    if(compEl) compEl.textContent = competitionsCount; // only if legacy element still present
    const aboutComp = document.getElementById('about-competitions');
    if(aboutComp) aboutComp.textContent = competitionsCount;

    // Projects
    const projectsCount = loaded.projects ? loaded.projects.length : '?';
    const projEl = document.getElementById('stat-projects');
    if(projEl) projEl.textContent = projectsCount;
    const aboutProj = document.getElementById('about-projects');
    if(aboutProj) aboutProj.textContent = projectsCount;

    // Companies (unique from experience excluding organization keywords)
    let companiesCount = '?';
    if(loaded.experience){
        const excludeKeywords = [/Bina Nusantara Computer Club/i, /University/i, /Club/i];
        const companies = new Set();
        loaded.experience.forEach(e => {
            const isExcluded = excludeKeywords.some(rx => rx.test(e.company));
            if(!isExcluded) companies.add(e.company);
        });
        companiesCount = companies.size;
    }
    const companyEl = document.getElementById('stat-companies');
    if(companyEl) companyEl.textContent = companiesCount;
    const aboutCompanies = document.getElementById('about-companies');
    if(aboutCompanies) aboutCompanies.textContent = companiesCount;
    // Database Focus: pick primary database from skills (Databases category first item)
    const dbEl = document.getElementById('stat-db-focus');
    if(dbEl){
        if(loaded.skills){
            const dbGroup = loaded.skills.find(g => /Database/i.test(g.title) || /Databases/i.test(g.title));
            if(dbGroup && dbGroup.items && dbGroup.items.length){
                const primary = dbGroup.items[0].name;
                const others = dbGroup.items.slice(1,4); // show up to 3 others
                dbEl.innerHTML = `
                  <div class="db-focus-wrapper">
                    <div class="db-focus-main">${primary}</div>
                    <div class="db-badges">${others.map(o=>`<span class="badge badge-db-secondary">${o.name}</span>`).join('')}</div>
                  </div>`;
            } else {
                dbEl.textContent = 'MySQL';
            }
        } else {
            dbEl.textContent = 'MySQL';
        }
    }
    // Certificate events count
    const certCountEl = document.getElementById('certificate-count');
    if(certCountEl){
        certCountEl.textContent = loaded.events ? loaded.events.length + ' events' : '0';
    }
}