// js/gallery.js
import { storiesData } from './data.js';
import { 
    recentGalleryContainer, 
    favoritesGalleryContainer,
    yearSelect,                 
    monthSelect,                
    viewMonthButton,            
    monthlyGalleryContainer 
} from './domElements.js'; 
import { openModalWithStory } from './modal.js'; // IMPORT the actual modal function

// Helper to create a single gallery item DOM element
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

    // Add click listener to open modal
    item.addEventListener('click', () => {
        // console.log("Gallery item clicked, ID:", story.id);
        openModalWithStory(story); // CALL the imported function
    });

    return item;
}

export function displayRecentStories() {
    // ... (rest of the function is the same) ...
    if (!recentGalleryContainer) return;
    recentGalleryContainer.innerHTML = ''; 

    const sortedStories = [...storiesData].sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    const recentStories = sortedStories.slice(0, 3);

    if (recentStories.length === 0) {
        recentGalleryContainer.innerHTML = "<p>No recent poems to display.</p>";
        return;
    }
    recentStories.forEach(story => {
        recentGalleryContainer.appendChild(createStoryElement(story));
    });
    // console.log("Recent stories displayed.");
}

export function displayFavoriteStories(showAll = false) { // Add a parameter
    if (!favoritesGalleryContainer) return;
    favoritesGalleryContainer.innerHTML = ''; 

    const favoriteStories = storiesData
        .filter(story => story.is_favorite)
        .sort((a, b) => (a.favorite_rank || 999) - (b.favorite_rank || 999)); // Sort by rank

    const storiesToDisplay = showAll ? favoriteStories : favoriteStories.slice(0, 9); // Show 6 by default, or all

    if (storiesToDisplay.length === 0) {
        favoritesGalleryContainer.innerHTML = "<p class='gallery-placeholder-message'>No favorite poems to display yet.</p>";
        // Hide "View All Favorites" button if it exists
        const viewAllFavsBtn = document.getElementById('view-all-favorites-button');
        if(viewAllFavsBtn) viewAllFavsBtn.style.display = 'none';
        return;
    }

    storiesToDisplay.forEach(story => {
        favoritesGalleryContainer.appendChild(createStoryElement(story));
    });

    // Manage "View All Favorites" button visibility
    const viewAllFavsBtn = document.getElementById('view-all-favorites-button');
    if (viewAllFavsBtn) {
        if (showAll || favoriteStories.length <= 6) {
            viewAllFavsBtn.style.display = 'none'; // Hide if all shown or not enough to need it
        } else {
            viewAllFavsBtn.style.display = 'inline-block'; // Or 'block' depending on styling
        }
    }
    // console.log(showAll ? "All favorite stories displayed." : "Top favorite stories displayed.");
}

/////////////////////////////////////////
/////////// Monthly Archive //////////// 
////////////////////////////////////////

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function populateYearSelect() {
    if (!yearSelect) return;
    const years = [...new Set(storiesData.map(story => new Date(story.date_posted).getFullYear()))].sort((a,b) => b - a); // Newest first
    
    yearSelect.innerHTML = '<option value="">Select Year</option>'; // Default option
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

function populateMonthSelect(selectedYear) {
    if (!monthSelect || !selectedYear) {
        if(monthSelect) monthSelect.innerHTML = '<option value="">Select Month</option>';
        if(monthSelect) monthSelect.disabled = true;
        return;
    }

    const monthsInYear = [...new Set(
        storiesData
            .filter(story => new Date(story.date_posted).getFullYear() === parseInt(selectedYear))
            .map(story => new Date(story.date_posted).getMonth()) // 0 for Jan, 11 for Dec
    )].sort((a,b) => a - b); // Sort numerically (Jan first)

    monthSelect.innerHTML = '<option value="">Select Month</option>';
    if (monthsInYear.length > 0) {
        monthsInYear.forEach(monthIndex => {
            const option = document.createElement('option');
            option.value = monthIndex + 1; // Store as 1-12 for easier matching later
            option.textContent = monthNames[monthIndex];
            monthSelect.appendChild(option);
        });
        monthSelect.disabled = false;
    } else {
        monthSelect.disabled = true;
    }
}

function displayMonthlyStories() {
    if (!monthlyGalleryContainer || !yearSelect || !monthSelect) return;

    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = parseInt(monthSelect.value); // This will be 1-12

    if (!selectedYear || !selectedMonth) {
        monthlyGalleryContainer.innerHTML = "<p>Please select a year and month to view poems.</p>";
        return;
    }

    monthlyGalleryContainer.innerHTML = ''; // Clear previous

    const filteredStories = storiesData.filter(story => {
        const storyDate = new Date(story.date_posted);
        return storyDate.getFullYear() === selectedYear && (storyDate.getMonth() + 1) === selectedMonth;
    }).sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted)); // Newest first within month

    if (filteredStories.length === 0) {
        monthlyGalleryContainer.innerHTML = `<p>No poems found for ${monthNames[selectedMonth - 1]} ${selectedYear}.</p>`;
        return;
    }

    filteredStories.forEach(story => {
        monthlyGalleryContainer.appendChild(createStoryElement(story));
    });
    // console.log(`Displayed poems for ${monthNames[selectedMonth-1]} ${selectedYear}`);
}


export function initializeMonthlyArchive() {
    if (!yearSelect || !monthSelect || !viewMonthButton || !monthlyGalleryContainer) { // Added monthlyGalleryContainer to check
        console.warn("Monthly archive DOM elements not all found. Archive functionality disabled for this page.");
        return; // Exit if any crucial element is missing
    }

    populateYearSelect();
    populateMonthSelect(null); // Initially no year selected, so months disabled

    yearSelect.addEventListener('change', (event) => {
        populateMonthSelect(event.target.value);
        if(monthlyGalleryContainer) monthlyGalleryContainer.innerHTML = "<p>Select a month to view poems.</p>"; // Clear results when year changes
    });

    viewMonthButton.addEventListener('click', displayMonthlyStories);
    
    console.log("Monthly archive system initialized.");
}