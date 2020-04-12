import React, { useState, useEffect } from "react";
import Link from "next/link";
import Visualizer from "./Visualizer";
const Header = ({ authCode, url }) => {
  const code = authCode;

  const [currentSong, setCurrentSong] = useState(null);

  const [songTitle, setSongTitle] = useState("initial value");
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArt, setAlbumArt] = useState("");

  const [artistTitle, setArtistTitle] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const getCurrentSong = async code => {
        const getSong = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + code,
              "Content-Type": "application/json"
            }
          }
        );

        const getCurrentSong = await getSong.json();
        try {
          if (getCurrentSong.item.name === songTitle) {
            return;
          } else {
            try {
              console.log("try");
              setCurrentSong(getCurrentSong);

              setAlbumArt(getCurrentSong.item.album.images[0].url);
              setSongTitle(getCurrentSong.item.name);
              setAlbumTitle(getCurrentSong.item.album.name);
              setArtistTitle(getCurrentSong.item.album.artists[0].name);
            } catch {
              window.location.href = "/";
            }
          }
        } catch {
          console.log("err");
        }
      };

      getCurrentSong(code);
    }, 1000);

    return () => clearInterval(interval);
  }, [code, songTitle]);

  return (
    <>
      <header>
        <div className="left"></div>
        <div className="right">
          <div className="info">
            <p>{songTitle}</p>
            <p>{albumTitle}</p>
            <p>{artistTitle}</p>
          </div>
          <img src={albumArt} />
        </div>
      </header>
      {currentSong != null ? (
        <Visualizer authCode={code} currentSong={currentSong} />
      ) : null}
      <style jsx>{`
        header {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
        }
        .left > h1 {
          font-size: 18px;
        }
        .left > h3 {
          font-size: 14px;
        }
        .right {
          display: flex;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-right: 5px;
        }

        .right img {
          width: auto;
          height: 100px;
        }
        .right p {
          margin: 0;
          padding: 2px;
          font-size: 12px;
        }
        .right p:nth-child(1) {
          font-weight: 400;
        }
        .right p:nth-child(2) {
          font-weight: 700;
        }
        .right p:nth-child(3) {
          font-weight: 400;
        }
      `}</style>
    </>
  );
};

export default Header;
