import './style.css';
import './custom.css';
import products from './data/products.json'

// Mapping of internal keys to display titles
const DISPLAY_TITLES = {
  jeans: 'Jeans',
  normal_t_shirts: 'Black T‑Shirt',
  plan_t_shifts: 'Black & White T‑Shirt',
  bra: 'Bra'
};

// Utility to create star rating element
function createRating(category) {
  const container = document.createElement('div');
  container.className = 'rating';
  const saved = localStorage.getItem(`rating_${category}`) || 0;
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = i <= saved ? 'star filled' : 'star';
    star.textContent = '★';
    star.dataset.value = i;
    star.addEventListener('click', () => {
      localStorage.setItem(`rating_${category}`, i);
      updateStars(container, i);
    });
    container.appendChild(star);
  }
  return container;
}

function updateStars(container, rating) {
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    star.className = idx < rating ? 'star filled' : 'star';
  });
}

// Render a single category section
function renderCategory(key, items) {
  const section = document.createElement('section');
  section.className = 'category';
  const title = document.createElement('h2');
  title.textContent = DISPLAY_TITLES[key] || key;
  section.appendChild(title);

  // Rating (skip Bra – it will be locked)
  if (key !== 'bra') {
    section.appendChild(createRating(key));
  }

  const grid = document.createElement('div');
  grid.className = 'grid';
  items.forEach(item => {
    const a = document.createElement('a');
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = item.title;
    const img = document.createElement('img');
    img.src = item.url; // assuming the link returns an image; otherwise replace with placeholder
    img.alt = item.title;
    a.appendChild(img);
    grid.appendChild(a);
  });
  section.appendChild(grid);
  return section;
}

// Password‑protected Bra section
function renderBraSection(key, items) {
  const wrapper = document.createElement('div');
  wrapper.id = 'bra-wrapper';

  const button = document.createElement('button');
  button.textContent = 'Enter password to view Bra collection';
  button.className = 'bra-toggle';
  button.addEventListener('click', () => {
    const pwd = prompt('Enter password (hint: yourphone password)');
    if (pwd === '0412') {
      wrapper.innerHTML = '';
      wrapper.appendChild(renderCategory(key, items));
    } else {
      alert('Incorrect password');
    }
  });
  wrapper.appendChild(button);
  return wrapper;
}

function init() {
  const app = document.getElementById('app');
  const container = document.createElement('div');
  container.className = 'shop-container';

  Object.entries(products).forEach(([key, items]) => {
    if (key === 'bra') {
      container.appendChild(renderBraSection(key, items));
    } else {
      container.appendChild(renderCategory(key, items));
    }
  });

  app.appendChild(container);
}

init();
