gsap.registerPlugin(ScrollTrigger);
gsap.from(".image-ovelay", {
  x: 150,
  duration: 1,
  // delay:1
});
gsap.to(".brand-name", {
  rotation: -5,
  duration: 1,
  delay:1
});
gsap.fromTo(".navbar", {
  y: -100,
  // delay:1
},
{
    y:0,
    duration: 0.5,
});
gsap.fromTo(
  ".navbar",
  {
    borderRadius: "0px"
  },
  {
    y:30,
    borderRadius: "50px",
    margin:"20px",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "300px top",
      scrub: true
    }
  }
);