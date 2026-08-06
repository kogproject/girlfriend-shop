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

// Utility to create star rating element (10-star scale)
function createRating(category) {
  const container = document.createElement('div');
  container.className = 'rating-wrapper';

  const starsContainer = document.createElement('div');
  starsContainer.className = 'rating';

  const scoreText = document.createElement('span');
  scoreText.className = 'score-text';

  const saved = parseInt(localStorage.getItem(`rating_${category}`), 10) || 0;
  scoreText.textContent = saved > 0 ? `${saved}/10` : 'Rate (0/10)';

  for (let i = 1; i <= 10; i++) {
    const star = document.createElement('span');
    star.className = i <= saved ? 'star filled' : 'star';
    star.textContent = '★';
    star.dataset.value = i;
    star.addEventListener('click', () => {
      localStorage.setItem(`rating_${category}`, i);
      updateStars(starsContainer, i);
      scoreText.textContent = `${i}/10`;
    });
    starsContainer.appendChild(star);
  }

  container.appendChild(starsContainer);
  container.appendChild(scoreText);
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

  // Category overall rating (10 point scale)
  const catRatingContainer = document.createElement('div');
  catRatingContainer.className = 'category-rating-box';
  const catLabel = document.createElement('span');
  catLabel.className = 'cat-rating-label';
  catLabel.textContent = 'Overall Category Rating: ';
  catRatingContainer.appendChild(catLabel);
  catRatingContainer.appendChild(createRating(key));
  section.appendChild(catRatingContainer);

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

function renderShareActions() {
  const bar = document.createElement('div');
  bar.className = 'share-bar';

  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-btn whatsapp-btn';
  shareBtn.innerHTML = '💬 Send My Category Ratings & Wishlist to Him via WhatsApp';
  shareBtn.addEventListener('click', () => {
    let msg = "💖 *My Shopping Category Ratings & Wishlist (out of 10)* 💖\n\n";
    let ratedCount = 0;

    Object.entries(products).forEach(([key, items]) => {
      const catTitle = DISPLAY_TITLES[key] || key;
      const catRating = localStorage.getItem(`rating_${key}`);
      
      msg += `📌 *Category: ${catTitle}*\n`;
      if (catRating && catRating > 0) {
        msg += `   Overall Category Score: ${catRating}/10 ⭐\n`;
        ratedCount++;
      } else {
        msg += `   Overall Category Score: Not rated\n`;
      }

      let itemsAdded = false;
      items.forEach((item, index) => {
        const itemRating = localStorage.getItem(`item_rating_${key}_${index}`);
        if (itemRating && itemRating > 0) {
          msg += `   • ${item.title}: ${itemRating}/10 ⭐\n     Link: ${item.url}\n`;
          itemsAdded = true;
          ratedCount++;
        }
      });

      msg += "\n";
    });

    if (ratedCount === 0) {
      alert("Please rate some items or categories first by clicking the stars! ⭐");
      return;
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });

  const emailBtn = document.createElement('button');
  emailBtn.className = 'share-btn email-btn';
  emailBtn.innerHTML = '✉️ Send via Email';
  emailBtn.addEventListener('click', () => {
    let body = "My Shopping Category Ratings & Wishlist (out of 10):\n\n";
    Object.entries(products).forEach(([key, items]) => {
      const catTitle = DISPLAY_TITLES[key] || key;
      const catRating = localStorage.getItem(`rating_${key}`);
      body += `Category: ${catTitle}\nOverall Rating: ${catRating ? catRating + '/10' : 'Not rated'}\n`;
      items.forEach((item, index) => {
        const itemRating = localStorage.getItem(`item_rating_${key}_${index}`);
        if (itemRating) {
          body += `  - ${item.title}: ${itemRating}/10 stars (${item.url})\n`;
        }
      });
      body += "\n";
    });
    window.open(`mailto:?subject=${encodeURIComponent("My Shopping Category Ratings & Outfits!")}&body=${encodeURIComponent(body)}`);
  });

  bar.appendChild(shareBtn);
  bar.appendChild(emailBtn);
  return bar;
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
  app.appendChild(renderShareActions());
}

init();


