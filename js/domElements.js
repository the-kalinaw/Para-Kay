// js/domElements.js

// --- General Elements ---
export const htmlElement = document.documentElement;
export const bodyElement = document.body;

// --- Theme Toggle Buttons (one per page, or use a common class if they become identical) ---
export const themeToggleButtonIndex = document.getElementById('theme-toggle-button');
export const themeToggleButtonAllPoems = document.getElementById('theme-toggle-button-all-poems');

// --- Off-Canvas Menu Elements (Index Page) ---
export const offcanvasMenuIndex = document.getElementById('offcanvas-menu');
export const closeOffcanvasMenuButtonIndex = document.getElementById('close-offcanvas-menu-button');
export const hamburgerMenuButtonIndex = document.getElementById('hamburger-menu-button');

// --- Off-Canvas Menu Elements (All Poems Page) ---
export const offcanvasMenuAllPoems = document.getElementById('offcanvas-menu-all-poems');
export const closeOffcanvasMenuButtonAllPoems = document.getElementById('close-offcanvas-menu-button-all-poems');
export const hamburgerMenuButtonAllPoems = document.getElementById('hamburger-menu-button-all-poems');

// --- Header Elements (Index Page) ---
export const mainHeader = document.getElementById('main-header');
export const categoryNav = document.getElementById('category-nav'); // The <nav> element itself
export const searchArea = categoryNav ? categoryNav.querySelector('.search-area') : null; // The div wrapping search icon and bar
export const searchIconButton = document.getElementById('search-icon-button');
export const searchBarContainer = document.getElementById('search-bar-container');
export const searchInput = document.getElementById('search-input');
export const searchSubmitButton = document.getElementById('search-submit-button');
export const siteTitleContainer = document.getElementById('site-title-container');

// --- Gallery Containers (Index Page) ---
export const recentGalleryContainer = document.getElementById('recent-gallery-container');
export const favoritesGalleryContainer = document.getElementById('favorites-gallery-container');
export const monthlyGalleryContainer = document.getElementById('monthly-gallery-container');

// --- Monthly Archive Controls (Index Page) ---
export const yearSelect = document.getElementById('year-select');
export const monthSelect = document.getElementById('month-select');
export const viewMonthButton = document.getElementById('view-month-button');

// --- "All Poems" Link (Index Page) ---
export const viewAllPoemsButton = document.getElementById('view-all-poems-button');

// --- Footer Elements (Index Page) ---
export const currentYearSpan = document.getElementById('current-year');


// --- Elements specific to all-poems.html ---
// export const allPoemsHeader = document.getElementById('all-poems-header'); // This ID wasn't in the final HTML, it was just buttons
export const allPoemsPageTitleHeader = document.querySelector('body.all-poems-page .page-specific-title-header');
export const allPoemsGalleryContainerPage = document.getElementById('all-poems-gallery-container'); 
export const loadingIndicator = document.getElementById('loading-indicator');
export const backHomeButton = document.querySelector('body.all-poems-page .back-home-button.bottom-left-fixed');
export const currentYearSpanAllPoems = document.getElementById('current-year-all-poems'); // If you add a footer back

// --- Elements specific to search.html ---
export const searchPageHeader = document.getElementById('search-page-header');
export const searchResultsMainTitle = document.getElementById('search-results-main-title'); // Corrected ID
export const searchPageInputOnPage = document.getElementById('search-page-input');
export const searchPageSubmitButtonOnPage = document.getElementById('search-page-submit-button');
export const searchResultsGalleryContainer = document.getElementById('search-results-gallery-container');
export const noResultsMessage = document.getElementById('no-results-message');
export const searchInputInNav = document.getElementById('search-input'); 
export const searchSubmitButtonInNav = document.getElementById('search-submit-button');

// --- Modal Elements (Common, assuming same IDs are used in both HTML files) ---
export const storyModal = document.getElementById('story-modal');
export const modalCloseButton = storyModal ? storyModal.querySelector('.close-button') : null;
export const modalMediaContainer = storyModal ? storyModal.querySelector('.modal-media-container') : null;
export const modalPoemTitle = storyModal ? storyModal.querySelector('#modal-poem-title') : null;
export const modalSongTitleArtist = storyModal ? storyModal.querySelector('#modal-song-title-artist') : null;
export const modalSongLinks = storyModal ? storyModal.querySelector('#modal-song-links') : null;
export const modalDatePosted = storyModal ? storyModal.querySelector('#modal-date-posted') : null;