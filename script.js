const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = []; /* using let instead of const as the photosArray will be changing */ 


// Unslash Api
const count = 10; 
const apiKey = '0ZMSJUg5QLK_lszMhWgw49m5TvcQ__aFjGcfwoWdDSU';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Helper Function to set the attributes on DOM elements without having to write item.setAttribute and im.attribute multiple times as greyed out in the displayPhotos() function.
function setAttributes(element, attributes) {
    for (const key in attributes) {           /* key here refers to examples: href, target, src, alt, and title from in the .setattributes par of greyed out code within displayPhotos */
        element.setAttribute(key, attributes[key]);
    }
}

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true; /* Sets the hidden attribute to the loader to tru so that after images have loaded it will be hidden */
    }
}

// create Elements for Links & Photos and  Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    //Run function for each object in photosArray
    photosArray.forEach((photo) => {
        // create <a> to link to unsplash
        const item = document.createElement('a'); /* will create a blank anchor element*/
        setAttributes(item, {
            href:photo.links.html,    // item.setAttribute('href', photo.links.html);
            target: '_blank',         // item.setAttribute('target', '_blank');
        });
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,        // img.setAttribute('src', photo.urls.regular);
            alt: photo.alt_description,     // img.setAttribute('alt', photo.alt_description);   
            title: photo.alt_description,   // img.setAttribute('title', photo.alt_description);
        });
        // Event Listener to check when each img has finished loading
        img.addEventListener('load', imageLoaded);    
        //Put <img> inside the <a> then put both inside the imageContainer Element
        item.appendChild(img); /* puts img into the item */ 
        imageContainer.appendChild(item); /* puts the item into the imageContainer element */
    });
}

// Get Photos from Unsplash Api but we will still need to place them into the container with its attributes by creating a displayPhotos() function
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        // Catch Error
    }
}

// Check to see if the scrolling is near the bottom of the page. Load more photos if it is:
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;  /* set tofalse again to reset the process of it being ready*/
        getPhotos();
    }
});

// On Load
getPhotos();