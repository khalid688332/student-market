document.addEventListener("DOMContentLoaded", () => {
    const hamburgerPost = document.getElementById("hamburger_post")
    const navLinksPost = document.getElementById("nav_links_post")
  
    hamburgerPost.addEventListener("click", () => {
    navLinksPost.classList.toggle("active")
      animateHamburger()
    })
  
    function animateHamburger() {
      const spans = hamburgerPost.querySelectorAll("span")
      spans.forEach((span, index) => {
        if (navLinksPost.classList.contains("active")) {
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
      const isClickInside = navLinksPost.contains(event.target) || hamburgerPost.contains(event.target)
      if (!isClickInside && navLinksPost.classList.contains("active")) {
        navLinksPost.classList.remove("active")
        animateHamburger()
      }
    })
  })
  
  