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
  // change this settings for your image size
  const maxW = "30rem";
  const maxH = "20rem";
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
      // check if image was already added and if .image-section doesn't exist
      if (imageAdded && document.querySelector(".image-section") == null) {
        // set imageAdded to false
        imageAdded = false;
      }
    } else {
      imageAdded = false;
    }

    // check if local storage "imagebook" exists
    if (localStorage.getItem("imagebook") === null) {
      // create local storage "imagebook"
      localStorage.setItem("imagebook", JSON.stringify({}));
      localStorage.setItem("imagebook-collapse", false);
    } else {
      // get local storage "imagebook"
      images = JSON.parse(localStorage.getItem("imagebook"));
      collapse = localStorage.getItem("imagebook-collapse");
      if (typeof collapse === "string") {
        collapse = collapse === "true";
      }
    }
    // check if image exists in local storage
    if (images[id] && images[id][loreName]) {
      imageLink = images[id][loreName];
    } else {
      // else use default image
      imageLink = ""; // replace with your image URL
    }
    console.log(loreName);

    if (!imageAdded) {
      // get collapsed from local storage, if it exists

      // check if image was already added
      // create image frame
      const imageFrame = document.createElement("div");
      imageFrame.classList.add("image-frame");
      // image frame should be small, so it doesn't take up too much space
      imageFrame.style.width = "100%";
      imageFrame.style.maxWidth = maxW;
      imageFrame.style.height = "auto";
      imageFrame.style.marginTop = "0.5rem";
      imageFrame.style.marginBottom = "0.5rem";

      // Greate image section
      const imageSection = document.createElement("div");
      imageSection.classList.add("image-section");
      // imageSection.style.marginTop = "2rem";
      // title section
      const titleSection = document.createElement("div");
      titleSection.classList.add("title-section");
      titleSection.style.display = "flex";
      titleSection.style.flexDirection = "row";
      titleSection.style.gap = "1rem";
      titleSection.style.alignItems = "flex-start";
      imageSection.appendChild(titleSection);
      // add title to image section
      const imageSectionTitle = document.createElement("h3");
      imageSectionTitle.innerText = "Image";
      imageSectionTitle.classList.add("image-title");
      imageSectionTitle.style.cursor = "pointer";
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
      // titleSection.appendChild(collapseButton);
      // add image section to image frame
      // create image element
      const image = document.createElement("img");
      // if image exists in local storage, use it

      image.src = imageLink; // replace with your image URL
      image.classList.add("loreImage");
      image.alt = "Image description"; // replace with your image description
      image.style.maxWidth = "100%";
      image.style.maxHeight = maxH;

      // append image to image frame
      imageFrame.appendChild(image);
      // append image frame to image section
      imageSection.appendChild(imageFrame);
      if (localStorage.getItem("imagebook-collapse") !== null) {
        collapse = localStorage.getItem("imagebook-collapse");
        if (typeof collapse === "string") {
          collapse = collapse === "true";
        }
      }

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
      imageSectionTitle.addEventListener("click", () => {
        if (collapse) {
          // show image
          imageFrame.style.display = "block";
          managementArea.style.display = "block";
          collapseButtonText.innerText = "Collapse";
          collapse = false;
        } else {
          // hide image
          imageFrame.style.display = "none";
          managementArea.style.display = "none";
          collapseButtonText.innerText = "Expand";
          collapse = true;
        }
        // save collapse state
        localStorage.setItem("imagebook-collapse", collapse);
      });

      // add save button
      const saveButton = document.createElement("button");
      saveButton.innerText = "Change Image";
      saveButton.classList.add("save-button");
      saveButton.style.cursor = "pointer";
      // titleSection.appendChild(saveButton);

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

      // create management area
      const managementArea = document.createElement("div");
      managementArea.classList.add("management-area");
      if (collapse) {
        // hide management area
        managementArea.style.display = "none";
      } else {
        // show management area
        managementArea.style.display = "block";
      }
      // add title to management area
      const managementAreaTitle = document.createElement("h4");
      managementAreaTitle.innerText = "Management";
      managementAreaTitle.classList.add("management-title");
      // add button area to management area
      const buttonArea = document.createElement("div");
      buttonArea.classList.add("button-area");
      buttonArea.style.display = "flex";
      buttonArea.style.flexDirection = "row";
      buttonArea.style.gap = "1rem";

      // create delete library button
      const deleteLibraryButton = document.createElement("button");
      deleteLibraryButton.innerText = "Delete Library";
      deleteLibraryButton.classList.add("delete-library-button");
      deleteLibraryButton.style.cursor = "pointer";
      buttonArea.appendChild(saveButton);
      buttonArea.appendChild(deleteLibraryButton);

      // add button area to management area
      managementArea.appendChild(buttonArea);
      // add management area to image section
      imageSection.appendChild(managementArea);

      // add event listener to delete library button
      deleteLibraryButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete the library?")) {
          // remove all images from story
          delete images[id];
          // save changes to local storage
          localStorage.setItem("imagebook", JSON.stringify(images));
          imageAdded = false;
          // remove image section
          imageSection.remove();
        }
      });
    }

    // add event listener toloreSelectorto change the image key
    if (document.querySelector(loreSelector) != null) {
      document.querySelector(loreSelector).addEventListener("input", () => {
        const newLoreName = document.querySelector(loreSelector).value;
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
    // logic for image change
    if (oldLoreName !== loreName) {
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
      oldLoreName = loreName;
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
