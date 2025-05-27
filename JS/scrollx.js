const stickySections = [...document.querySelectorAll('.sticky')];

window.addEventListener('scroll', () => {
    for (let i = 0; i < stickySections.length; i++) {
        transform(stickySections[i]);
    }
});

function transform(section) {
    const offsetTop = section.parentElement.offsetTop;
    const scrollSection = section.querySelector('.scroll-section');

    // Total scrollable distance in vw
    const maxTranslate = scrollSection.scrollWidth - window.innerWidth;
    const totalScrollableHeight = section.parentElement.offsetHeight - window.innerHeight;

    let percentage = (window.scrollY - offsetTop) / totalScrollableHeight;
    percentage = Math.max(0, Math.min(percentage, 1));

    const translateX = -percentage * maxTranslate;

    scrollSection.style.transform = `translate3d(${translateX}px, 0, 0)`;
}
