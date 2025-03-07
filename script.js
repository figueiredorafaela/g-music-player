const menuBtn = document.querySelector(".menu-btn"),
    container = document.querySelector(".container");

const progressBar = document.querySelector(".bar"),
progressDot = document.querySelector(".dot"),
currentTimeEl = document.querySelector(".current-time"),
durationEl = document.querySelector(".duration");

menuBtn.addEventListener("click" , () => {
    container.classList.toggle("active");
});

let playing = false,
    currentSong = 0,
    shuffle = false,
    repeat = false,
    favourits = [],
    audio = new Audio();

const songs = [
    {
        title : "Banho de Folhas",
        artist : "Luedji Luna",
        img_src : "1.jpg",
        src : "1.mp3",
    },
    {
        title : "Pink + White",
        artist : "Frank Ocean",
        img_src : "2.jpg",
        src : "2.mp3",
    },
    {
        title : "Táxi Lunar",
        artist : "Alceu Valença, Elba Ramanlho",
        img_src : "3.jpg",
        src : "3.mp3",
    },
    {
        title : "Unthinkable",
        artist : "Alicia Keys",
        img_src : "4.jpg",
        src : "4.mp3",
    },
    {
        title : "Eu e Você Sempre",
        artist : "Renato Aragão",
        img_src : "5.jpg",
        src : "5.mp3",
    },
    
];

const playlistContainer = document.querySelector("#playlist");
const infoWrapper = document.querySelector(".info");
const coverImage = document.querySelector(".cover-image");
const currentSongTitle = document.querySelector(".current-song-title");
const currentFavourite = document.querySelector("#current-favourite");

function init () {
    updatePlaylist(songs);
    loadSong(currentSong);
}

init();

function updatePlaylist(songs) {

    //remove existing elements

    playlistContainer.innerHTML = "";

    //array for songs 

    songs.forEach((song, index) => {

        //extract data from song

        const{title, src} = song;

        // check if is favourite
        const isFavourite = favourits.includes(index);
    
        // create a tr to wrappe song

        const tr = document.createElement("tr");
        tr.classList.add("song");
        tr.innerHTML = `
            <td class="no">
                <h5>${index + 1}</h5>
                </td>
                <td class="title">
                <h6>${title}</h6>
                </td>
                <td class="length">
                <h5>2:03</h5>
                </td>
                <td>
                <i class="fas fa-heart ${isFavourite ? "active" : ""}"></i>
                </td>
        `;

        playlistContainer.appendChild(tr);

        //play song when clicked on playlist osngs
        tr.addEventListener("click", (e) => {

            //add at favourite when clicked 
            if(e.target.classList.contains("fa-heart")) {
                addToFavourits(index);
                e.target.classList.toggle("active");
                //if heart clicked just add 
                return;
            }

            currentSong = index;
            loadSong(currentSong);
            audio.play();
            container.classList.remove("active");
            playPauseBtn.classList.replace("fa-play", "fa-pause");
            playing=true;
        })

        const audioForDuration = new Audio(`data/${src}`);
        audioForDuration.addEventListener("loadedmetadata" , () => {
            const duration = audioForDuration.duration;

            let songDuration = formatTime(duration);
            tr.querySelector(".length h5").innerText = songDuration;
        });
    });
}

function formatTime(time) {
    //format time like 2:30
    let minutes=Math.floor(time/60);
    let seconds = Math.floor(time%60);
    //add traling zero if seconds less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes} : ${seconds}`;
}

//audio play functionality
function loadSong(num) {
    //change all title artist and times to current song
    infoWrapper.innerHTML = `
        <h2>${songs[num].title}</h2>
        <h3>${songs[num].artist}</h3>
    `;

    //current song title active
    currentSongTitle.innerHTML = songs[num].title;

    //change th vover image
    coverImage.style.backgroundImage = `url(data/${songs[num].img_src})`;

    //add src  of current song to audio 

    audio.src = `data/${songs[num].src}`;

    //if song is favourite highlight

    if(favourits.includes(num)) {
        currentFavourite.classList.add("active");
    } else {
        currentFavourite.classList.remove("active");
    }
}

//play pause

const playPauseBtn = document.querySelector("#playpause"),
nextBtn = document.querySelector("#next"),
prevBtn = document.querySelector("#prev");

playPauseBtn.addEventListener("click", () => {
    if(playing) {
        playPauseBtn.classList.replace("fa-pause" , "fa-play");
        playing = false;
        audio.pause();
    } else {
        playPauseBtn.classList.replace("fa-play", "fa-pause");
        playing = true;
        audio.play();
    }
});

function nextSong() {

    if(shuffle) {
        shuffleFunc();
        loadSong(currentSong);
    } else if(currentSong < songs.length - 1) {
        currentSong++;
    } else {
        currentSong = 0;
    }

    loadSong(currentSong);

    if(playing) {
        audio.play();
    }
}

nextBtn.addEventListener("click" , nextSong);

function prevSong() {

    if(shuffle) {
        shuffleFunc();
        loadSong(currentSong);

    } else if(currentSong > 0) {
        currentSong--;
    } else {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);

    if(playing) {
        audio.play();
    }
}

prevBtn.addEventListener("click" , prevSong);

function addToFavourits(index) {
    if(favourits.includes(index)){
        favourits = favourits.filter((item) => item != index);
        currentFavourite.classList.remove("active");
    } else {
        favourits.push(index);

        if(index == currentSong) {
            currentFavourite.classList.add("active");
        }
    }

    updatePlaylist(songs);
}

currentFavourite.addEventListener("click", () => {
    currentFavourite.classList.toggle("active");
    addToFavourits(currentSong);
});

//shuffle
const shuffleBtn = document.querySelector("#shuffle");

function shuffleSongs() {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active");
}

shuffleBtn.addEventListener("click" , shuffleSongs);

function shuffleFunc() {
    if(shuffle) {
        currentSong = Math.floor(Math.random() * songs.length);
    } 
}

//repeat

const repeatBtn = document.querySelector("#repeat");
function repeatSong(){
    if(repeat == 0) {
        repeat = 1;
        repeatBtn.classList.add("active");
    } else if (repeat == 1) {
        repeat = 2;
        repeatBtn.classList.add("active");
    } else {
        repeat = 0;
        repeatBtn.classList.remove("active");
    }
}

repeatBtn.addEventListener("click", repeatSong);

audio.addEventListener("ended" , () => {
    if( repeat == 1) {
        loadSong(currentSong);
        audio.play();
    } else if (repeat == 2) {
        nextSong();
        audio.play();
    } else {
        if(currentSong == songs.length - 1) {
            audio.pause();
            playPauseBtn.classList.replace("fa-pause" , "fa-play");
            playing = false;
        } else {
            nextSong();
            audio.play();
        }
    }
})

//progress

function progress() {
    let{duration, currentTime} = audio;

    isNaN(duration) ? (duration = 0) : duration;
    isNaN(currentTime) ? (currentTime = 0) : duration;

    currentTimeEl.innerHTML = formatTime(currentTime);
    durationEl.innerHTML = formatTime(duration);

    let progressPercentage = (currentTime / duration) * 100;
    progressDot.style.left = `${progressPercentage}%`;
}

audio.addEventListener("timeupdate", progress);

function setProgress(e) {
    let width = this.clientWidth
    let clickX = e.offsetX;
    let duration = audio.duration();
    audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click", setProgress);

document.addEventListener("DOMContentLoaded", function () {
    const lyricsButton = document.getElementById("lyrics");
    const lyricsWrapper = document.querySelector(".lyrics-wrapper");
    const lyricsContent = document.querySelector(".lyrics-content");
    const closeLyricsButton = document.querySelector("#close-lyrics");
    const currentSongTitleElement = document.querySelector(".current-song-title");
    const container = document.querySelector(".container");

    let lyricsData = {};

    // Carregar as letras das músicas do JSON
    fetch("data/lyrics.json")
        .then(response => response.json())
        .then(data => {
            lyricsData = data;
        })
        .catch(error => console.error("Erro ao carregar letras:", error));

    // Mostrar letra ao clicar no botão de letras
    lyricsButton.addEventListener("click", function () {
        const currentSongTitle = currentSongTitleElement.innerText.trim();

        if (lyricsData[currentSongTitle]) {
            lyricsContent.innerText = lyricsData[currentSongTitle];
        } else {
            lyricsContent.innerText = "Letra não encontrada.";
        }

        // Ativar container expandido e mostrar a letra
        container.classList.add("active", "lyrics-active");
    });

    // Fechar a exibição da letra ao clicar no botão de fechar
    closeLyricsButton.addEventListener("click", function () {
        container.classList.remove("lyrics-active"); // Mantém "active", mas esconde a letra
    });
});
