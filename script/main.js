// function myFunction(x) {
//     x.classList.toggle("change");

// }

// function toggleSidebar() {
//     const sidebar = document.getElementById("sidebar");
//     const mainContent = document.getElementById("main-content");
//     const cate = document.querySelector(".cate");

//     sidebar.classList.toggle('active');

//     if (sidebar.classList.contains('active')) {
//             mainContent.style.marginLeft = "250px"; // Adjust margin for active sidebar
//             cate.style.width = "84%";
//     } else {
//             mainContent.style.marginLeft = "0px"; // Reset margin to 0 for inactive sidebar
//             cate.style.width = "100%";
//     }
// }

document.addEventListener("DOMContentLoaded", function () {
  // Open the sidebar by default when the page loads
  toggleSidebar();
});

function myFunction(x) {
  x.classList.toggle("change");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const cate = document.querySelector(".cate");

  sidebar.classList.toggle("active");

  if (sidebar.classList.contains("active")) {
    mainContent.style.marginLeft = "250px"; // Adjust margin for active sidebar
    cate.style.width = "84%";
  } else {
    mainContent.style.marginLeft = "0px"; // Reset margin to 0 for inactive sidebar
    cate.style.width = "100%";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const sentences = [
    "Search for videos",
    "Discover new content",
    "Find your favorite channels",
    "Explore trending topics",
    "Enjoy watching videos",
  ];

  const inputElement = document.getElementById("searchInput");
  let sentenceIndex = 0;
  let letterIndex = 0;

  function updatePlaceholder() {
    const currentSentence = sentences[sentenceIndex];
    const animatedText = currentSentence.substring(0, letterIndex + 1);
    inputElement.setAttribute("placeholder", animatedText);

    if (letterIndex < currentSentence.length) {
      letterIndex++;
      setTimeout(updatePlaceholder, 100); // Adjust the delay for animation speed
    } else {
      letterIndex = 0;
      sentenceIndex = (sentenceIndex + 1) % sentences.length;
      setTimeout(updatePlaceholder, 1500); // Delay before starting the next sentence
    }
  }

  updatePlaceholder();
});

// api key data fetch

const apiKey = "AIzaSyCwgVsvY6etS7oxFlNKSGWmDIvj_HvEJ1k";
const apiUrl = "https://www.googleapis.com/youtube/v3/videos";

async function fetchYouTubeVideos() {
  try {
    const response = await fetch(
      `${apiUrl}?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=51&regionCode=US&key=${apiKey}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching videos:", data.error.message);
      return;
    }

    displayVideos(data.items);
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}

//fetch video by category
// const apiKey = "AIzaSyCwgVsvY6etS7oxFlNKSGWmDIvj_HvEJ1k";
//   const apiUrl = "https://www.googleapis.com/youtube/v3/videos";

  document.addEventListener("DOMContentLoaded", fetchYouTubeVideos);

  function fetchVideosByCategory(categoryId) {
      fetchYouTubeVideos(categoryId);
  }
  
  async function fetchYouTubeVideos(category) {
    try {
        const response = await fetch(`${apiUrl}?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error fetching videos:", data.error.message);
            return;
        }

        clearVideos(); // Clear existing videos
        displayVideos(data.items);
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

function clearVideos() {
    const videosContainer = document.querySelector(".screen");
    videosContainer.innerHTML = ""; // Remove all child elements (videos)
}


document.addEventListener("DOMContentLoaded", () => {
    fetchYouTubeVideos('10');
});

async function fetchChannelInfo(channelId) {
  try {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();

    if (channelData.error) {
      console.error("Error fetching channel info:", channelData.error.message);
      return null;
    }

    return channelData.items[0].snippet;
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return null;
  }
}

function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  } else {
    return views;
  }
}

function timeAgo(date) {
  const now = new Date();
  const uploadDate = new Date(date);
  const diffTime = Math.abs(now - uploadDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + " days ago";
}

async function displayVideos(videos) {
  const videosContainer = document.querySelector(".screen");

  for (const video of videos) {
    const videoTitle = video.snippet.title;
    const videoId = video.id;
    const videoThumbnail = video.snippet.thumbnails.default.url;
    const views = formatViews(video.statistics.viewCount);
    const uploadTime = timeAgo(video.snippet.publishedAt);
    const channelId = video.snippet.channelId;

    // Fetch channel info
    const channelInfo = await fetchChannelInfo(channelId);
    if (!channelInfo) continue;

    const channelLogo = channelInfo.thumbnails.default.url;
    const channelName = channelInfo.title;

    const videoCard = document.createElement("div");
    videoCard.className = "card";
    videoCard.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}" class="thumbnail">
            <div class="description">
                <div class="logo">
                    <img src="${channelLogo}" alt="channel logo" width="50px" class="circle">
                </div>
                <div class="detail light">
                    <p id="sub-description"><b><a href="https://www.youtube.com/watch?v=${videoId}" id="sub-description">${videoTitle}</b></p>
                    <p id="sub-description">${channelName} <i class="fa-solid fa-circle-check"></i> </p>
                    <p id="sub-description">Views: ${views} views • Uploaded: ${uploadTime}</p>
                </div>
            </div>
        `;

    videosContainer.appendChild(videoCard);
  }
}

document.addEventListener("DOMContentLoaded", fetchYouTubeVideos);

// user dropdown js
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("user");
  const dropdown = document.querySelector(".dropdown-menu");
  menu.addEventListener("click", () => {
    if (dropdown.classList.contains("active1")) {
      dropdown.classList.remove("active1");
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "flex";
      dropdown.classList.add("active1");
    }
  });
});

const modeSwitch = document.getElementById("modeSwitch");
// const horizontal = document.getElementsByClassName('horizontal')

modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
  document.getElementById("sidebar").classList.toggle("light-mode");
  document.getElementById("horizontal").classList.toggle("light-mode");
  document.getElementById("cate").classList.toggle("light-mode");
  document.getElementById("sizeb");
  const btn = document.querySelectorAll("#sizeb");
  btn.forEach((sizeb) => {
    sizeb.classList.toggle("light-sizeb");
  });
  const sideb = document.querySelectorAll("#size");
  sideb.forEach((sizeb) => {
    sizeb.classList.toggle("light-size");
    sizeb.classList.toggle("light-size-hover");
  });
  const drop = document.querySelector(".dropdown-menu");
  drop.classList.toggle("dropdown-menu-light");

  const i = document.querySelectorAll(".light");
  // ie.classList.toggle("light-t");
  i.forEach((ie) => {
    ie.classList.toggle("light-t");
  });
  const sub = document.querySelectorAll("#sub-description");
  // ie.classList.toggle("light-t");
  sub.forEach((s) => {
    s.classList.toggle("light-t");
  });
  const bt = document.querySelectorAll(".bt");
  bt.forEach((sizeb) => {
    sizeb.classList.toggle("bt-light");
    sizeb.classList.toggle("light-size-hover");
  });
  const pad = document.querySelectorAll(".pad");
  pad.forEach((sizeb) => {
    sizeb.classList.toggle("pad-light");
  });

  const h5 = document.querySelectorAll(".change");
  h5.forEach((h) => {
    h.classList.toggle("light-channel");
  });
  
});
