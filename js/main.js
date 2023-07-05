// Card data
const cardsData = [
    { id: 1, label: 'Card 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
    { id: 2, label: 'Card 2', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    // Add more cards here
  ];
  
  // Load cards
  const cardsContainer = document.getElementById('cards-container');
  
  cardsData.forEach(card => {
    const cardElement = createCardElement(card);
    cardElement.addEventListener('click', () => showCardPage(card));
    cardsContainer.appendChild(cardElement);
  });
  
    // to save the order of the cards in the local browser cache wih
    // the help of the localStorage API
    // Save cards order
    const saveBtn = document.getElementById('save-btn');

    saveBtn.addEventListener('click', () => {
        const cards = Array.from(cardsContainer.children);
        const cardsOrder = cards.map(card => card.getAttribute('id'));
        localStorage.setItem('cardsOrder', JSON.stringify(cardsOrder));
    });

    // Load cards order
    const cardsOrder = JSON.parse(localStorage.getItem('cardsOrder'));
    if (cardsOrder) {
        cardsOrder.forEach(cardId => {
        const card = document.getElementById(cardId);
        cardsContainer.appendChild(card);
        });
    }

  // Drag and drop functionality
  let draggedCardId = null;
  
  cardsContainer.addEventListener('dragstart', event => {
    draggedCardId = event.target.getAttribute('id');
  });
  
  cardsContainer.addEventListener('dragover', event => {
    event.preventDefault();
  });
  
  cardsContainer.addEventListener('drop', event => {
    event.preventDefault();
    const targetCardId = event.target.getAttribute('id');
  
    if (draggedCardId && targetCardId && draggedCardId !== targetCardId) {
      const draggedCard = document.getElementById(draggedCardId);
      const targetCard = document.getElementById(targetCardId);
      const draggedCardIndex = getIndex(draggedCard); 
      const targetCardIndex = getIndex(targetCard);
  
      if (draggedCardIndex !== -1 && targetCardIndex !== -1) {
        const cardData = cardsData[draggedCardIndex];
        cardsData.splice(draggedCardIndex, 1); 
        cardsData.splice(targetCardIndex, 0, cardData);
  
        cardsContainer.insertBefore(draggedCard, targetCard);
      }
    }
  });
  
  function getIndex(element) {
    const cards = Array.from(cardsContainer.children);
    return cards.indexOf(element);
  }
  
  function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('id', `card-${card.id}`);
    cardElement.setAttribute('draggable', 'true'); // Enable draggable attribute
    cardElement.innerHTML = `
      <h3>${card.label}</h3>
      <p>${card.content}</p>
    `;
    return cardElement;
  }
  
  
  function showCardPage(card) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
  
    const modal = document.createElement('div');
    modal.classList.add('modal');
  
    const content = document.createElement('div');
    content.classList.add('modal-content');
    content.textContent = card.content;
  
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
  
    modal.appendChild(content);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
  }
// Drag and drop functionality for card order
cardsContainer.addEventListener('dragstart', event => {
    draggedCardId = event.target.getAttribute('id');
    event.dataTransfer.setData('text/plain', ''); // Required for Firefox to enable drag
  });
  
  cardsContainer.addEventListener('dragover', event => {
    event.preventDefault();
  });
  
  cardsContainer.addEventListener('drop', event => {
    event.preventDefault();
    const targetCardId = event.target.getAttribute('id');
  
    if (draggedCardId && targetCardId && draggedCardId !== targetCardId) {
      const draggedCard = document.getElementById(draggedCardId);
      const targetCard = document.getElementById(targetCardId);
      const draggedCardIndex = getIndex(draggedCard);
      const targetCardIndex = getIndex(targetCard);
  
      if (draggedCardIndex !== -1 && targetCardIndex !== -1) {
        const cardData = cardsData[draggedCardIndex];
        cardsData.splice(draggedCardIndex, 1);
        cardsData.splice(targetCardIndex, 0, cardData);
  
        cardsContainer.insertBefore(draggedCard, targetCard);
      }
    }
  });
  
  function getIndex(element) {
    const cards = Array.from(cardsContainer.children);
    return cards.indexOf(element);
  }
// Notes functionality
const notesContainer = document.getElementById('notes-container');
const notesToggle = document.getElementById('notes-btn');

notesToggle.addEventListener('click', () => {
  notesContainer.classList.toggle('visible');
});
