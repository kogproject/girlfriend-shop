import './style.css';
import './custom.css';
import products from './data/products.json'

// Mapping of internal keys to display titles
const DISPLAY_TITLES = {
  jeans: 'Jeans',
  normal_t_shirts: 'Black T‑Shirt',
  plan_t_shifts: 'Black & White T‑Shirt',
  special_collection: 'Special Collection'
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

  // Rating (skip special collection – locked)
  if (key !== 'special_collection') {
    section.appendChild(createRating(key));
  }

  const grid = document.createElement('div');
  grid.className = 'grid';
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const img = document.createElement('img');
    img.src = 'https://via.placeholder.com/150?text=Product';
    img.alt = item.title;

    // Fallback if image fails or URL is provided
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/150?text=Product';
    };
    if (item.url && (item.url.endsWith('.jpg') || item.url.endsWith('.png') || item.url.endsWith('.jpeg') || item.url.endsWith('.webp'))) {
      img.src = item.url;
    }
    
    const title = document.createElement('p');
    title.textContent = item.title;
    
    // Rating star control for individual item
    const itemRatingKey = `item_rating_${key}_${index}`;
    const ratingEl = createRating(itemRatingKey);
    ratingEl.classList.add('item-rating');

    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'View Product';
    link.className = 'product-link';
    
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(ratingEl);
    card.appendChild(link);
    grid.appendChild(card);
  });
  section.appendChild(grid);
  return section;
}

// Password‑protected Special Collection section
function renderSpecialCollection(key, items) {
  const wrapper = document.createElement('div');
  wrapper.id = 'special-collection-wrapper';

  const button = document.createElement('button');
  button.textContent = 'Enter password to view Special Collection';
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
    if (key === 'special_collection') {
      container.appendChild(renderSpecialCollection(key, items));
    } else {
      container.appendChild(renderCategory(key, items));
    }
  });

  app.appendChild(container);
}

init();
