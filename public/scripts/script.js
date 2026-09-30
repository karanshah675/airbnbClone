gsap.registerPlugin(ScrollTrigger);
gsap.from(".image-ovelay", {
  x: 150,
  duration: 1,
  // delay:1
});
gsap.to(".brand-name", {
  rotation: -5,
  duration: 1,
  delay: 1,
});
gsap.from(".navbar-airbnb", {
  y: -100,
  duration: 0.5,
});
gsap.fromTo(
  ".navbar-airbnb",
  {
    borderRadius: "0px",
  },
  {
    y: 30,
    borderRadius: "50px",
    margin: "20px",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "300px top",
      scrub: true,
    },
  },
);
// document.querySelector(".cont").addEventListener("mousemove", (e) => {
//   gsap.to(".dot", {
//     x: e.clientX,
//     y: e.clientY,
//   });
//   console.log(e);
// });
// let dot = document.querySelector(".dot");
// document.querySelector(".outline-text").addEventListener("mousemove", (e) => {
//   dot.style.zIndex = 1;
// });
