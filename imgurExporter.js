// ==UserScript==
// @name         imgurExporter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  create a .imagebook file from your imgur posts.
// @author       SGreen
// @match        https://imgur.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
(function () {
  ("use strict");
  let addedButton = false;
  const buttonArea = ".UploadPost-addButton";
  const createImagebook = () => {
    const images = document.querySelectorAll(".UploadPost-file");
    const imagebook = {};
    images.forEach((image) => {
      // get the image from inside the div: .PostContent-imageWrapper-rounded

      const imageSrc = image.querySelector("img").src;
      // get the title from .ImageDescription-editable
      const title = image.querySelector(".ImageDescription-editable").innerText;
      if (title) {
        imagebook[title] = imageSrc;
      }
    });
    console.log(imagebook);
    return imagebook;
  };
  const downloadImagebook = (imagebook) => {
    // download json file as .imagebook with .UploadPost-editable as the name if it exists
    const name =
      document.querySelector(".UploadPost-editable")?.innerText || "name";
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(imagebook));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${name}.imagebook`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const observer = new MutationObserver(() => {
    if (
      document.querySelector(buttonArea) &&
      !addedButton &&
      !document.querySelector(".imagebook")
    ) {
      addedButton = true;
      const button = document.createElement("button");
      button.classList.add("Button", "imagebook");
      button.style.marginLeft = "1rem";
      button.innerText = "Create Imagebook";
      button.onclick = () => {
        const imagebook = createImagebook();
        downloadImagebook(imagebook);
      };
      document.querySelector(buttonArea).appendChild(button);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
