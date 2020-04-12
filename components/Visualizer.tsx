import React, { useState, useEffect } from "react";
import Link from "next/link";

const Visualizer = ({ authCode, currentSong }) => {
  console.log(currentSong);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [trackFeatures, setTrackFeatures] = useState(null);
  const [randomColor, setRandomColor] = useState(null);
  const [bpm, setBPM] = useState(null);
  useEffect(() => {
    getAudioFeatures(currentSong, authCode);
  }, [currentSong]);

  async function getAudioFeatures(currentSong, authCode) {
    console.log("audioFeaturesRunning");
    let trackFeatures = new Object();
    const audioFeaturesEndpt =
      "https://api.spotify.com/v1/audio-features/" + currentSong.item.id;
    fetch(audioFeaturesEndpt, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + authCode,
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(responseAsJson) {
        trackFeatures = responseAsJson;
        return trackFeatures;
      })
      .then(function(trackFeatures) {
        setTrackFeatures(trackFeatures);
        getAudioAnalysis(trackFeatures, authCode, currentSong);
      });
  }

  async function getAudioAnalysis(trackFeatures, authCode, currentSong) {
    let currentSection = new Object();
    console.log("currentsong item id: " + currentSong.item.id);
    fetch("https://api.spotify.com/v1/audio-analysis/" + currentSong.item.id, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + authCode,
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(responseAsJson) {
        // setAudioAnalysis(responseAsJson);
        return responseAsJson;
      })
      .then(function(responseAsJson) {
        // getAudioFeatures(currentSong, audioAnalysis, token);
        setAudioAnalysis(responseAsJson);

        visualize(trackFeatures, currentSong, audioAnalysis);
      });
  }

  useEffect(() => {
    if (bpm != "" || bpm != null) {
      const interval = setInterval(() => {
        console.log(bpm);

        setRandomColor(
          "rgba(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ",0.8)"
        );
      }, 60000 / bpm);
      return () => clearInterval(interval);
    }
  }, [bpm]);

  //   function tempoBG() {

  //   }

  function visualize(trackFeatures, currentSong, audioAnalysis) {
    console.log(trackFeatures + " " + currentSong + " " + audioAnalysis);
    if (trackFeatures.tempo == bpm) {
      return;
    } else {
      setBPM(trackFeatures.tempo);
    }
  }
  console.log(audioAnalysis);
  console.log(bpm);

  return (
    <>
      <p>Visualizer</p>
      <canvas width={640} height={425} className="theCanvas" />
      <style jsx>{`
        .theCanvas {
          background-color: ${randomColor};
          transition: 0.3s all;
        }
      `}</style>
    </>
  );
};

export default Visualizer;
