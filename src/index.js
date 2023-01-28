import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


////// FETCH IMAGES FUNCTION //////
async function fetchImages(value,page) {
  
const BASE_URL = 'https://pixabay.com/api';
const KEY = '33147468-be6e810c2e40f64bef77a2416';

const response = await axios.get(
  `${BASE_URL}?key=${KEY}&q=${value}&image-type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return response.data;
};

////// CREATE IMAGES FUNCTION //////
function createImages(data){
  return data['hits']
  .map((el) => 
      `<div class="photo-card">
      <a href=${el.largeImageURL}>
    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">${el.likes}
        <b>Likes</b>
      </p>
      <p class="info-item">${el.views}
        <b>Views</b>
      </p>
      <p class="info-item">${el.comments}
        <b>Comments</b>
      </p>
      <p class="info-item">${el.downloads}
        <b>Downloads</b>
      </p>
    </div>
  </div>
      `
  )
  .join("");
}

////// QUERYSELECTORS //////
const form = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const input = document.querySelector('input');

////// EVENT LISTENERS //////
form.addEventListener('submit', submitHandler);
loadBtn.addEventListener('click', loadHandler);

////// VARIABLES //////
let searchValue = '';
let currentPage = 1;
let perPage = 40;

////// LIGHTBOX //////
let lightbox = new SimpleLightbox('.gallery a', { 
  captions: true,
  captionsData: 'alt', 
  captionDelay: 250, 
})

////// RESET FUNCTIONS //////
function clearHTML(){
  galleryBox.innerHTML='';
}

function hideBtn(){
  loadBtn.classList.add('hidden')
}

function showBtn(){
  loadBtn.classList.remove('hidden')
}

function resetPage(){
  currentPage = 1;
}

hideBtn();

////// SUBMIT HANDLER //////
async function submitHandler(e){
  e.preventDefault();
  searchValue = input.value.trim();
  resetPage();
  try {
    const result = await fetchImages(searchValue,currentPage);
    if(result.hits.length === 0){
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      clearHTML();
      return;
    }
    if(perPage >= result.totalHits){
      galleryBox.innerHTML = createImages(result);
      lightbox.refresh();
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      hideBtn();
    } else {
      galleryBox.innerHTML = createImages(result);
      lightbox.refresh();
      Notify.success(`Hooray! We found ${result.totalHits} images.`);
      showBtn();
    }
  } catch (err) {
    console.log(err);
  }
}

////// LOAD HANDLER //////
async function loadHandler(){
  currentPage += 1;
  try {
  const result = await fetchImages(searchValue,currentPage);
  galleryBox.insertAdjacentHTML('beforeend', createImages(result));
  lightbox.refresh();
  perPage += result.hits.length;

  if(perPage === result.totalHits){
    hideBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  } catch (err) {
    console.log(err);
  }
  }









