let loginEmail = document.getElementById("LogInEmail")
let loginPass = document.getElementById("LogInPass")
let loginBtn = document.getElementById("LogInBtn")
let HomeBtn = document.getElementById("Home");
let MyPosts = document.getElementById("MyPosts");
let Saved = document.getElementById("Saved");
let AddPost = document.getElementById("AddPost");
if (loginBtn) {
    loginBtn.addEventListener("click", logIn)
}

window.addEventListener('scroll', function () {
    const navbarPost = document.getElementById('navbar_post');
    if (window.scrollY > 50) {
        navbarPost.classList.add('scrolled_post');
    } else {
        navbarPost.classList.remove('scrolled_post');
    }
});

async function checkCurrentPage() {
    let currentPath = window.location.pathname
    if (currentPath === "/dashboard.html") {
        HomeBtn.classList.add("active");
    } else if (currentPath === "/MyPosts.html") {
        MyPosts.classList.add("active");
    } else if (currentPath === "/saved.html") {
        Saved.classList.add("active");
    } else if (currentPath === "/addpost.html") {
        AddPost.classList.add("active");
    }
    try {
        const { data, error } = await supabase.auth.getSession();
        const { session } = data
        let arrayOfPages = ["/", "/index.html", "/login.html"]
        let userCurrentPage = arrayOfPages.includes(currentPath)
        if (session) {
            if (userCurrentPage) {
                window.location.href = "/dashboard.html"
            }
        } else {
            if (!userCurrentPage) {
                window.location.href = "/login.html"
            }
        }
    } catch (error) {
        console.log(error)
    }
}
window.checkCurrentPage = checkCurrentPage
window.onload = checkCurrentPage()
async function logIn() {
    if (loginEmail.value.trim() === "" || loginPass.value.trim() === "") {
        Swal.fire({
            title: "Invalid Input",
            text: "Please fill in all fields",
            icon: "question",
        });
    }
    else {
        try {

            let { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail.value,
                password: loginPass.value
            })

            if (error) {
                Swal.fire(error.message)
            } 
            if (data) {
                localStorage.setItem("CurrentUser" , JSON.stringify(data.user))
                window.location.href = "./dashboard.html"
            }

        
        } catch (error) {
            console.log(error)
        }
        finally {
            loginEmail.value = ""
            loginPass.value = ""

        }


    }


}
