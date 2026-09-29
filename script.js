const images = [
    {
        id: 1,
        title: "Mountain Landscape",
        category: "nature",
        url: "https://images.unsplash.com/photo-1500534623283-312aade485b7"
    },
    {
        id: 2,
        title: "Beautiful Forest",
        category: "nature",
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b"
    },
    {
        id: 3,
        title: "Wild Tiger",
        category: "animals",
        url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5"
    },
    {
        id: 4,
        title: "Cute Dog",
        category: "animals",
        url: "https://images.unsplash.com/photo-1552053831-71594a27632d"
    },
    {
        id: 5,
        title: "Modern Technology",
        category: "technology",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
        id: 6,
        title: "Laptop Workspace",
        category: "technology",
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
    },
    {
        id: 7,
        title: "Beautiful Beach",
        category: "travel",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },
    {
        id: 8,
        title: "Travel Mountains",
        category: "travel",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    },
    {
        id: 9,
        title: "Delicious Pizza",
        category: "food",
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    },
    {
        id: 10,
        title: "Fresh Food",
        category: "food",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
    },
    {
        id: 11,
        title: "Green Nature",
        category: "nature",
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    },
    {
        id: 12,
        title: "City Technology",
        category: "technology",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"
    }
];

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const resetBtn = document.getElementById("resetBtn");
const imageCount = document.getElementById("imageCount");
const emptyState = document.getElementById("emptyState");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteIcon = document.getElementById("favoriteIcon");
const favoriteText = document.getElementById("favoriteText");

function getFavorites() {
    const savedFavorites = localStorage.getItem("favoriteImages");

    return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(
        "favoriteImages",
        JSON.stringify(favorites)
    );
}

function isFavorite(id) {
    const favorites = getFavorites();

    return favorites.includes(id);
}

function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(
            favoriteId => favoriteId !== id
        );
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
    renderGallery();
    updateLightboxFavorite();
}

function renderGallery() {
    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;

    const filteredImages = images.filter(image => {
        const matchesSearch =
            image.title
                .toLowerCase()
                .includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            image.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    gallery.innerHTML = "";

    if (filteredImages.length === 0) {
        emptyState.classList.remove("hidden");
        imageCount.textContent = "0 images";
        return;
    }

    emptyState.classList.add("hidden");

    imageCount.textContent =
        `${filteredImages.length} ${
            filteredImages.length === 1
                ? "image"
                : "images"
        }`;

    filteredImages.forEach(image => {
        const card = document.createElement("article");

        card.className = "gallery-card";

        card.innerHTML = `
            <div class="image-container" data-id="${image.id}">
                <img
                    src="${image.url}?auto=format&fit=crop&w=800&q=80"
                    alt="${image.title}"
                    loading="lazy"
                >

                <button
                    class="favorite-btn ${
                        isFavorite(image.id)
                            ? "active"
                            : ""
                    }"
                    data-favorite="${image.id}"
                    aria-label="Favorite ${image.title}"
                >
                    ${isFavorite(image.id) ? "♥" : "♡"}
                </button>
            </div>

            <div class="card-info">
                <h3>${image.title}</h3>
                <span class="category">
                    ${image.category}
                </span>
            </div>
        `;

        gallery.appendChild(card);
    });
}

let currentImageIndex = 0;

function openLightbox(id) {
    const index =
        images.findIndex(image => image.id === id);

    if (index === -1) return;

    currentImageIndex = index;

    updateLightbox();

    lightbox.classList.remove("hidden");

    document.body.style.overflow = "hidden";
}

function updateLightbox() {
    const image =
        images[currentImageIndex];

    lightboxImage.src =
        `${image.url}?auto=format&fit=max&w=1200&q=90`;

    lightboxImage.alt =
        image.title;

    lightboxTitle.textContent =
        image.title;

    lightboxCategory.textContent =
        `Category: ${image.category}`;

    updateLightboxFavorite();
}

function updateLightboxFavorite() {
    if (!images[currentImageIndex]) return;

    const image =
        images[currentImageIndex];

    const favorite =
        isFavorite(image.id);

    if (favorite) {
        favoriteIcon.textContent = "♥";
        favoriteText.textContent = "Remove Favorite";
        favoriteBtn.classList.add("active");
    } else {
        favoriteIcon.textContent = "♡";
        favoriteText.textContent = "Favorite";
        favoriteBtn.classList.remove("active");
    }
}

function showNextImage() {
    currentImageIndex++;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    updateLightbox();
}

function showPreviousImage() {
    currentImageIndex--;

    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }

    updateLightbox();
}

function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
}

searchInput.addEventListener(
    "input",
    renderGallery
);

categoryFilter.addEventListener(
    "change",
    renderGallery
);

resetBtn.addEventListener(
    "click",
    () => {
        searchInput.value = "";
        categoryFilter.value = "all";
        renderGallery();
    }
);

gallery.addEventListener(
    "click",
    event => {
        const favoriteButton =
            event.target.closest("[data-favorite]");

        if (favoriteButton) {
            const id =
                Number(
                    favoriteButton.dataset.favorite
                );

            toggleFavorite(id);
            return;
        }

        const imageContainer =
            event.target.closest(".image-container");

        if (imageContainer) {
            const id =
                Number(
                    imageContainer.dataset.id
                );

            openLightbox(id);
        }
    }
);

closeBtn.addEventListener(
    "click",
    closeLightbox
);

nextBtn.addEventListener(
    "click",
    showNextImage
);

prevBtn.addEventListener(
    "click",
    showPreviousImage
);

favoriteBtn.addEventListener(
    "click",
    () => {
        const image =
            images[currentImageIndex];

        toggleFavorite(image.id);
    }
);

lightbox.addEventListener(
    "click",
    event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (lightbox.classList.contains("hidden")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }
    }
);

renderGallery();
