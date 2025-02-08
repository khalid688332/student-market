let currentUserId = JSON.parse(localStorage.getItem("CurrentUser"))

let logoutBtn = document.getElementById("logout_btn")
let showMyPosts = document.getElementById("showMyPosts")

async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut()
        checkCurrentPage()
    } catch (error) {
        console.log(error)
    }
}
logoutBtn.addEventListener("click", logoutUser)


async function deletePost(postId) {
    try {
        Swal.fire({
            title: "Are you sure?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data, error } = await supabase
                    .from("Posts")
                    .delete()
                    .eq("id", postId)
                    .select();

                if (error) throw error;

                try {
                    const { data : SavedPostDeleteData, error : SavedPostDeleteError } = await supabase
                        .from('SavedPosts')
                        .delete()
                        .eq('PostId', postId)
                        .select()
                    if(SavedPostDeleteError) throw SavedPostDeleteError

                } catch (error) {
                    console.log(error)
                }
                if (data) {
                    
                    location.reload()

                }



            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function showAllMyPosts() {
    try {
        const { data, error } = await supabase.from("Posts").select();
        if (error) throw error;

        let hasPosts = false;
        if (data && data.length > 0) {
            for (const item of data) {
                if (item.UserId == currentUserId.id) {
                    hasPosts = true;
                    try {
                        const { data: UserNameData, error: UserNameError } = await supabase
                            .from("Users")
                            .select("UserName")
                            .eq("UserId", `${currentUserId.id}`);
                        
                        if (UserNameError) throw UserNameError;

                        if (UserNameData.length > 0) {
                            showMyPosts.innerHTML += `
                                <div class="card">
                                    <div class="card-header">
                                        <div class="user-info">
                                            <span class="username">${UserNameData[0].UserName}</span>
                                            <span class="date">${item.created_at.slice(0, 10)}</span>
                                        </div>
                                        <div class="save-icon">
                                            <i onclick="deletePost(${item.id})" class="fa-solid fa-trash"></i>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <img class="product-image" src="${item.PostImageURL}" alt="Product Image"> 
                                        <div class="product-description"><b>${item.PostContent}</b></div>
                                        <div class="product-price">${item.Price}$</div>
                                        <button class="buy-button" onclick="deletePost(${item.id})">Delete</button>
                                    </div>
                                </div>
                            `;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        if (!hasPosts) {
            showMyPosts.innerHTML = `<p>No Post Found!</p>`;
        }

    } catch (error) {
        console.log(error);
    }
}



let SavedPosts = document.getElementById("Saved")
function MoveToSavedPosts() {
    window.location.href = "saved.html"
}
if (SavedPosts) {
    SavedPosts.addEventListener("click", MoveToSavedPosts)
}



let home = document.getElementById("Home")
function GoToHomePage() {
    window.location.href = "dashboard.html"
}
if (home) {
    home.addEventListener("click", GoToHomePage)
}

window.onload = showAllMyPosts()


window.deletePost = deletePost;