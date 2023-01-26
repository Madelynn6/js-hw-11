import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getData = async (output) => {
	const response = await axios.get(
		`https://pixabay.com/api/?key=33147468-be6e810c2e40f64bef77a2416&q=${output}&image-type=photo&orientation=horizontal&safesearch=true`);
    return response.data;
};


const form = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');

function handleSubmit(e) {
    e.preventDefault();
    const name = e.target[0].value;
    console.log(name)
    getData(name)
      .then(data => {
        if(data.hits.length===0){
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } 
        else if(data.hits.length>0){
            renderGallery(data)
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
    })
      .catch(error => console.error(error));
}

form.addEventListener('submit', handleSubmit);


function clearHTML(){
    galleryBox.innerHTML='';
}

function renderGallery(data){
    clearHTML();
    const galleryMarkup = data['hits']
    .map((el) => {
        return `
        <div class="photo-card">
      <img src="${el.previewURL}" alt="${el.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${el.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${el.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${el.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${el.downloads}
        </p>
      </div>
    </div>
        `;
    })
    .join("");
    galleryBox.innerHTML = galleryMarkup;
    }



