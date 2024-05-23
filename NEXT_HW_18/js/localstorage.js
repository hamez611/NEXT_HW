const username = document.querySelector(".username");
const usernameWrapper = document.querySelector(".usernameWrapper");
const header = document.querySelector("#header")    



function checkUsername() {
    const checkName = window.localStorage.getItem("username");
    if (checkName) {
        usernameWrapper.style.display = "none";
        header.innerHTML = `<h1>${window.localStorage.getItem("username")}의 Todo List</h1><button type='button' onclick='resetUsername()'>초기화</button>` ;
    } else {
        usernameWrapper.style.display = "flex";
        header.innerHTML = "";
    }
}

checkUsername();

function setUsername() {
    const name = username.value;
    window.localStorage.setItem('username',name);
    username.value=""
    checkUsername();
}

function resetUsername() {
    window.localStorage.removeItem("username");
    checkUsername();
}

