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

  // saving page order
  const saveBtn = document.getElementById('save-btn');
  saveBtn.addEventListener('click', () => {
        const pages = Array.from(pagesContainer.children);
        const pagesOrder = pages.map(page => page.getAttribute('id'));
        localStorage.setItem('pagesOrder', JSON.stringify(pagesOrder));
        location.reload();
      });


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
  
  
  function showpagePage(page) {
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
  }

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

notesToggle.addEventListener('click', () => {
  notesContainer.classList.toggle('visible');
});

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
