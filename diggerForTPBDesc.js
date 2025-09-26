// ==UserScript==
// @name        digger for TPB description
// @namespace   https://github.com/sbugzu/digger_for_TPB_description
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://cdn.jsdelivr.net/npm/get-video-id/dist/get-video-id.umd.min.js
// @match       https://thepiratebay.org/description.php*
// @grant       none
// @version     0.1.0
// @author      sbugzu
// @description The script to display images and URLs in descriptions for thepiratebay.com
// @license     Unlicense
// ==/UserScript==

'use strict';

/*
const isYouTubeUrl = function(url) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "m.youtube.com" ||
      parsedUrl.hostname === "youtu.be"
    );
  } catch (e) {
    return false; // Invalid URL
  }
}
*/

const buildUrl = function(url) {
  /*
  if(isYouTubeUrl(url)) {
    const { id, service} = getVideoId(url);
    if(id !== undefined) {
      return "https://www.youtube.com/embed/${id}";
    }
  }
  */

  const { id, service} = getVideoId(url);
  if( service !== undefined && id !== undefined) {
    if( service === "youtube" ) {
      return "https://www.youtube.com/embed/" + id;
    }
  }
  return url;
}


const text = $("#descr").text();

//const images = text.match(/https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|bmp|svg)/gi) || [];
//const pages = text.match(/https?:\/\/[^\s]+?(?<!\.(jpg|jpeg|png|gif|webp|bmp|svg))(?=\s|$)/gi) || [];
//console.log(images)

const urlRegex = /https?:\/\/[^\s\[\]\)\}<>"']+/gi;
const urls = text.match(urlRegex) || [];
const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(?=[?&#\[]|$)/i;
const images = urls.filter(url => imageRegex.test(url));
const pages = urls.filter(url => !imageRegex.test(url));

const $metadata = $("#metadata").first();
const $preview = $('<div id="preview"></div>').css({"text-align": "center"});

images.forEach(url => {
  const $img = $("<img>").attr("src", url);
  $img.css({
    "max-width": "95%",
    "height": "auto",
    "margin": "10px 0",
    "display": "inline-block"
  });
  $preview.append($img);
  const $link = $("<p>").append($("<a>")
                                .attr("href", url)
                                .attr("target", "_blank")
                                .attr("rel", "noopener noreferrer")
                                .text("☝️ " + url)
  );
  $preview.append($link);
});


pages.forEach(url => {
  const dstUrl = buildUrl(url);
  const $iframe = $("<iframe>").attr("src", dstUrl).css({
    "width": "95%",
    "height": "512px",
    "border": "0"
  });

  $preview.append($iframe);
  const $link = $("<p>").append($("<a>")
                                .attr("href", url)
                                .attr("target", "_blank")
                                .attr("rel", "noopener noreferrer")
                                .text("☝️ " + url)
  );
  $preview.append($link);
});

$metadata.after($preview);
