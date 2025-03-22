const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const carouselTrack = document.querySelector('.carousel-track');

console.log('accessing this shit')
const token = localStorage.getItem("token")

if(!token){
    setTimeout(() => {
        window.location.href = "../pages/login.html"; 
    }, 2000);
}
prevBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -200, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: 200, behavior: 'smooth' });
});
