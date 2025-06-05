// js/modal.js
import { 
    storyModal, 
    modalCloseButton, 
    modalMediaContainer, 
    modalPoemTitle, 
    modalSongTitleArtist, 
    modalSongLinks, 
    modalDatePosted,
    bodyElement // For disabling scroll
} from './domElements.js';

const MODAL_ACTIVE_CLASS = 'active';
const BODY_MODAL_OPEN_CLASS = 'modal-is-open'; // Similar to menu, for body styling

let currentOpenStory = null; // To keep track of which story data is in the modal

// Function to populate and open the modal
export function openModalWithStory(storyData) {
    if (!storyModal || !storyData) return;

    currentOpenStory = storyData; // Store the current story

    // 1. Clear previous media
    if (modalMediaContainer) modalMediaContainer.innerHTML = ''; 

    // 2. Load new media
    if (modalMediaContainer) {
        if (storyData.media_type === "video") {
            const video = document.createElement('video');
            video.src = storyData.media_path;
            video.controls = true;
            video.autoplay = true; // Autoplay when modal opens
            video.muted = false;   // Ensure sound can play
            video.setAttribute('preload', 'auto');
            modalMediaContainer.appendChild(video);
        } else { // Assume image
            const img = document.createElement('img');
            img.src = storyData.media_path;
            img.alt = `Story media for: ${storyData.poem_title || 'poem'}`;
            modalMediaContainer.appendChild(img);
        }
    }

    // 3. Populate text content
    if (modalPoemTitle) modalPoemTitle.textContent = storyData.poem_title || "Untitled Poem";
    
    let songInfoText = "";
    if (storyData.song_title && storyData.song_artist) {
        songInfoText = `${storyData.song_title} by ${storyData.song_artist}`;
    } else if (storyData.song_title) {
        songInfoText = storyData.song_title;
    }
    if (modalSongTitleArtist) modalSongTitleArtist.textContent = songInfoText;

    if (modalSongLinks) {
        modalSongLinks.innerHTML = ''; // Clear previous links
        if (storyData.song_link_spotify) {
            const spotifyLink = document.createElement('a');
            spotifyLink.href = storyData.song_link_spotify;
            spotifyLink.target = "_blank";
            spotifyLink.rel = "noopener noreferrer"; // Security best practice
            spotifyLink.textContent = "Listen on Spotify";
            modalSongLinks.appendChild(spotifyLink);
        }
        if (storyData.song_link_youtube) {
            const youtubeLink = document.createElement('a');
            youtubeLink.href = storyData.song_link_youtube;
            youtubeLink.target = "_blank";
            youtubeLink.rel = "noopener noreferrer";
            youtubeLink.textContent = "Listen on YouTube";
            modalSongLinks.appendChild(youtubeLink);
        }
        // Add more links (Apple Music, etc.) if you add them to your data
    }

    if (modalDatePosted) modalDatePosted.textContent = storyData.date_posted || "N/A";

    // 4. Show the modal
    storyModal.classList.add(MODAL_ACTIVE_CLASS);
    bodyElement.classList.add(BODY_MODAL_OPEN_CLASS);
    bodyElement.style.overflow = 'hidden'; // Prevent background scrolling

    // Accessibility: Focus the modal or its close button
    if(modalCloseButton) modalCloseButton.focus();
    // console.log("Modal opened with story ID:", storyData.id);
}

// Function to close the modal
export function closeModal() {
    if (!storyModal || !storyModal.classList.contains(MODAL_ACTIVE_CLASS)) return;

    const videoInModal = modalMediaContainer ? modalMediaContainer.querySelector('video') : null;
    if (videoInModal) {
        videoInModal.pause(); 
        videoInModal.currentTime = 0; // Reset video
        videoInModal.src = ""; // Detach source to stop potential background loading/sound
        videoInModal.load(); // Necessary after changing src to stop requests
    }
    
    storyModal.classList.remove(MODAL_ACTIVE_CLASS);
    bodyElement.classList.remove(BODY_MODAL_OPEN_CLASS);
    bodyElement.style.overflow = ''; 
    currentOpenStory = null; // Clear current story
    // console.log("Modal closed");
}

// Initialize event listeners for closing the modal
export function initializeModal() {
    if (storyModal && modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);

        // Close if clicked on the modal background (overlay)
        storyModal.addEventListener('click', (event) => {
            // Check if the click is directly on the modal overlay (the .modal element)
            // or on the .modal-content-wrapper which acts as the centering container.
            if (event.target === storyModal || event.target === storyModal.querySelector('.modal-content-wrapper')) {
                 closeModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && storyModal.classList.contains(MODAL_ACTIVE_CLASS)) {
                closeModal();
            }
        });
        console.log("Modal system initialized.");
    } else {
        // console.warn("Modal elements (modal container or close button) not found. Modal functionality may be limited.");
    }
}