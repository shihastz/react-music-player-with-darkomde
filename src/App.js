import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import audios from "./static/audios";
import Wave from "@foobar404/wave";
import "react-lazy-load-image-component/src/effects/blur.css";

function App() {
  const songRef = useRef(null);
  let [wave] = useState(new Wave());

  const [barValue, setBarValue] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const currentSong = audios[currentSongIndex];

  useEffect(() => {
    window.document
      .getElementById("audio_element")
      .addEventListener("loadedmetadata", (e) => {
        //console.log("this", e);
        songRef.current = e.target;
      });
    wave.fromElement("audio_element", "canvas_element", {
      type: "flower",
      colors: ["black", "white"],
    });
  }, [wave, currentSongIndex]);

  const goToNextSong = (value) => {
    const nextSongIndex = currentSongIndex + value;
    const firstSongIndex = 0;
    const lastSongIndex = audios.length - 1;
    console.log("value", nextSongIndex);
    setCurrentSongIndex(nextSongIndex);
    if (nextSongIndex >= audios.length) {
      setCurrentSongIndex(firstSongIndex);
    } else if (nextSongIndex < firstSongIndex) {
      setCurrentSongIndex(lastSongIndex);
    } else {
      setCurrentSongIndex(nextSongIndex);
    }
    setHasChanged(true);
    setIsPaused(false);
  };
  const handleModeChange = (e) => {
    let isChecked = e.target.checked;
    console.log("isChecked", isChecked);
    if (isChecked) {
      document.body.style.background = "rgb(34,38,42)";
      setDarkMode(true);
    } else {
      document.body.style.background = "rgb(224,229,236)";
      setDarkMode(false);
    }
    // do whatever you want with isChecked value
  };
  return (
    <div className="container">
      <div className={`iphone neu ${darkMode ? "dark_mode" : ""}`}>
        <div className="title">
          {/* <div>NOW PLAYING</div> */}
          <div>
            <input
              type="checkbox"
              className="toggle-switch"
              onChange={(e) => handleModeChange(e)}
            />
          </div>
        </div>
        <div className="album-cover">
          <div className="" />
          <div className="img-container">
            <LazyLoadImage
              effect="blur"
              alt="music"
              className={isPaused ? "img" : "img rotate"}
              src={currentSong.img}
            />
            <canvas height="240" width="240" id="canvas_element" />
          </div>
          <h2 className="song-title">{currentSong.songName}</h2>
          <h3 className="artist-title">{currentSong.singer}</h3>
          <audio
            autoPlay={hasChanged}
            onEnded={() => goToNextSong(1)}
            src={currentSong.src}
            id="audio_element"
            onTimeUpdate={() => setBarValue(songRef.current.currentTime)}
          />
        </div>
        <div>
          <input
            value={barValue}
            type="range"
            min="0"
            max={songRef.current?.duration ? songRef.current.duration : "100"}
            className={`input track neu ${darkMode ? "dark_mode" : ""}`}
            onChange={(e) => (songRef.current.currentTime = e.target.value)}
          />
          <div />
        </div>
        <div className="lyrics">
          <i className="fas fa-angle-up" />
          <span>LYRICS</span>
        </div>
        <div className="buttons">
          <button
            className={`btn lg neu ${darkMode ? "dark_mode" : ""}`}
            onClick={() => goToNextSong(-1)}
          >
            <i className="fas fa-backward" />
          </button>

          {isPaused ? (
            <button
              className={`btn lg neu ${darkMode ? "dark_mode" : ""}`}
              onClick={() => {
                songRef.current.play();
                setIsPaused(!isPaused);
              }}
            >
              <i className="fas fa-play"></i>
            </button>
          ) : (
            <button
              className={`btn lg neu ${darkMode ? "dark_mode" : ""}`}
              onClick={() => {
                songRef.current.pause();
                setIsPaused(!isPaused);
              }}
            >
              <i className="fas fa-pause"></i>
            </button>
          )}
          <button
            className={`btn lg neu ${darkMode ? "dark_mode" : ""}`}
            onClick={() => goToNextSong(1)}
          >
            <i className="fas fa-forward" />
          </button>
        </div>
        <span className="created">© Shihas</span>
      </div>
    </div>
  );
}

export default App;
