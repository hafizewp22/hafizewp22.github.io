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
        const rolesHTML = group.roles.map(r => `
            <div class="exp_role">
                <div class="exp_role_header">
                    <h3 class="exp_role_title">${r.role}</h3>
                    <span class="exp_role_period">${r.start} – ${r.end}</span>
                </div>
                <p class="exp_role_summary">${r.summary}</p>
                <div class="exp_tags">${(r.technologies||[]).map(t=>`<span class="exp_tag">${t}</span>`).join('')}</div>
            </div>
        `).join('');
        return `
        <div class="exp_company_block reveal">
            <div class="exp_company_header">
                ${group.logo ? `<img src="${group.logo}" alt="${group.company} logo" class="exp_company_logo"/>` : ''}
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
    const tasks = [
        { path: 'assets/data/json/experience.json', render: renderExperience, selector: '#experience-container', name: 'experience' },
        { path: 'assets/data/json/skills.json', render: renderSkills, selector: '#skills-cards', name: 'skills' },
        { path: 'assets/data/json/capabilities.json', render: renderCapabilities, selector: '#capabilities-grid', name: 'capabilities' },
        { path: 'assets/data/json/projects.json', render: renderProjects, selector: '#projects-wrapper', name: 'projects' },
        { path: 'assets/data/json/certifications.json', render: renderCertifications, selector: '#certifications-wrapper', name: 'certifications' },
        { path: 'assets/data/json/competitions.json', render: renderCompetitions, selector: '#competitions-wrapper', name: 'competitions' },
        { path: 'assets/data/json/research.json', render: renderResearch, selector: '#research-wrapper', name: 'research' },
        { path: 'assets/data/json/events.json', render: renderEvents, selector: '#events-wrapper', name: 'events' },
        { path: 'assets/data/json/brands.json', render: renderBrands, selector: '#brands-track', name: 'brands' }
    ];
    const results = await Promise.allSettled(tasks.map(t => loadJSON(t.path)));
    let anySuccess = false;
    const loaded = {}; // store successful datasets for stats aggregation
    results.forEach((res, i) => {
        const t = tasks[i];
        if (res.status === 'fulfilled') {
            loaded[t.name] = res.value;
            try { t.render(res.value); anySuccess = true; } catch(renderErr){
                console.error('Render error for '+t.name, renderErr);
                setFallback(t.selector, 'Render error');
            }
        } else {
            console.warn('Failed to load '+t.name+':', res.reason.message || res.reason);
            setFallback(t.selector, 'Failed to load '+t.name);
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
            <h3 class="skill_title">${cat.title}</h3>
            <ul class="skill_list">
                ${cat.items.map(it=>`<li>${it.name} (${it.level})</li>`).join('')}
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
            <h3 class="capability_title">${item.title}</h3>
            <p class="capability_desc">${item.description}</p>
        </div>
    `).join('');
}

function renderProjects(data){
    const wrap = document.getElementById('projects-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(p => `
        <div class="portfolio_content project_card grid swiper-slide reveal">
            <div class="card_media"><img src="${p.image}" alt="${p.title}" class="portfolio_img" /></div>
            <div class="portfolio_data">
                <span class="card_tag tag-project">Project</span>
                <h3 class="portfolio_title">${p.title}</h3>
                <p class="portfolio_description">${p.description}</p>
                ${p.link ? `<a href="${p.link}" target="_blank" class="button button--flex button--small portfolio_button">${p.linkLabel || 'View'}<i class="uil uil-arrow-right button_icon"></i></a>` : ''}
            </div>
        </div>
    `).join('');
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
    wrap.innerHTML = data.map(c => `
        <div class="certificate_content competition_card grid swiper-slide reveal">
            <div class="card_media"><img src="${c.image}" alt="${c.title}" class="portfolio_img" /></div>
            <div class="certificate_data">
                <span class="card_tag tag-competition">Competition</span>
                <h3 class="certificate_title">${c.title}</h3>
                <p class="certificate_description">${c.description}</p>
                ${c.link ? `<a href="${c.link}" target="_blank" class="button button--flex button--small certificate_button">View<i class="uil uil-arrow-right button_icon"></i></a>` : ''}
            </div>
        </div>
    `).join('');
}

function renderResearch(data){
    const wrap = document.getElementById('research-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(r => `
        <div class="certificate_content research_card grid swiper-slide reveal">
            <div class="card_media"><img src="${r.image}" alt="${r.title}" class="portfolio_img" /></div>
            <div class="certificate_data">
                <span class="card_tag tag-research">Research</span>
                <h3 class="certificate_title">${r.title}</h3>
                <p class="certificate_description">${r.year || ''}</p>
                ${r.link ? `<a href="${r.link}" target="_blank" class="button button--flex button--small certificate_button">View<i class="uil uil-arrow-right button_icon"></i></a>` : ''}
            </div>
        </div>
    `).join('');
}

function renderEvents(data){
    const wrap = document.getElementById('events-wrapper');
    if(!wrap) return;
    wrap.innerHTML = data.map(e => `
        <div class="certificate_content events_card grid swiper-slide reveal">
            <div class="card_media"><img src="${e.image}" alt="${e.title}" class="portfolio_img" /></div>
            <div class="certificate_data">
                <span class="card_tag tag-event">Event</span>
                <h3 class="certificate_title">${e.title}</h3>
                <p class="certificate_description">${e.description}</p>
            </div>
        </div>
    `).join('');
}

function renderBrands(data){
    const track = document.getElementById('brands-track');
    if(!track) return;
    // Build one sequence then duplicate for smooth infinite scroll
    const sequence = data.map(b => `<div class=\"brands_item\"><img src=\"${b.logo}\" alt=\"${b.alt || b.name}\" /></div>`).join('');
    track.innerHTML = sequence + sequence; // duplicate
}

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