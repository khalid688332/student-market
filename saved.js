let currentUserId = JSON.parse(localStorage.getItem("CurrentUser"))
let MyPosts = document.getElementById("MyPosts")
function MoveToMyPosts() {
    window.location.href = "MyPosts.html"
}
if (MyPosts) {
    MyPosts.addEventListener("click", MoveToMyPosts)
}

let home = document.getElementById("Home")
function GoToHomePage() {
    window.location.href = "dashboard.html"
}
if (home) {
    home.addEventListener("click", GoToHomePage)
}
let savedIcon = document.getElementById("savedIcon")
async function Unsave(postId) {
    try {
        const { data, error } = await supabase
            .from('SavedPosts')
            .delete()
            .eq('id', postId)
            .select()
        if (error) throw error
        if (data) {
            Swal.fire({
                title: "Post Unsaved",
                icon: "success",
                draggable: true
            });
            setTimeout(() => {
                window.location.reload()
            }, 800)

        }
    } catch (error) {
        console.log(error)
    }

}

async function BuyFromSaved(postID) {
    try {
        const { data, error } = await supabase
            .from('Posts')
            .select('UserId')
            .eq('id', `${postID}`)
            if(error) throw error
            if(data){
                if (data[0].UserId == currentUserId.id) {
                    Swal.fire({
                        icon: "error",
                        title: "Can not buy own items",
                    });
                } else {
                    try {
                        const { data, error } = await supabase
                            .from('Posts')
                            .select('Status , UserId')
                            .eq('id', `${postID}`)    // Correct
                        if (error) throw error
                        if (data) {
                            if (data[0].Status == "Sold") {
                                Swal.fire("Item is Sold");
                            } else{
                                Swal.fire({
                                    title: "Confirm Purchase?",
                                    showCancelButton: true,
                                    confirmButtonText: "Confirm",
                                }).then(async (result) => {
                                    if(result.isConfirmed){
                                        Swal.fire({
                                            title: "Item Purchased",
                                            icon: "success",
                                            draggable: true
                                        });
                                        try {
                                            const { data, error } = await supabase
                                                .from('Posts')
                                                .update({ Status: 'Sold'})
                                                .eq('id', postID)
                                                .select()
                                            if (error) throw error
                                            if (data) {
                                                setTimeout(() =>{
                                                    location.reload()
                                                },1000)
                                            }
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }
                                })
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
    } catch (error) {
        console.log(error)
    }

   
}

let savedpostsContainer = document.getElementById("showSavedPosts");
async function showsavedPosts() {
    try {
        const { data, error } = await supabase.from("SavedPosts").select();
        if (error) throw error;

        let hasPosts = false;

        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item.UserId === currentUserId.id) {
                    hasPosts = true;
                    savedpostsContainer.innerHTML += `
                        <div class="card">
                            <div class="card-header">
                                <div class="user-info">
                                    <span class="username">${item.PostUserName}</span>
                                    <span class="date">${item.PostCreatedAt.slice(0, 10)}</span>
                                </div>
                                <div class="save-icon">
                                    <i onclick="Unsave('${item.id}')" id="savedIcon" class="fa-solid fa-bookmark"></i>
                                </div>
                            </div>

                            <div class="card-body">
                                <img class="product-image" src="${item.ImageURL}" alt="Product Image"> 
                                <div class="product-description"><b>${item.title}</b></div>
                                <div class="product-price">${item.Price}$</div>
                                <button class="buy-button" onclick="BuyFromSaved('${item.PostId}')">Buy</button>
                            </div>
                        </div>
                    `;
                }
            });
        }

        if (!hasPosts) {
            savedpostsContainer.innerHTML = `<p>No Post Found!</p>`;
        }

    } catch (error) {
        console.log(error);
    }
}

window.Unsave = Unsave;
window.BuyFromSaved = BuyFromSaved;
window.onload = showsavedPosts();
