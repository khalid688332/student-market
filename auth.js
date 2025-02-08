let signUpEmail = document.getElementById("SignUpEmail")
let signUpPass = document.getElementById("SignUpPass")
let username = document.getElementById("Username")
let signUpBtn = document.getElementById("SignUpBtn")
if (signUpBtn) {
    signUpBtn.addEventListener("click", signUp)
}

async function signUp() {
    if (signUpEmail.value.trim() === "" || signUpPass.value.trim() === "") {
        Swal.fire({
            title: "Invalid Input",
            text: "Please fill in all fields",
            icon: "question",
        });
    }
    else {
        try {


            let { data, error } = await supabase.auth.signUp({
                email: signUpEmail.value,
                password: signUpPass.value
            })


            if (error) {
                Swal.fire(error.message);
            }
            if (data) {
                console.log(data)
                Swal.fire("Check your Email for verification");
                try {
                    const { data : SignUpData, error : SignUpError } = await supabase
                    .from('Users')
                    .insert({
                        UserName : username.value,
                        Email: signUpEmail.value,
                        UserId : data.user.id
                    })
                    .select()
                } catch (error) {
                    console.log(error)
                }

            }


        } catch (error) {
            console.log(error)
        }
        finally {
            console.log(signUpEmail.value)
            console.log(signUpPass.value)
            signUpEmail.value = ""
            signUpPass.value = ""
            username.value = ""
        }

    }

}




