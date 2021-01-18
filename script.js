'use strict';
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Get more prev & next songs result
const getMoreSongs = async function (url) {
  setTimeout(() => {}, 1000);
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
};

// Get lyrics for song
const getLyrics = async function (artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br> ');

  result.innerHTML = `
        <h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
    `;

  more.innerHTML = '';
};

// Show song and artist in DOM
const showData = function (data) {
  const output = data.data
    .map(
      (song) => `
  <li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</button>
  </li>
`
    )
    .join('');

  result.innerHTML = `
    <ul class="songs">${output}</ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">prev</button>`
            : ''
        } 
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">next</button>`
            : ''
        }
      `;
  } else {
    more.innerHTML = '';
  }
};

// Search by song or artist
const searchSongs = async function (term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
};

// Event listener
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) alert('Please tyep in a search term');
  searchSongs(searchTerm);
});

// Get lyrics button click
result.addEventListener('click', function (e) {
  const clickedEl = e.target;

  if (clickedEl.className === 'btn') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
