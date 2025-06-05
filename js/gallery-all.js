// js/gallery-all.js
import { storiesData } from './data.js';
import { openModalWithStory } from './modal.js'; 
// We'll import allPoemsGalleryContainerPage and loadingIndicator in main-all-poems.js and pass them

// --- CONFIG FOR ALL POEMS PAGE ---
const POEMS_PER_PAGE_ALL = 12; 
let allPoemsCurrentPageIndex = 0; 
let allPoemsSortedCache = null; 

// createStoryElement is identical to the one in gallery.js
// For DRY principle, you could move this to a js/utils.js or js/uiComponents.js and import it in both
// gallery.js and gallery-all.js. For now, we can duplicate it for simplicity.
function createStoryElement(story) {
    const item = document.createElement('div');
    item.classList.add('gallery-item');
    item.dataset.storyId = story.id;

    let mediaElement;
    if (story.media_type === "video") {
        mediaElement = document.createElement('video');
        mediaElement.src = story.media_path;
        mediaElement.classList.add('gallery-item-media');
        mediaElement.setAttribute('poster', ''); 
        mediaElement.setAttribute('preload', 'metadata'); 
        mediaElement.muted = true; 
    } else { 
        mediaElement = document.createElement('img');
        mediaElement.src = story.media_path;
        mediaElement.alt = `Preview for ${story.poem_title}`;
        mediaElement.classList.add('gallery-item-media');
        mediaElement.loading = 'lazy'; 
    }
    item.appendChild(mediaElement);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('gallery-item-info');
    const poemTitlePreview = document.createElement('h4'); 
    poemTitlePreview.classList.add('gallery-item-poem-preview'); 
    poemTitlePreview.textContent = story.poem_title || story.poem_text.split('\n')[0]; 
    infoDiv.appendChild(poemTitlePreview);
    const dateDisplay = document.createElement('p');
    dateDisplay.classList.add('gallery-item-date');
    dateDisplay.textContent = story.date_posted;
    infoDiv.appendChild(dateDisplay);
    item.appendChild(infoDiv);

    item.addEventListener('click', () => {
        openModalWithStory(story); 
    });
    return item;
}

function renderPoemsBatch(poemsToRender, container) {
    poemsToRender.forEach(story => {
        container.appendChild(createStoryElement(story));
    });
}

function loadMoreAllPoems(container, indicator, loadMoreBtn) {
    if (!container) return;

    const startIndex = allPoemsCurrentPageIndex * POEMS_PER_PAGE_ALL;
    const endIndex = startIndex + POEMS_PER_PAGE_ALL;
    
    if (!allPoemsSortedCache) { 
        allPoemsSortedCache = [...storiesData].sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    }
    
    const batchToLoad = allPoemsSortedCache.slice(startIndex, endIndex);

    if (batchToLoad.length > 0) {
        renderPoemsBatch(batchToLoad, container);
        allPoemsCurrentPageIndex++;
    }

    if (loadMoreBtn) {
        if (endIndex >= allPoemsSortedCache.length) {
            loadMoreBtn.style.display = 'none';
            if (indicator) indicator.style.display = 'none'; 
            
            const existingNoMoreMessage = container.parentElement.querySelector('.no-more-poems-message');
            if (!existingNoMoreMessage) {
                const noMoreMessage = document.createElement('p');
                noMoreMessage.textContent = "narito ang simula..";
                noMoreMessage.className = 'no-more-poems-message';
                noMoreMessage.style.textAlign = 'center';
                noMoreMessage.style.padding = '20px';
                container.insertAdjacentElement('afterend', noMoreMessage);
            }
        } else {
            loadMoreBtn.style.display = 'block'; 
        }
    }
    if (indicator) indicator.style.display = 'none';
}

export function initializeAllPoemsDisplay(container, indicator) { 
    if (!container) {
        console.warn("All poems gallery container not found for initialization.");
        return;
    }
    container.innerHTML = ''; 
    allPoemsCurrentPageIndex = 0;
    allPoemsSortedCache = null;

    const existingButton = document.getElementById('load-more-all-poems-btn');
    if (existingButton) existingButton.remove();
    
    const existingNoMoreMessage = container.parentElement.querySelector('.no-more-poems-message');
    if (existingNoMoreMessage) existingNoMoreMessage.remove();
    
    let loadMoreButton = null;

    loadMoreAllPoems(container, indicator, null); 

    if (!allPoemsSortedCache) { 
         allPoemsSortedCache = [...storiesData].sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    }

    if (allPoemsSortedCache.length > POEMS_PER_PAGE_ALL) {
        loadMoreButton = document.createElement('button');
        loadMoreButton.id = 'load-more-all-poems-btn';
        loadMoreButton.textContent = 'Load More Poems';
        loadMoreButton.classList.add('button-style-link'); 
        loadMoreButton.style.display = 'block'; 
        loadMoreButton.style.margin = '30px auto'; 
        
        loadMoreButton.addEventListener('click', () => {
            if(indicator) indicator.style.display = 'block';
            if(loadMoreButton) loadMoreButton.style.display = 'none'; 
            setTimeout(() => loadMoreAllPoems(container, indicator, loadMoreButton), 300); 
        });
        container.insertAdjacentElement('afterend', loadMoreButton);
    }
    console.log("All Poems page display initialized.");
}