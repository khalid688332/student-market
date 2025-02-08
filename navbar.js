document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger")
    const navLinks = document.getElementById("nav_links")
  
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      animateHamburger()
    })
  
    function animateHamburger() {
      const spans = hamburger.querySelectorAll("span")
      spans.forEach((span, index) => {
        if (navLinks.classList.contains("active")) {
          if (index === 0) {
            span.style.transform = "rotate(-45deg) translate(-5px, 6px)"
          } else if (index === 1) {
            span.style.opacity = "0"
          } else if (index === 2) {
            span.style.transform = "rotate(45deg) translate(-5px, -6px)"
          }
        } else {
          span.style.transform = "none"
          span.style.opacity = "1"
        }
      })
    }
  
    document.addEventListener("click", (event) => {
      const isClickInside = navLinks.contains(event.target) || hamburger.contains(event.target)
      if (!isClickInside && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active")
        animateHamburger()
      }
    })
  })
  
  