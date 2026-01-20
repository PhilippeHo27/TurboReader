// COLORS (Tailwind Palette)
const colors = {
    Slate: ["f8fafc", "f1f5f9", "e2e8f0", "cbd5e1", "94a3b8", "64748b", "475569", "334155", "1e293b", "0f172a", "020617"],
    Gray: ["f9fafb", "f3f4f6", "e5e7eb", "d1d5db", "9ca3af", "6b7280", "4b5563", "374151", "1f2937", "111827", "030712"],
    Stone: ["fafaf9", "f5f5f4", "e7e5e4", "d6d3d1", "a8a29e", "78716c", "57534e", "44403c", "292524", "1c1917", "0c0a09"],
    Red: ["fef2f2", "fee2e2", "fecaca", "fca5a5", "f87171", "ef4444", "dc2626", "b91c1c", "991b1b", "7f1d1d", "450a0a"],
    Orange: ["fff7ed", "ffedd5", "fed7aa", "fdb274", "fb923c", "f97316", "ea580c", "c2410c", "9a3412", "7c2d12", "431407"],
    Amber: ["fffbeb", "fef3c7", "fde68a", "fcd34d", "fbbf24", "f59e0b", "d97706", "b45309", "92400e", "78350f", "451a03"],
    Yellow: ["fefce8", "fef9c3", "fef08a", "fde047", "facc15", "eab308", "ca8a04", "a16207", "854d0e", "713f12", "422006"],
    Lime: ["f7fee7", "ecfccb", "d9f99d", "bef264", "a3e635", "84cc16", "65a30d", "4d7c0f", "3f6212", "365314", "1a2e05"],
    Emerald: ["ecfdf5", "d1fae5", "a7f3d0", "6ee7b7", "34d399", "10b981", "059669", "047857", "065f46", "064e3b", "022c22"],
    Cyan: ["ecfeff", "cffafe", "a5f3fc", "67e8f9", "22d3ee", "06b6d3", "0891b2", "0e7490", "155e75", "164e63", "083344"],
    Sky: ["f0f9ff", "e0f2fe", "bae6fd", "7dd3fc", "38bdf8", "0ea5e9", "0284c7", "0369a1", "075985", "0c4a6e", "082f49"],
    Blue: ["eff6ff", "dbeafe", "bfdbfe", "93c5fd", "60a5fa", "3b82f6", "2563eb", "1d4ed8", "1e40af", "1e3a8a", "172554"],
    Violet: ["f5f3ff", "ede9fe", "ddd6fe", "c4b5fd", "a78bfa", "8b5cf6", "7c3aed", "6d28d9", "5b21b6", "4c1d95", "2e1065"],
    Pink: ["fdf2f8", "fce7f3", "fbcfe8", "f9a8d4", "f472b6", "ec4899", "db2777", "be185d", "9d174d", "831843", "500724"]
};

// COMPONENT REGISTRY
const ComponentRegistry = {
    Button: {
        template: (p = {}) => `<button class="neo-brutalist w-full text-lg font-black py-4 px-8 uppercase tracking-tight ${p.noAnim ? 'no-anim' : 'hover:scale-105 active:scale-95 transition-all'}" style="background-color: ${p.color || 'var(--btn-bg)'}; color: ${p.textColor || 'var(--btn-text)'}">${p.text || 'Action'}</button>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Button.template(p)
    },
    Card: {
        template: (p = {}) => `<div class="neo-brutalist p-8 space-y-4 ${p.noAnim ? 'no-anim' : ''}" style="background-color: ${p.bg || 'white'}; color: ${p.textColor || 'inherit'}"><h3 class="text-3xl font-black">${p.title || 'Header'}</h3><p class="font-medium opacity-80 leading-relaxed">${p.content || 'Body text goes here.'}</p></div>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Card.template(p)
    },
    Input: {
        template: (p = {}) => `<div class="space-y-2"><label class="font-black uppercase text-[10px] opacity-40">${p.label || 'Label'}</label><input type="text" placeholder="${p.placeholder || 'Type something...'}" class="neo-brutalist w-full p-4 text-lg bg-white border-4 border-black focus:outline-none font-mono"></div>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Input.template(p)
    },
    Toggle: {
        template: (p = {}) => `<label class="flex items-center cursor-pointer group"><input type="checkbox" class="sr-only" ${p.checked ? 'checked' : ''}><div class="neo-brutalist w-16 h-10 bg-gray-200 relative overflow-hidden"><span class="absolute left-0 top-0 w-10 h-10 bg-black transition-transform duration-200"></span></div><span class="ml-6 text-xl font-black uppercase">${p.label || 'Toggle'}</span></label>`,
        init: (el, p) => {
            el.innerHTML = ComponentRegistry.Toggle.template(p);
            const i = el.querySelector('input'); const k = el.querySelector('span');
            const u = () => k.style.transform = i.checked ? 'translateX(24px)' : 'translateX(0)';
            i.addEventListener('change', u); u();
        }
    },
    Alert: {
        template: (p = {}) => `
            <div class="neo-brutalist alert-transition relative bg-${p.color || 'black'} text-white p-6 flex justify-between items-center no-anim">
                <span class="text-lg font-black uppercase pr-12">${p.message || 'Alert'}</span>
                <button class="absolute top-4 right-4 text-4xl font-black leading-none hover:scale-110 active:scale-90 transition-transform">&times;</button>
            </div>`,
        init: (el, p) => {
            const render = () => {
                el.innerHTML = ComponentRegistry.Alert.template(p);
                const box = el.querySelector('.neo-brutalist');
                const close = el.querySelector('button');
                close.onclick = () => {
                    box.style.opacity = '0';
                    box.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        box.style.opacity = '1';
                        box.style.transform = 'translateY(0)';
                    }, 5000);
                };
            };
            render();
        }
    },
    Modal: {
        template: (p = {}) => `
            <div class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center hidden z-[10000]">
                <div class="neo-brutalist bg-white p-12 max-w-lg w-full mx-4 no-anim shadow-[20px_20px_0_rgba(0,0,0,1)]">
                    <h3 class="text-5xl font-black mb-6 uppercase tracking-tighter">${p.title || 'Modal'}</h3>
                    <p class="text-xl mb-12 font-medium opacity-70">${p.content || 'Content'}</p>
                    <button class="neo-brutalist bg-brutal-yellow text-black text-xl font-black py-4 px-8 w-full uppercase no-anim">Dismiss</button>
                </div>
            </div>`,
        init: (el, p) => {
            const mount = document.getElementById('modal-mount');
            const div = document.createElement('div');
            div.innerHTML = ComponentRegistry.Modal.template(p);
            const m = div.querySelector('.fixed');
            mount.appendChild(m);
            const closeBtn = m.querySelector('button');
            closeBtn.onclick = () => m.classList.add('hidden');
            el.open = () => m.classList.remove('hidden');
        }
    },
    Dropdown: {
        template: (p = {}) => `
            <div class="relative w-full">
                <button class="neo-brutalist bg-brutal-yellow text-black text-xl font-black py-4 px-8 w-full uppercase flex justify-between items-center hover:bg-black hover:text-white transition-all no-anim">
                    ${p.label || 'Select'}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul class="neo-brutalist absolute hidden bg-white w-full mt-4 z-[100] overflow-hidden shadow-[10px_10px_0_rgba(0,0,0,1)]">
                    ${(p.options || ['Edit', 'Delete', 'Settings']).map(o => `<li class="p-4 text-lg font-black uppercase hover:bg-black hover:text-white cursor-pointer border-b-4 border-black last:border-0">${o}</li>`).join('')}
                </ul>
            </div>`,
        init: (el, p) => {
            el.innerHTML = ComponentRegistry.Dropdown.template(p);
            const b = el.querySelector('button'); const u = el.querySelector('ul');
            b.onclick = (e) => { e.stopPropagation(); u.classList.toggle('hidden'); };
            document.addEventListener('click', () => u.classList.add('hidden'));
        }
    },
    Accordion: {
        template: (p = {}) => `
            <div class="neo-brutalist bg-white no-anim w-full">
                ${(p.items || [{ t: 'Section 1', c: 'This is the first section content.' }, { t: 'Section 2', c: 'This is the second section content.' }]).map((item, i) => `
                    <div class="border-b-4 border-black last:border-0">
                        <button class="w-full text-left p-6 text-2xl font-black uppercase flex justify-between items-center group-hover:bg-gray-50 transition-colors">
                            ${item.t}
                            <span class="text-4xl transition-transform duration-200 transform ${i === 0 ? 'rotate-45' : ''}">&plus;</span>
                        </button>
                        <div class="${i === 0 ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden transition-all duration-300 border-t-0 border-black ${i === 0 ? 'border-t-4 p-8' : 'p-0'}">
                            <p class="text-lg font-medium">${item.c}</p>
                        </div>
                    </div>`).join('')}
            </div>`,
        init: (el, p) => {
            el.innerHTML = ComponentRegistry.Accordion.template(p);
            el.querySelectorAll('button').forEach(b => b.onclick = () => {
                const content = b.nextElementSibling;
                const icon = b.querySelector('span');
                const isOpen = icon.classList.contains('rotate-45');
                el.querySelectorAll('.max-h-\\[500px\\]').forEach(x => {
                    x.classList.replace('max-h-[500px]', 'max-h-0');
                    x.classList.replace('p-8', 'p-0');
                    x.classList.remove('border-t-4');
                });
                el.querySelectorAll('.rotate-45').forEach(x => x.classList.remove('rotate-45'));
                if (!isOpen) {
                    content.classList.replace('max-h-0', 'max-h-[500px]');
                    content.classList.replace('p-0', 'p-8');
                    content.classList.add('border-t-4');
                    icon.classList.add('rotate-45');
                }
            });
        }
    },
    Progress: {
        template: (p = {}) => `
            <div class="w-full">
                <div class="neo-brutalist w-full bg-white h-10 relative overflow-hidden no-anim">
                    <div class="h-full transition-all duration-1000 animate-progress-brutal" style="width: ${p.v || 45}%"></div>
                </div>
            </div>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Progress.template(p)
    },
    Nav: {
        template: (p = {}) => `
            <nav class="bg-brutal-yellow text-black p-6 neo-brutalist no-anim w-full">
                <ul class="flex flex-wrap gap-8 font-black uppercase text-sm">
                    ${(p.links || ['Home', 'Services', 'Docs', 'About']).map(l => `<li><a href="#" onclick="event.preventDefault()" class="hover:text-black transition-colors underline decoration-4 underline-offset-4">${l}</a></li>`).join('')}
                </ul>
            </nav>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Nav.template(p)
    },
    Badge: {
        template: (p = {}) => `<span class="neo-brutalist inline-block text-xs font-black py-2 px-4 shadow-[4px_4px_0_rgba(0,0,0,0.2)] no-anim uppercase" style="background-color: ${p.color || 'black'}; color: ${p.textColor || 'white'}">${p.text || 'New'}</span>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Badge.template(p)
    },
    Avatar: {
        template: (p = {}) => `
            <div class="relative group">
                <div class="neo-brutalist w-20 h-20 flex items-center justify-center text-3xl font-black no-anim relative z-10" style="background-color: ${p.color || 'white'}; color: ${p.textColor || 'black'}">
                    ${p.i || 'JD'}
                </div>
                <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-brutal-green border-4 border-black z-20"></div>
            </div>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Avatar.template(p)
    },
    Tooltip: {
        template: (p = {}) => `
            <div class="relative inline-block group/tt scroll-visible">
                <span class="neo-brutalist text-sm font-black py-3 px-6 cursor-help uppercase no-anim hover:bg-black hover:text-white transition-all" style="background-color: ${p.color || 'var(--brutal-yellow)'}; color: ${p.textColor || 'black'}">
                    ${p.trigger || 'Hover Info'}
                </span>
                <div class="neo-brutalist absolute invisible group-hover/tt:visible bg-black text-white text-[11px] p-4 mt-4 w-48 z-[100] left-1/2 -translate-x-1/2 no-anim shadow-[8px_8px_0_rgba(255,255,255,0.2)]">
                    <p class="font-black uppercase mb-1">Information</p>
                    <p class="font-medium opacity-80">${p.content || 'Detailed tooltip information goes right here.'}</p>
                </div>
            </div>`,
        init: (el, p) => el.innerHTML = ComponentRegistry.Tooltip.template(p)
    },
    Tabs: {
        template: (p = {}) => `
            <div class="neo-brutalist bg-white overflow-hidden no-anim w-full">
                <div class="flex border-b-4 border-black">
                    ${(p.tabs || ['General', 'Security', 'Billing']).map((tab, i) => `
                        <button class="flex-grow p-4 text-sm font-black uppercase transition-colors ${i === 0 ? 'bg-brutal-yellow' : 'bg-gray-100 hover:bg-gray-200'}" data-tab="${i}">
                            ${tab}
                        </button>`).join('')}
                </div>
                <div class="p-8 text-lg font-medium">
                    ${(p.contents || ['Settings here...', 'Security here...', 'Billing here...']).map((c, i) => `
                        <div class="${i === 0 ? '' : 'hidden'}" data-content="${i}">${c}</div>`).join('')}
                </div>
            </div>`,
        init: (el, p) => {
            el.innerHTML = ComponentRegistry.Tabs.template(p);
            const btns = el.querySelectorAll('button'); const conts = el.querySelectorAll('div[data-content]');
            btns.forEach((b, i) => b.onclick = () => {
                btns.forEach(x => x.classList.replace('bg-brutal-yellow', 'bg-gray-100'));
                b.classList.replace('bg-gray-100', 'bg-brutal-yellow');
                conts.forEach(x => x.classList.add('hidden'));
                conts[i].classList.remove('hidden');
            });
        }
    }
};

// UI STATE
const root = document.documentElement;
let currentMode = 'bg';
let bgHex = '#f0f0f0';
let primaryHex = '#fde047';
let btnBgHex = '#ffffff';
let btnTextHex = '#000000';

const tooltip = document.getElementById('color-tooltip');

// CORE FUNCTIONS
function init() {
    const palGrid = document.getElementById('palette-grid');
    if (!palGrid) return;

    const labels = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    const headRow = document.createElement('div');
    headRow.className = "grid grid-cols-12 gap-2 items-center mb-2";
    headRow.innerHTML = `<div class="col-span-1"></div>` + labels.map(l => `<div class="text-[10px] font-black text-center text-black uppercase">${l}</div>`).join('');
    palGrid.appendChild(headRow);

    for (const [name, shades] of Object.entries(colors)) {
        const row = document.createElement('div');
        row.className = "grid grid-cols-12 gap-2 items-center group relative";
        let html = `<div class="col-span-1 text-[10px] font-black uppercase tracking-tighter text-black">${name}</div>`;
        shades.forEach(hex => {
            const fullHex = `#${hex}`;
            html += `<div class="color-swatch-cell" style="background-color: ${fullHex}" 
                        onclick="pickColor('${fullHex}')" 
                        onmouseenter="showTooltip('${fullHex}')" 
                        onmouseleave="hideTooltip()"
                        onmousemove="moveTooltip(event)"></div>`;
        });
        row.innerHTML = html;
        palGrid.appendChild(row);
    }

    // RENDERING LAB PREVIEWS
    ComponentRegistry.Button.init(document.getElementById('btn-custom-preview'), { text: 'Preview Button' });
    ComponentRegistry.Card.init(document.getElementById('card-custom-preview'), { title: 'Lively Card', content: 'See me change colors!', bg: 'var(--btn-bg)', textColor: 'var(--btn-text)' });
    ComponentRegistry.Tooltip.init(document.getElementById('tooltip-custom-preview'), { trigger: 'Hover Me', color: 'var(--btn-bg)', textColor: 'var(--btn-text)' });
    ComponentRegistry.Avatar.init(document.getElementById('avatar-custom-preview'), { i: 'AB', color: 'var(--btn-bg)', textColor: 'var(--btn-text)' });
    ComponentRegistry.Badge.init(document.getElementById('badge-custom-preview'), { text: 'Hot', color: 'var(--btn-bg)', textColor: 'var(--btn-text)' });

    // RENDERING LIBRARY GRID
    ComponentRegistry.Button.init(document.getElementById('lib-button'), { text: 'Neo Button', color: 'var(--brutal-yellow)', textColor: 'black', noAnim: false });
    ComponentRegistry.Card.init(document.getElementById('lib-card'), { title: 'SAMPLE CARD', content: 'A raw, functional Neo Brutalist card.', noAnim: true });
    ComponentRegistry.Input.init(document.getElementById('lib-input'), { placeholder: 'Type here...' });
    ComponentRegistry.Toggle.init(document.getElementById('lib-toggle'), { label: 'Switch Me' });
    ComponentRegistry.Alert.init(document.getElementById('lib-alert'), { message: 'Success Alert!', color: 'brutal-green' });
    ComponentRegistry.Modal.init(document.getElementById('lib-modal'), { title: 'BRUTAL MODAL', content: 'Fixed high-contrast modal window.' });

    const mb = document.createElement('button');
    mb.className = "neo-brutalist bg-brutal-yellow text-black font-black py-2 px-4 uppercase hover:bg-black hover:text-white transition-all";
    mb.innerText = "Demo Modal";
    mb.onclick = () => document.getElementById('lib-modal').open();
    document.getElementById('lib-modal').appendChild(mb);

    ComponentRegistry.Nav.init(document.getElementById('lib-nav'), { links: ['Home', 'Services', 'Blog', 'Contact'] });
    ComponentRegistry.Progress.init(document.getElementById('lib-progress'), { v: 85 });
    ComponentRegistry.Dropdown.init(document.getElementById('lib-dropdown'), { label: 'Menu' });
    ComponentRegistry.Accordion.init(document.getElementById('lib-accordion'), { items: [{ t: 'Section A', c: 'Details for section A.' }, { t: 'Section B', c: '+ More stuff' }] });
    ComponentRegistry.Tooltip.init(document.getElementById('lib-tooltip'), { trigger: 'Info', content: 'Vital Information' });
    ComponentRegistry.Avatar.init(document.getElementById('lib-avatar'), { i: 'AB', color: 'var(--brutal-yellow)' });
    ComponentRegistry.Badge.init(document.getElementById('lib-badge'), { text: 'Hot', color: '#ef4444' });
    ComponentRegistry.Tabs.init(document.getElementById('lib-tabs'), { tabs: ['Tab A', 'Tab B', 'Tab C'], contents: ['Content A', 'Content B', 'Content C'] });

    updateUI();
}

function setMode(m) {
    currentMode = m;
    ['bg', 'btn-bg', 'btn-text'].forEach(mode => {
        const btn = document.getElementById(`mode-${mode}`);
        if (!btn) return;
        const isActive = m === mode;
        const width = mode === 'btn-bg' ? 'w-28' : 'w-20';
        btn.className = `${width} flex items-center justify-center transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`;
        if (mode === 'btn-bg') {
            btn.innerHTML = `<span class="text-xl leading-none font-normal">&#x25A1;</span><span>BG</span>`;
        }
    });
}

function showTooltip(hex) {
    if (!tooltip) return;
    tooltip.innerText = hex;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
}

function moveTooltip(e) {
    if (!tooltip) return;
    const offset = 40;
    const x = e.clientX;
    const y = e.clientY;
    tooltip.style.left = x + 'px';
    if (y < 100) {
        tooltip.style.top = (y + offset / 2) + 'px';
        tooltip.style.transform = 'translate(-50%, 0)';
    } else {
        tooltip.style.top = (y - offset) + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)';
    }
}

function pickColor(hex) {
    if (currentMode === 'bg') bgHex = hex;
    else if (currentMode === 'btn-bg') btnBgHex = hex;
    else if (currentMode === 'btn-text') btnTextHex = hex;

    navigator.clipboard.writeText(hex).then(() => {
        const originalText = hex;
        tooltip.innerText = 'Copied!';
        setTimeout(() => { if (tooltip.innerText === 'Copied!') tooltip.innerText = originalText; }, 1000);
    });
    updateUI();
}

function updateUI() {
    root.style.setProperty('--bg-color', bgHex);
    root.style.setProperty('--primary-accent', primaryHex);
    root.style.setProperty('--brutal-yellow', primaryHex);
    root.style.setProperty('--btn-bg', btnBgHex);
    root.style.setProperty('--btn-text', btnTextHex);
}

function resetColors() {
    bgHex = '#f0f0f0';
    primaryHex = '#fde047';
    btnBgHex = '#ffffff';
    btnTextHex = '#000000';
    updateUI();
}

// Global exposure for onclick handlers
window.setMode = setMode;
window.pickColor = pickColor;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;
window.moveTooltip = moveTooltip;
window.resetColors = resetColors;

document.addEventListener('DOMContentLoaded', init);
