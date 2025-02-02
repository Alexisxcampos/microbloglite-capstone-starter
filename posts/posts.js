/* Posts Page JavaScript */

"use strict";
// Account Dropdown
let userIcon = document.getElementById("userIcon");
let dropdownContent = document.getElementById("dropdownContent");
let logOutBtnEl = document.getElementById("logOutBtn");

// Function to toggle dropdown visibility
function toggleDropdown() {
  dropdownContent.classList.toggle("show");
}

// Redirect to Landing Page
logOutBtnEl.addEventListener("click", logout);

// Event listener to toggle dropdown when clicking on the user icon
userIcon.addEventListener("click", toggleDropdown);

// Close the dropdown if clicking outside of it
window.addEventListener("click", function (event) {
  if (!event.target.closest(".nav-user-dropdown")) {
    dropdownContent.classList.remove("show");
  }
});

window.addEventListener("load", function () {
  let storedImgURL = localStorage.getItem("profilePicURL");
  if (storedImgURL) {
    let imageDisplay = document.getElementById("accImg");
    let storyDisplay = document.getElementById("storyImg");
    let postDisplay = this.document.getElementById("postBoxImg");
    imageDisplay.src = storedImgURL;
    storyDisplay.src = storedImgURL;
    postDisplay.src = storedImgURL;
  }
});

window.onload = () => {
  // Get ID from HTML
  let textAreaEl = document.getElementById("textArea");
  let postsContainerEl = document.getElementById("write-post-container");
  let postBtnEl = document.getElementById("postBtn");

  // Emoji JS

  // Fetch to Show Username
  fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/");

  // Event Listener to Post
  postBtnEl.addEventListener("click", (e) => {
    e.preventDefault();

    // Post Data
    let postData = {
      text: textAreaEl.value,
    };

    // Fetch Posts

    const loginData = getLoginData();

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((newPost) => {
        let newPostDiv = document.createElement("div");
        newPostDiv.classList.add("card");
        newPostDiv.textContent = newPost.message;

        postsContainerEl.appendChild(newPostDiv);

        textAreaEl.value = "";
      })
      .catch((err) => {
        console.error("Error", err);
      });
  });

  // Get All Posts

  function getAllPosts() {
    const loginData = getLoginData();
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.token}`,
      },
    };
    fetch(
      "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=50&offset=0",
      options
    )
      .then((response) => response.json())
      .then((posts) => {
        let postsContainerEl = document.getElementById("postsContainer");
        postsContainerEl.innerHTML = "";

        posts.forEach((post) => {
          let postEl = document.createElement("div");
          postEl.classList.add("card");

          let usernameEl = document.createElement("div");
          usernameEl.classList.add("username");
          usernameEl.textContent = `${post.username}`;

          let postTextEl = document.createElement("div");
          postTextEl.classList.add("post-text");
          postTextEl.innerHTML = post.text;

          // Like Button
          let likeBtn = document.createElement("button");
          likeBtn.innerHTML = "Like &#x2665;";
          likeBtn.classList.add("iconBtn", "likeBtn");

          // Unlike Button
          let unlikeBtn = document.createElement("button");
          unlikeBtn.innerHTML = "Unlike &#x2661;";
          unlikeBtn.classList.add("iconBtn", "unlikeBtn");

          // Function to handle like button
          function handleLikeClick() {
            likeBtn.classList.toggle("active");
            unlikeBtn.classList.remove("active");
          }

          // Function to handle unlike button
          function handleUnlikeClick() {
            unlikeBtn.classList.toggle("active");

            likeBtn.classList.remove("active");
          }

          likeBtn.addEventListener("click", handleLikeClick);
          unlikeBtn.addEventListener("click", handleUnlikeClick);

          postEl.appendChild(usernameEl);
          postEl.appendChild(postTextEl);
          postEl.appendChild(likeBtn);
          postEl.appendChild(unlikeBtn);

          postsContainerEl.appendChild(postEl);
        });
        console.log(posts);
      });
  }
  getAllPosts();
  setInterval(getAllPosts, 10000);
};
