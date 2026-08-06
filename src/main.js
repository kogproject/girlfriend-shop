import './style.css';
import './custom.css';
import products from './data/products.json'

// Mapping of internal keys to display titles
const DISPLAY_TITLES = {
  jeans: 'Jeans',
  normal_t_shirts: 'Black T‑Shirt',
  plan_t_shifts: 'Black & White T‑Shirt',
  casual_tops: 'Casual & Yellow Tops',
  special_collection: 'Special Collection'
};

// Lightbox setup
function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }
}

function openLightbox(src, title) {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  if (modal && modalImg) {
    modal.style.display = 'block';
    modalImg.src = src;
    if (caption) caption.textContent = title || '';
  }
}

// Floating heart burst effect when rating is high (>=8)
function triggerHeartBurst(element) {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = ['💖', '💕', '💗', '❤️', '✨'][Math.floor(Math.random() * 5)];
    heart.style.left = `${element.getBoundingClientRect().left + Math.random() * 50}px`;
    heart.style.top = `${element.getBoundingClientRect().top - 10}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }
}

// Utility to create star rating element (10-star scale)
function createRating(storageKey) {
  const container = document.createElement('div');
  container.className = 'rating-wrapper';

  const starsContainer = document.createElement('div');
  starsContainer.className = 'rating';

  const scoreText = document.createElement('span');
  scoreText.className = 'score-text';

  const saved = parseInt(localStorage.getItem(storageKey), 10) || 0;
  scoreText.textContent = saved > 0 ? `${saved}/10` : 'Rate (0/10)';

  for (let i = 1; i <= 10; i++) {
    const star = document.createElement('span');
    star.className = i <= saved ? 'star filled' : 'star';
    star.textContent = '★';
    star.dataset.value = i;
    star.addEventListener('click', (e) => {
      localStorage.setItem(storageKey, i);
      updateStars(starsContainer, i);
      scoreText.textContent = `${i}/10`;

      if (i >= 8) {
        triggerHeartBurst(e.target);
      }
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
  catRatingContainer.appendChild(createRating(`cat_rating_${key}`));
  section.appendChild(catRatingContainer);

  const grid = document.createElement('div');
  grid.className = 'grid';
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const img = document.createElement('img');
    const baseImgPath = item.image || `/images/${key}/${index + 1}.jpg`;
    img.src = baseImgPath;
    img.alt = item.title;
    img.title = 'Click to zoom in 🔍';
    img.style.cursor = 'zoom-in';

    // Click to open full-screen lightbox preview
    img.addEventListener('click', () => {
      openLightbox(img.src, item.title);
    });

    // Fallback handler if .jpg is not found (tries .png, .jpeg, .webp, placeholder)
    let fallbackStep = 0;
    img.onerror = function() {
      const extensions = ['.png', '.jpeg', '.webp', 'https://via.placeholder.com/150?text=Product'];
      if (fallbackStep < extensions.length) {
        const ext = extensions[fallbackStep++];
        if (ext.startsWith('http')) {
          this.src = ext;
        } else {
          const basePathWithoutExt = baseImgPath.substring(0, baseImgPath.lastIndexOf('.'));
          this.src = basePathWithoutExt + ext;
        }
      }
    };
    
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
    link.textContent = 'View Product Link';
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
  button.textContent = '✨ Enter password to view Special Collection ✨';
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

// Create falling flower petals animation
function createFloatingPetals() {
  const petalsContainer = document.createElement('div');
  petalsContainer.className = 'petals-container';
  const symbols = ['🌸', '🌹', '🌺', '🌷', '✨', '💖'];

  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${5 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
    petalsContainer.appendChild(petal);
  }
  document.body.appendChild(petalsContainer);
}

function renderShareActions() {
  const bar = document.createElement('div');
  bar.className = 'share-bar';

  // Personal Note Container
  const noteBox = document.createElement('div');
  noteBox.className = 'love-note-box';
  
  const noteLabel = document.createElement('label');
  noteLabel.className = 'note-label';
  noteLabel.innerHTML = '💌 Add a Personal Note or Size Preference for Him:';
  
  const noteInput = document.createElement('textarea');
  noteInput.className = 'note-input';
  noteInput.placeholder = 'e.g. Please order Size M for Black T-shirt, I love the jeans! 💕';
  noteInput.rows = 2;

  noteBox.appendChild(noteLabel);
  noteBox.appendChild(noteInput);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'share-buttons-wrapper';

  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-btn whatsapp-btn';
  shareBtn.innerHTML = '💬 Send My Wishlist & Ratings via WhatsApp 🌹';
  shareBtn.addEventListener('click', () => {
    let msg = "🌸 *My Shopping Ratings & Favorite Outfits* 🌸\n\n";

    const customNote = noteInput.value.trim();
    if (customNote) {
      msg += `💌 *Personal Note:* "${customNote}"\n\n`;
    }

    Object.entries(products).forEach(([key, items]) => {
      const catTitle = DISPLAY_TITLES[key] || key;
      const catRating = localStorage.getItem(`cat_rating_${key}`);
      
      msg += `📌 *Category: ${catTitle}*\n`;
      msg += `   Overall Category Score: ${catRating ? catRating + '/10 ⭐' : 'Not rated'}\n`;

      items.forEach((item, index) => {
        const itemRating = localStorage.getItem(`item_rating_${key}_${index}`);
        msg += `   • ${item.title}: ${itemRating ? itemRating + '/10 ⭐' : 'Not rated'}\n     Link: ${item.url}\n`;
      });

      msg += "\n";
    });

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });

  const emailBtn = document.createElement('button');
  emailBtn.className = 'share-btn email-btn';
  emailBtn.innerHTML = '✉️ Send via Email 💌';
  emailBtn.addEventListener('click', () => {
    let body = "My Shopping Category Ratings & Wishlist (out of 10):\n\n";
    const customNote = noteInput.value.trim();
    if (customNote) {
      body += `Personal Note: "${customNote}"\n\n`;
    }
    Object.entries(products).forEach(([key, items]) => {
      const catTitle = DISPLAY_TITLES[key] || key;
      const catRating = localStorage.getItem(`cat_rating_${key}`);
      body += `Category: ${catTitle}\nOverall Rating: ${catRating ? catRating + '/10' : 'Not rated'}\n`;
      items.forEach((item, index) => {
        const itemRating = localStorage.getItem(`item_rating_${key}_${index}`);
        body += `  - ${item.title}: ${itemRating ? itemRating + '/10' : 'Not rated'} (${item.url})\n`;
      });
      body += "\n";
    });
    window.open(`mailto:?subject=${encodeURIComponent("My Favorite Outfits!")}&body=${encodeURIComponent(body)}`);
  });

  buttonContainer.appendChild(shareBtn);
  buttonContainer.appendChild(emailBtn);

  bar.appendChild(noteBox);
  bar.appendChild(buttonContainer);
  return bar;
}

function init() {
  createFloatingPetals();
  setupLightbox();
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





