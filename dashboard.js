let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let company = document.getElementById("company");
let address = document.getElementById("address");
let email = document.getElementById("email");
let addUserBtn = document.getElementById("AddUserBtn");
let userTable = document.getElementById("UserTable");
let logoutBtn = document.getElementById("logout_btn")
let postContent = document.getElementById("postContent")
let postImage = document.getElementById("postImage")
let price = document.getElementById("price")
let postButton = document.getElementById("postButton")
let currentUserId = JSON.parse(localStorage.getItem("CurrentUser"))
let showAllPosts = document.getElementById("showAllPosts")
let desc = document.getElementById("desc")
let previewBtn = document.getElementById("previewButton")
let previewarea = document.getElementById("previewarea")

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (addUserBtn) {
    addUserBtn.addEventListener("click", addUser)
}
logoutBtn.addEventListener("click", logoutUser)
window.onload = checkCurrentPage()


async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut()
        checkCurrentPage()
    } catch (error) {
        console.log(error)
    }
}



// Post Image Function
async function userPost() {
    if (postContent.value.trim() === "" || postImage.value === "" || price.value.trim() === "" || desc.value.trim() === "") {
        Swal.fire({
            title: "Invalid Input",
            text: "Please fill in all fields",
            icon: "question",
        });
    }
    else {
        try {
            const { data, error } = await supabase
                .from('Posts')
                .insert({
                    UserId: currentUserId.id,
                    PostContent: postContent.value,
                    Price: price.value,
                    Status: "Available"
                })
                .select()
            if (error) throw error
            if (data) {
                if (postImage.files.length > 0) {
                    let currentImage = postImage.files[0]
                    try {
                        const { data: StoreImageData, error: StoreImageError } = await supabase
                            .storage
                            .from('Posts')
                            .upload(`${data[0].id}`, currentImage, {
                                cacheControl: '3600',
                                upsert: false
                            })
                        if (StoreImageError) throw error
                        if (StoreImageData) {
                            try {
                                const { data: ImageURLData } = supabase
                                    .storage
                                    .from('Posts')
                                    .getPublicUrl(StoreImageData.path)
                                if (error) throw error
                                if (ImageURLData) {
                                    try {
                                        const { data: UpdateURLData, error: UpdateURLError } = await supabase
                                            .from('Posts')
                                            .update({ PostImageURL: ImageURLData.publicUrl })
                                            .eq("id", `${data[0].id}`)
                                            .select()
                                        if (UpdateURLError) throw error
                                        if (UpdateURLData) {
                                            showPosts()
                                            postContent.value = ""
                                            postImage.value = ""
                                            price.value = ""
                                            desc.value = ""
                                        }
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }

                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    showPosts()
                    postContent.value = ""
                    postImage.value = ""
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}
if (postButton) {
    postButton.addEventListener("click", userPost)
}

let savedIcon = document.getElementById("savedIcon")
async function SavePost(postUserName, postPrice, postTitle, ImageURL, postCreatedAt, logInUserId, postID) {
    console.log(postUserName)
    console.log(postPrice)
    console.log(postTitle)
    console.log(ImageURL)
    console.log(postCreatedAt)
    console.log(logInUserId)
    console.log(postID)
    try {
        const { data, error } = await supabase
            .from('SavedPosts')
            .insert({
                UserId: logInUserId,
                title: postTitle,
                Price: postPrice,
                PostUserName: postUserName,
                ImageURL: ImageURL,
                PostCreatedAt: postCreatedAt,
                PostId: postID
            })
            .select()
        if (error) throw error
        if (data) {
            Swal.fire({
                title: "Post Saved",
                icon: "success",
                draggable: true
            });
        }

    } catch (error) {
        console.log(error)
    }
}


async function Buy(crntUserID, crntPostUserID, itemStatus, PostID) {
    if (crntUserID === crntPostUserID) {
        Swal.fire({
            icon: "error",
            title: "Can not buy own items",
        });
    }
    else {
        if (itemStatus === "Sold ") {
            Swal.fire("Item is Sold");
        } else {
            Swal.fire({
                title: "Confirm Purchase?",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Item Purchased",
                        icon: "success",
                        draggable: true
                    });
                    try {
                        const { data, error } = await supabase
                            .from('Posts')
                            .update({ Status: 'Sold' })
                            .eq('id', PostID)
                            .select()
                        if (error) throw error
                        if (data) {
                            setTimeout(() => {
                                location.reload()
                            }, 1000)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        }
    }

}

async function showPosts() {
    try {
        const { data, error } = await supabase
            .from('Posts')
            .select()
        if (error) throw error
        if (data) {
            if (showAllPosts) {
                showAllPosts.innerHTML = ""
                data.map(async (item) => {
                    let getUserId = item.UserId

                    try {
                        const { data: postUserNameData, error: postUserNameError } = await supabase
                            .from('Users')
                            .select('UserName')
                            .eq('UserId', `${getUserId}`)
                        if (postUserNameError) throw postUserNameError
                        if (postUserNameData) {
                            showAllPosts.innerHTML += `
                            <div class="card">
                                <div class="card-header">
                                    <div class="user-info">
                                        <span class="username">${postUserNameData[0].UserName}</span>
                                        <span class="date">${item.created_at.slice(0, 10)}</span>
                                    </div>
                                    <div class="save-icon">
                                        <i onclick="SavePost('${postUserNameData[0].UserName}', '${item.Price}', '${item.PostContent}', '${item.PostImageURL}', '${item.created_at.slice(0, 10)}', '${currentUserId.id}', '${item.id}')" id="savedIcon" class="fa-regular fa-bookmark"></i>
                                    </div>
                                </div>

                                <div class="card-body">
                                    <img class="product-image" src="${item.PostImageURL}" alt="Product Image"> 
                                    <div class="product-description"><b>${item.PostContent}</b></div>
                                    <div class="product-price">${item.Price}$</div>
                                    <button class="buy-button" onclick="Buy('${item.UserId}', '${currentUserId.id}', '${item.Status}', '${item.id}')">Buy</button>
                                </div>
                            </div>
                        `;


                        }



                    } catch (error) {
                        console.log(error)
                    }
                })
            }
        }

    } catch (error) {
        console.log(error)
    }

}

window.onload = showPosts()


let MyPosts = document.getElementById("MyPosts")
function MoveToMyPosts() {
    window.location.href = "MyPosts.html"
}
if (MyPosts) {
    MyPosts.addEventListener("click", MoveToMyPosts)
}

function MoveToSavedPosts() {
    window.location.href = "saved.html"
}
let SavedPosts = document.getElementById("Saved")
if (SavedPosts) {
    SavedPosts.addEventListener("click", MoveToSavedPosts)
}


function MoveToAddPosts() {
    window.location.href = "addpost.html"
}
let addPosts = document.getElementById("AddPost")
if (addPosts) {
    addPosts.addEventListener("click", MoveToAddPosts)
}





let home = document.getElementById("Home")
function GoToHomePage() {
    window.location.href = "dashboard.html"
}
if (home) {
    home.addEventListener("click", GoToHomePage)
}




function preview() {
    if (postContent.value.trim() === "" || postImage.value === "" || price.value.trim() === "" || desc.value.trim() === "") {
        Swal.fire({
            title: "Invalid Input",
            text: "Please fill in all fields",
            icon: "question",
        });
    } else {
        previewarea.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="user-info">
                        <span class="username">John Doe</span>
                        <span class="date">2025-1-1</span>
                    </div>
                    <div class="save-icon">
                        <i id="savedIcon" class="fa-regular fa-bookmark"></i>
                    </div>
                </div>

                <div class="card-body">
                    <img class="product-image" src="data:image/png;base64,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" alt="Product Image"> 
                    <div class="product-description"><b>${postContent.value}</b></div>
                    <div class="product-price">${price.value}$</div>
                    <button class="buy-button">Buy</button>
                </div>
            </div>
            
        `
    }
}

if (previewBtn) {
    previewBtn.addEventListener("click", preview)
}

window.SavePost = SavePost;
window.Buy = Buy;




