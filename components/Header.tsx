import React, { useState } from "react";
import Link from "next/link";

const Header = ({ authCode }) => {
	console.log(authCode);
	const [currentSong, setCurrentSong] = useState("");
	const [songTitle, setSongTitle] = useState("");
	const [albumTitle, setAlbumTitle] = useState("");
	const [albumArt, setAlbumArt] = useState("");

	const [artistTitle, setArtistTitle] = useState("");
	const [barsCounter, setBarsCounter] = useState(0);
	const [barsTime, setBarsTime] = useState([]);

	const getCurrentSong = async (authCode) => {
		const getSong = await fetch(
			"https://api.spotify.com/v1/me/player/currently-playing",
			{
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + authCode,
					"Content-Type": "application/json",
				},
			}
		);

		const currentSong = await getSong.json();

		setAlbumArt(currentSong.item.album.images[1].url);
		setSongTitle(currentSong.item.name);
		setAlbumTitle(currentSong.item.album.name);
		setArtistTitle(currentSong.item.album.artists[0].name);
		setBarsCounter(0);
		setBarsTime([]);
		console.log(albumArt);
		console.log(songTitle);

		// getAudioFeatures(currentSong, token);
	};
	// setInterval(getCurrentSong, 5000);
	if (authCode.length > 0) {
		getCurrentSong(authCode);
	}

	return (
		<header>
			<div className="left">
				<h1>Spotify Visualizer</h1>
				<h3>Powered by Next.js</h3>
			</div>
			<div className="right">
				<p>{songTitle}</p>
				<p>{albumTitle}</p>
				<p>{artistTitle}</p>
				<img src={albumArt} />
			</div>
		</header>
	);
};

export default Header;
