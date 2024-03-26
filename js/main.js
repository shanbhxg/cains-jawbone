const pagesData = [
  ]; 
  for (let i = 1; i <= 100; i++) {
    pagesData.push({ id: i, content: getpageContent(i) });
  }
  function getpageContent(pageId) {
    const request = new XMLHttpRequest();
    request.open('GET', `content/page${pageId}.txt`, false); // false makes the request synchronous
    // the files that are being requested are in the content folder eg 'content/page1.txt'
    request.send();
    return request.responseText;
  }

  // load pages
  const pagesContainer = document.getElementById('pages-container');
  pagesData.forEach(page => {
    const pageElement = createpageElement(page);
    pageElement.addEventListener('click', () => showpagePage(page));
    pagesContainer.appendChild(pageElement);
  });

  // load color 
  const savedPagesColour = localStorage.getItem('pagesColour');
if (savedPagesColour) {
  const pagesColour = JSON.parse(savedPagesColour);
  pagesColour.forEach((color, index) => {
    const page = document.getElementById(`page-${index + 1}`);
    if (page) {
      page.style.backgroundColor = color;
    }
  });
}

  const pagesOrder = JSON.parse(localStorage.getItem('pagesOrder'));
  if (pagesOrder) {
        pagesOrder.forEach(pageId => {
        const page = document.getElementById(pageId);
        pagesContainer.appendChild(page);
        });
    }

  // drag and drop functionality
  let draggedpageId = null;
  
  pagesContainer.addEventListener('dragstart', event => {
    draggedpageId = event.target.getAttribute('id');
  });
  
  pagesContainer.addEventListener('dragover', event => {
    event.preventDefault();
  });
  
  pagesContainer.addEventListener('drop', event => {
    event.preventDefault();
    const targetpageId = event.target.getAttribute('id');
  
    if (draggedpageId && targetpageId && draggedpageId !== targetpageId) {
      const draggedpage = document.getElementById(draggedpageId);
      const targetpage = document.getElementById(targetpageId);
      const draggedpageIndex = getIndex(draggedpage); 
      const targetpageIndex = getIndex(targetpage);
  
      if (draggedpageIndex !== -1 && targetpageIndex !== -1) {
        const pageData = pagesData[draggedpageIndex];
        pagesData.splice(draggedpageIndex, 1); 
        pagesData.splice(targetpageIndex, 0, pageData);
  
        pagesContainer.insertBefore(draggedpage, targetpage);
      }
    }
  });
  
  function getIndex(element) {
    const pages = Array.from(pagesContainer.children);
    return pages.indexOf(element);
  }
  

  function createpageElement(page) {
    const pageElement = document.createElement('div');
    pageElement.classList.add('page');
    pageElement.setAttribute('id', `page-${page.id}`);
    pageElement.setAttribute('draggable', 'true'); // Enable draggable attribute
    pageElement.innerHTML = `
      <p>${page.content}</p>
    `;
    return pageElement;
  }
  
  
  function showpagePage(page) { // this function is called when a page is clicked
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const modal = document.createElement('div');
    modal.classList.add('modal');
  
    const content = document.createElement('div');
    content.classList.add('modal-content'); 
    content.textContent = page.content;

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    // on hover, the close button changes color to black from white
    closeBtn.style.color = 'white';
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.color = 'red';
    });
    modal.appendChild(content);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // on clicking outside the modal, the modal closes
    window.addEventListener('click', event => {
      if (event.target === overlay) {
        document.body.removeChild(overlay);
      }
    }
    );



    // add a colour button which changes the background colour of the page picking from a colour palette
    const colourBtn = document.createElement('button');
    colourBtn.classList.add('colour-btn');
    colourBtn.textContent = 'Change Background Colour';
    colourBtn.addEventListener('click', () => {
      // the user is now displayed a colour palette to choose from
      // if there is already a colour palette, do not create another one
      if (document.querySelector('.colour-palette')) {
        return;
      }
      const colourPalette = document.createElement('div');
      colourPalette.classList.add('colour-palette');
      overlay.appendChild(colourPalette);
      const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan', 'magenta', 'plum', 'turquoise', 'lime', 'gold', 'silver', 'white', 'black'];
      colours.forEach(colour => {
        const colourBtn = document.createElement('button');
        colourBtn.classList.add('colour-btn');
        colourBtn.textContent = colour;
        colourBtn.style.backgroundColor = colour;
        colourBtn.addEventListener('click', () => {
          // this labels the current page with the colour chosen by the user
          const pageElement = document.getElementById(`page-${page.id}`);
          pageElement.style.backgroundColor = colour;
          modal.style.border = 'thick solid ' + colour;
        }
        );
        colourPalette.appendChild(colourBtn);
  }
  
  );
}
    );
  modal.appendChild(colourBtn);
  }


// saving page order
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
      const pages = Array.from(pagesContainer.children);
      const pagesOrder = pages.map(page => page.getAttribute('id'));
      const pagesColour = pages.map(page => page.style.backgroundColor);
      // the notes from the textarea under the id 'notes' are saved
      const notes = document.getElementById('notes').value;
      localStorage.setItem('notes', notes);
      localStorage.setItem('pagesColour', JSON.stringify(pagesColour));
      localStorage.setItem('pagesOrder', JSON.stringify(pagesOrder));
    });

// drag and drop functionality for page order
pagesContainer.addEventListener('dragstart', event => {
    draggedpageId = event.target.getAttribute('id');
    event.dataTransfer.setData('text/plain', ''); // Required for Firefox to enable drag
  });
  
  pagesContainer.addEventListener('dragover', event => {
    event.preventDefault();
  });
  
  pagesContainer.addEventListener('drop', event => {
    event.preventDefault();
    const targetpageId = event.target.getAttribute('id');
  
    if (draggedpageId && targetpageId && draggedpageId !== targetpageId) {
      const draggedpage = document.getElementById(draggedpageId);
      const targetpage = document.getElementById(targetpageId);
      const draggedpageIndex = getIndex(draggedpage);
      const targetpageIndex = getIndex(targetpage);
  
      if (draggedpageIndex !== -1 && targetpageIndex !== -1) {
        const pageData = pagesData[draggedpageIndex];
        pagesData.splice(draggedpageIndex, 1);
        pagesData.splice(targetpageIndex, 0, pageData);
  
        pagesContainer.insertBefore(draggedpage, targetpage);
      }
    }
  });
  
pagesContainer.addEventListener('contextmenu', event => {
    event.preventDefault();
    const page = event.target.closest('.page');
    if (page) {
      const pageId = page.getAttribute('id');
      const pageIndex = getIndex(page);
      page.setAttribute('title', `page #${pageIndex + 1}`);
      page.classList.add('selected');
      const selectedpages = document.querySelectorAll('.selected');
      if (selectedpages.length === 2) {
        const firstpage = selectedpages[0];
        const secondpage = selectedpages[1];
        const firstpageIndex = getIndex(firstpage);
        const secondpageIndex = getIndex(secondpage);
        const firstpageData = pagesData[firstpageIndex];
        const secondpageData = pagesData[secondpageIndex];
        pagesData[firstpageIndex] = secondpageData;
        pagesData[secondpageIndex] = firstpageData;
        pagesContainer.insertBefore(secondpage, firstpage);
        firstpage.classList.remove('selected');
        secondpage.classList.remove('selected');
      }
    }
  });

// notes functionality
const notesContainer = document.getElementById('notes-container');
const notesToggle = document.getElementById('notes-btn');

// toggle the notes container
notesToggle.addEventListener('click', () => {
  notesContainer.classList.toggle('visible');
});

// load the notes from local storage to the textarea
const savedNotes = localStorage.getItem('notes');
if (savedNotes) {
  document.getElementById('notes').value = savedNotes;
}

// on hovering over the page, the rank of page in the array is displayed
pagesContainer.addEventListener('mouseover', event => {
  const page = event.target.closest('.page');
  if (page) {
    const pageId = page.getAttribute('id');
    const pageIndex = getIndex(page);
    page.setAttribute('title', `page #${pageIndex + 1}`);
  }
}
);

// on clicking help button display help modal
const helpFn = document.getElementById('help-btn');
function helpBtn() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const content = document.createElement('div');
  content.classList.add('modal-content');
  // the inner HTML of the modal is fetched from content/help.txt
  const request = new XMLHttpRequest();
  request.open('GET', 'content/help.txt', false); // false makes the request synchronous
  request.send();
  content.innerHTML = request.responseText;

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '&times;';
  // on hover, the close button changes color to black from white
  closeBtn.style.color = 'white';
  closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.color = 'red';
  });

  modal.appendChild(content);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  // on clicking outside the modal, the modal closes
  window.addEventListener('click', event => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  }
  );
}

helpBtn.addEventListener('click', helpFn());

function highlight() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedText = range.extractContents();
  const span = document.createElement('span');
  span.style.backgroundColor = 'yellow';
  span.appendChild(selectedText);
  range.insertNode(span);
}


// for mouse drag
document.addEventListener('mouseup', highlight);

window.onload = helpFn;

