import './css/main.css';
import Notiflix from 'notiflix';
import { fetchPicture } from './fetchPictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// let simpleGallery = new SimpleLightbox('.gallery a');

let page = 1;
let totalPages;

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('input'),
  searchBtn: document.querySelector('button[type="submit"]'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

function onFormSubmited(event) {
  event.preventDefault();
  refs.galleryContainer.innerHTML = '';
  page = 1;
  loadNewPictures();
  refs.loadMoreBtn.style.display = 'block';
}

function onLoadMore() {
  page += 1;
  loadNewPictures();
}

function loadNewPictures() {
  const inputValue = refs.searchInput.value.trim();
  fetchPicture(inputValue, page).then(data => {
    totalPages = data.data.totalHits / 40;

    if (totalPages - page >= -1 && totalPages - page <= 0) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning(
        'We are sorry, but you have reached the end of search results.'
      );
    } else if (data.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (page === 1) {
      Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
    }

    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      buildCards(data.data.hits)
    );
    setTimeout(() => {
      const { height: cardHeight } =
        refs.galleryContainer.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        left: 0,
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }, 550);
    simpleGallery.refresh();
  });
}

function buildCards(pictures) {
  const markup = pictures
    .map(
      picture => `
  <div class="photo-card">
  <a href='${picture.largeImageURL}'><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${picture.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${picture.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${picture.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${picture.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  return markup;
}

var simpleGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onFormSubmited);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
