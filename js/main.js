// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Work map: on wide screens, draw a line from each project to the tools it used,
// and light up whatever the pointer or keyboard is on. On narrow screens, or if
// this never runs, the map is just two lists of projects with their tools inline.
const map = document.querySelector('.map');
if (map) {
  const svg = map.querySelector('.map__wires');
  const readout = map.querySelector('.map__readout');
  const nodes = [...map.querySelectorAll('.node')];
  const tools = new Map([...map.querySelectorAll('.tool')].map((t) => [t.dataset.tool, t]));
  const wide = window.matchMedia('(min-width: 60em)');
  const NS = 'http://www.w3.org/2000/svg';
  let wires = [];
  let active = null; // what's lit, so a redraw mid-hover can restore it

  const toolsOf = (node) => node.dataset.tools.split(' ').filter((id) => tools.has(id));
  const titleOf = (node) => node.querySelector('.node__title').textContent;

  function draw() {
    svg.replaceChildren();
    wires = [];
    if (!wide.matches) {
      map.classList.remove('map--wired', 'map--drawn', 'map--active');
      return;
    }
    map.classList.add('map--wired');

    const box = map.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

    nodes.forEach((node) => {
      const lane = node.dataset.lane;
      const n = node.getBoundingClientRect();
      const x1 = (lane === 'infra' ? n.right : n.left) - box.left;
      const y1 = n.top + n.height / 2 - box.top;

      toolsOf(node).forEach((id) => {
        const t = tools.get(id).getBoundingClientRect();
        const x2 = (lane === 'infra' ? t.left : t.right) - box.left;
        const y2 = t.top + t.height / 2 - box.top;
        const mx = (x1 + x2) / 2;
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
        path.setAttribute('class', `wire ${lane}`);
        svg.appendChild(path);
        wires.push({ path, node, tool: id });
      });
    });

    if (active) active();
    requestAnimationFrame(() => map.classList.add('map--drawn'));
  }

  function light(lit, text) {
    map.classList.add('map--active');
    map.querySelectorAll('.is-lit').forEach((el) => el.classList.remove('is-lit'));
    lit.forEach((el) => el.classList.add('is-lit'));
    readout.textContent = text;
  }

  function clear() {
    active = null;
    map.classList.remove('map--active');
    map.querySelectorAll('.is-lit').forEach((el) => el.classList.remove('is-lit'));
    readout.textContent = readout.dataset.default;
  }

  function lightNode(node) {
    active = () => lightNode(node);
    const mine = wires.filter((w) => w.node === node);
    light(
      [node, ...mine.map((w) => w.path), ...mine.map((w) => tools.get(w.tool))],
      node.querySelector('.node__summary').textContent
    );
  }

  function lightTool(id) {
    active = () => lightTool(id);
    const mine = wires.filter((w) => w.tool === id);
    const users = mine.map((w) => w.node);
    light(
      [tools.get(id), ...mine.map((w) => w.path), ...users],
      `${tools.get(id).textContent}: used in ${users.map(titleOf).join(', ')}.`
    );
  }

  nodes.forEach((node) => {
    node.addEventListener('pointerenter', () => wide.matches && lightNode(node));
    node.addEventListener('pointerleave', clear);
    node.addEventListener('focus', () => wide.matches && lightNode(node));
    node.addEventListener('blur', clear);
  });
  tools.forEach((el, id) => {
    el.addEventListener('pointerenter', () => wide.matches && lightTool(id));
    el.addEventListener('pointerleave', clear);
  });

  let queued = false;
  const redraw = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; draw(); });
  };
  new ResizeObserver(redraw).observe(map);
  wide.addEventListener('change', redraw);
  if (document.fonts) document.fonts.ready.then(redraw);
  draw();
}

// Click any gallery image to open it full size
const gallery = document.querySelectorAll('.gallery img');
if (gallery.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img alt="">';
  document.body.appendChild(lightbox);
  const full = lightbox.querySelector('img');

  const close = () => {
    lightbox.classList.remove('open');
    full.src = '';
  };

  gallery.forEach((img) => {
    img.addEventListener('click', () => {
      full.src = img.currentSrc || img.src;
      full.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
