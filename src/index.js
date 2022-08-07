import './css/main.css';
import Notiflix from 'notiflix';
import { fetchPicture } from './fetchPictures';

// fetchPicture('cat').then(data => {
//   console.log(data.data);
// });
let page = 1;
const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('input'),
  searchBtn: document.querySelector('button[type="submit"]'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// console.log(refs.searchForm);

function onFormSubmited(event) {
  event.preventDefault();
  const inputValue = refs.searchInput.value.trim();
  fetchPicture(inputValue, page).then(data => {
    refs.galleryContainer.insertAdjacentHTML(
      'afterbegin',
      buildCards(data.data.hits)
    );
  });
}

function onLoadMore() {
  page += 1;
  const inputValue = refs.searchInput.value.trim();
  fetchPicture(inputValue, page).then(data => {
    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      buildCards(data.data.hits)
    );
  });
}

function buildCards(pictures) {
  const markup = pictures
    .map(
      picture => `
  <div class="photo-card">
  <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
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

refs.searchForm.addEventListener('submit', onFormSubmited);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
