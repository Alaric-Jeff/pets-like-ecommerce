const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const carouselTrack = document.querySelector('.carousel-track');

prevBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -200, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: 200, behavior: 'smooth' });
});
