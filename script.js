const images = [

    {
        id: 1,
        title: "Mountain Landscape",
        category: "nature",
        url: "https://picsum.photos/id/1018/800/600"
    },

    {
        id: 2,
        title: "Beautiful Forest",
        category: "nature",
        url: "https://picsum.photos/id/1015/800/600"
    },

    {
        id: 3,
        title: "City Buildings",
        category: "city",
        url: "https://picsum.photos/id/1031/800/600"
    },

    {
        id: 4,
        title: "City Street",
        category: "city",
        url: "https://picsum.photos/id/1043/800/600"
    },

    {
        id: 5,
        title: "Wild Animal",
        category: "animals",
        url: "https://picsum.photos/id/1025/800/600"
    },

    {
        id: 6,
        title: "Cute Dog",
        category: "animals",
        url: "https://picsum.photos/id/237/800/600"
    },

    {
        id: 7,
        title: "Travel Destination",
        category: "travel",
        url: "https://picsum.photos/id/1036/800/600"
    },

    {
        id: 8,
        title: "Beautiful Beach",
        category: "travel",
        url: "https://picsum.photos/id/1011/800/600"
    },

    {
        id: 9,
        title: "Green Valley",
        category: "nature",
        url: "https://picsum.photos/id/1020/800/600"
    },

    {
        id: 10,
        title: "Modern Architecture",
        category: "city",
        url: "https://picsum.photos/id/1067/800/600"
    },

    {
        id: 11,
        title: "Wildlife",
        category: "animals",
        url: "https://picsum.photos/id/1074/800/600"
    },

    {
        id: 12,
        title: "Island Travel",
        category: "travel",
        url: "https://picsum.photos/id/1056/800/600"
    }

];




const gallery = document.getElementById("gallery");

const searchInput =
    document.getElementById("search");

const categorySelect =
    document.getElementById("category");

const emptyState =
    document.getElementById("emptyState");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const closeBtn =
    document.getElementById("closeBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");



let filteredImages = [...images];

let currentIndex = 0;




let favorites =
    JSON.parse(
        localStorage.getItem("galleryFavorites")
    ) || [];



function renderGallery() {

    gallery.innerHTML = "";

    if (filteredImages.length === 0) {

        emptyState.classList.add("show");

        return;
    }

    emptyState.classList.remove("show");


    filteredImages.forEach((image, index) => {

        const isFavorite =
            favorites.includes(image.id);

        const card =
            document.createElement("article");

        card.className = "card";


        card.innerHTML = `

            <div class="image-container">

                <img
                    src="${image.url}"
                    alt="${image.title}"
                    loading="lazy"
                    data-index="${index}"
                >

                <button
                    class="favorite-btn
                    ${isFavorite ? "active" : ""}"
                    data-id="${image.id}"
                    aria-label="Favorite ${image.title}"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>

            </div>

            <div class="card-content">

                <h3>
                    ${image.title}
                </h3>

                <p class="category">
                    ${image.category}
                </p>

            </div>
        `;


        gallery.appendChild(card);

    });

}




function filterImages() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categorySelect.value;


    filteredImages =
        images.filter(image => {

            const matchesSearch =
                image.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                image.category === selectedCategory;


            return matchesSearch &&
                   matchesCategory;

        });


    renderGallery();
}


function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";
}



function updateLightbox() {

    const image =
        filteredImages[currentIndex];

    if (!image) {
        return;
    }


    lightboxImage.src =
        image.url;

    lightboxImage.alt =
        image.title;

    lightboxTitle.textContent =
        image.title;
}



function closeLightbox() {

    lightbox.classList.remove("show");

    document.body.style.overflow = "";
}




function showNext() {

    if (filteredImages.length === 0) {
        return;
    }


    currentIndex =
        (currentIndex + 1) %
        filteredImages.length;


    updateLightbox();
}




function showPrevious() {

    if (filteredImages.length === 0) {
        return;
    }


    currentIndex =
        (currentIndex - 1 +
        filteredImages.length) %
        filteredImages.length;


    updateLightbox();
}



function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

    } else {

        favorites.push(id);

    }


    localStorage.setItem(
        "galleryFavorites",
        JSON.stringify(favorites)
    );


    renderGallery();
}




gallery.addEventListener(
    "click",
    function (event) {

        
        const favoriteButton =
            event.target.closest(
                ".favorite-btn"
            );


        if (favoriteButton) {

            const id =
                Number(
                    favoriteButton.dataset.id
                );


            toggleFavorite(id);

            return;
        }



        const image =
            event.target.closest("img");


        if (image) {

            const index =
                Number(
                    image.dataset.index
                );


            openLightbox(index);
        }

    }
);




searchInput.addEventListener(
    "input",
    filterImages
);




categorySelect.addEventListener(
    "change",
    filterImages
);




closeBtn.addEventListener(
    "click",
    closeLightbox
);


nextBtn.addEventListener(
    "click",
    showNext
);


prevBtn.addEventListener(
    "click",
    showPrevious
);




lightbox.addEventListener(
    "click",
    function (event) {

        if (event.target === lightbox) {

            closeLightbox();

        }

    }
);



document.addEventListener(
    "keydown",
    function (event) {

        if (!lightbox.classList.contains("show")) {
            return;
        }


        if (event.key === "Escape") {
            closeLightbox();
        }


        if (event.key === "ArrowRight") {
            showNext();
        }


        if (event.key === "ArrowLeft") {
            showPrevious();
        }

    }
);




renderGallery();

