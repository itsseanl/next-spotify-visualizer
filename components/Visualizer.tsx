import React, { useState, useEffect } from "react";
import Link from "next/link";

const Visualizer = ({ authCode, currentSong }) => {
  console.log(currentSong);
  const [audioAnalysis, setAudioAnalysis] = useState(null);

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

        //   visualizer(trackFeatures, currentSong, audioAnalysis);
      });
  }
  console.log(audioAnalysis);

  return (
    <>
      <p>Visualizer</p>
      <canvas width={640} height={425} />
    </>
  );
};

export default Visualizer;
