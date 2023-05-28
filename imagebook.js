// ==UserScript==
// @name         Imagebook
// @namespace    http://tampermonkey.net/
// @version      1
// @description  bring images to your lorebook!
// @author       SGreen
// @match        https://novelai.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  console.log("Imagebook loaded");
  let storyName = "";
  let oldLoreName = "";
  let loreName = "";
  let images = {};
  let id = "";
  let imageLink = "";
  const loreSelector = ".sc-c2a8031b-12";
  const inserSelector = ".sc-c2a8031b-34";

  let imageAdded = false; // flag to check if image was already added

  let collapse = false;

  const observer = new MutationObserver(() => {
    const location = window.location;
    // check if search exists
    if (location.search) {
      // check if id exists
      if (location.search.includes("id")) {
        // get id
        id = location.search.split("=")[1];
        // check if id exists in local storage
      }
    }

    loreName = document.querySelector(loreSelector);
    if (loreName != null) {
      loreName = loreName.value;
    } else {
      imageAdded = false;
    }
    // get collapsed from local storage, if it exists
    if (!imageAdded) {
      collapse = localStorage.getItem("imagebook-collapse");
      if (collapse === null) {
        // if it doesn't exist, set it to false
        collapse = false;
        localStorage.setItem("imagebook-collapse", collapse);
      }
    }
    // check if local storage "imagebook" exists
    if (localStorage.getItem("imagebook") === null) {
      // create local storage "imagebook"
      localStorage.setItem("imagebook", JSON.stringify({}));
    } else {
      // get local storage "imagebook"
      images = JSON.parse(localStorage.getItem("imagebook"));
    }
    // check if image exists in local storage
    if (images[id] && images[id][loreName]) {
      console.log("Image exists in local storage");
      imageLink = images[id][loreName];
      console.log(imageLink);
    } else {
      // else use default image
      console.log("Image does not exist in local storage");
      imageLink = ""; // replace with your image URL
    }
    console.log(id);
    console.log(loreName);
    // logic for image change
    if (oldLoreName !== loreName) {
      console.log("Lore name changed");
      oldLoreName = loreName;
      // check if '.loreImage' exists
      if (document.querySelector(".loreImage") != null) {
        // check if image exists
        if (images[id] && images[id][loreName]) {
          imageLink = images[id][loreName];
          // replace image
          document.querySelector(".loreImage").src = imageLink;
        } else {
          // replace image with default
          document.querySelector(".loreImage").src = ""; // replace with your image URL
        }
      }
    }

    if (!imageAdded) {
      // check if image was already added
      // create image frame
      const imageFrame = document.createElement("div");
      imageFrame.classList.add("sc-c2a8031b-34", "cbdOWq");
      // Greate image section
      const imageSection = document.createElement("div");
      imageSection.classList.add("image-section");
      imageSection.style.marginTop = "2rem";
      // title section
      const titleSection = document.createElement("div");
      titleSection.classList.add("title-section");
      titleSection.style.display = "flex";
      titleSection.style.flexDirection = "row";
      titleSection.style.gap = "1rem";
      imageSection.appendChild(titleSection);
      // add title to image section
      const imageSectionTitle = document.createElement("h3");
      imageSectionTitle.innerText = "Image";
      imageSectionTitle.classList.add("image-title");
      titleSection.appendChild(imageSectionTitle);
      // add collapse button
      const collapseButton = document.createElement("button");
      collapseButton.classList.add("collapse-button");
      collapseButton.style.cursor = "pointer";

      // add collapse button text
      const collapseButtonText = document.createElement("span");
      collapseButtonText.innerText = "Collapse";

      collapseButton.appendChild(collapseButtonText);
      // add collapse button to image section
      titleSection.appendChild(collapseButton);
      // add image section to image frame
      // create image element
      const image = document.createElement("img");
      // if image exists in local storage, use it

      image.src = imageLink; // replace with your image URL
      image.classList.add("loreImage");
      image.alt = "Image description"; // replace with your image description
      image.style.width = "100%";

      // append image to image frame
      imageFrame.appendChild(image);
      // append image frame to image section
      imageSection.appendChild(imageFrame);
      if (collapse) {
        // hide image
        imageFrame.style.display = "none";
      } else {
        // show image
        imageFrame.style.display = "block";
      }

      // insert image section into specified div
      const targetDiv = document.querySelector(inserSelector);
      if (targetDiv != null) {
        // add image section at the start of targetDiv
        targetDiv.insertBefore(imageSection, targetDiv.firstChild);

        // targetDiv.appendChild(imageSection);
        imageAdded = true; // set flag to true if image was added
      }

      // add event listener to collapse button
      collapseButton.addEventListener("click", () => {
        if (collapse) {
          // show image
          imageFrame.style.display = "block";

          collapseButtonText.innerText = "Collapse";
          collapse = false;
        } else {
          // hide image
          imageFrame.style.display = "none";

          collapseButtonText.innerText = "Expand";
          collapse = true;
        }
        // save collapse state
        localStorage.setItem("collapse", collapse);
      });

      // add save button
      const saveButton = document.createElement("button");
      saveButton.innerText = "Change Image";
      saveButton.classList.add("save-button");
      saveButton.style.cursor = "pointer";
      titleSection.appendChild(saveButton);

      // add event listener to save button
      saveButton.addEventListener("click", () => {
        const imageUrl = prompt("Enter image URL:");
        if (imageUrl) {
          // check if story exists in local storage
          if (!images[id]) {
            images[id] = {};
          }
          // add image to local storage
          images[id][loreName] = imageUrl;
          localStorage.setItem("imagebook", JSON.stringify(images));
          image.src = imageUrl;
        }
      });
    }
    // add event listener toloreSelectorto change the image key
    if (document.querySelector(loreSelector) != null) {
      document.querySelector(loreSelector).addEventListener("input", () => {
        const newLoreName = document.querySelector(loreSelector).value;
        console.log("INPUT CHANGE");
        // check if image of old lore name exists in local storage
        if (images[id] && images[id][loreName]) {
          // get image link
          imageLink = images[id][loreName];
          // if image exists with old lore name, delete the old image
          delete images[id][loreName];
          // set new image key
          images[id][newLoreName] = imageLink;
          loreName = newLoreName;
          // update local storage
          localStorage.setItem("imagebook", JSON.stringify(images));
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
