import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { array } from "prop-types";
import { getEnabledCategories } from "trace_events";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";
import Konva from "konva";

const Visualizer = ({ authCode, theCurrentSong }) => {
	//   const [theCurrentSong, settheCurrentSong] = useState(thetheCurrentSong);

	const [audioAnalysis, setAudioAnalysis] = useState(null);
	const [trackFeatures, setTrackFeatures] = useState(null);
	const [randomColor, setRandomColor] = useState(null);
	const [bpm, setBPM] = useState(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [songBars, setSongBars] = useState(null);

	const [boolin, setBoolin] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			try {
				songBars.forEach((start) => {
					//   console.log(Math.trunc(start));
					//   console.log(Math.trunc(currentTime / 1000));
					//   console.log(start);
					if (Math.trunc(start) == Math.trunc(currentTime / 1000)) {
						console.log(
							"start: " +
								Math.trunc(start) +
								" current: " +
								Math.trunc(currentTime / 1000) +
								" hit"
						);
						changeSize();
					}
				});
			} catch {
				console.log("no songbars");
			}
			setCurrentTime(currentTime + 100);
		}, 100);

		return () => clearInterval(interval);
	}, [songBars, currentTime]);

	useEffect(() => {
		if (audioAnalysis != null) {
			//audioAnalysis provides an array of every bar, beat, etc.
			//   console.log(audioAnalysis.bars);
			const songBars = [];
			audioAnalysis.bars.map((theBars) => {
				// console.log(currentTime / 1000);
				// console.log(theBars.start);
				songBars.push(theBars.start);
			});
			console.log(songBars);

			setSongBars(songBars);
			//   console.log(Math.trunc(trackFeatures.duration_ms / 1000));
			//   console.log(Math.trunc(currentTime / 1000));
		}
	}, [audioAnalysis]);

	useEffect(() => {
		setBoolin(false);
		setCurrentTime(theCurrentSong.progress_ms + 2000);
		getAudioFeatures(theCurrentSong, authCode);
	}, [theCurrentSong]);

	//set background color to change with tempo
	useEffect(() => {
		const interval = setInterval(() => {
			if (bpm != null) {
				// console.log(bpm);
				// console.log(bpm);

				setRandomColor(
					"rgba(" +
						Math.floor(Math.random() * 256) +
						"," +
						Math.floor(Math.random() * 256) +
						"," +
						Math.floor(Math.random() * 256) +
						",0.8)"
				);
			}
		}, 60000 / bpm);
		return () => clearInterval(interval);
	}, [bpm]);

	async function getAudioFeatures(theCurrentSong, authCode) {
		setBoolin(true);
		console.log("audioFeaturesRunning");
		let trackFeatures = new Object();
		const audioFeaturesEndpt =
			"https://api.spotify.com/v1/audio-features/" + theCurrentSong.item.id;
		const audioFeatures = await fetch(audioFeaturesEndpt, {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + authCode,
				"Content-Type": "application/json",
			},
		});
		const theTrackFeatures = await audioFeatures.json();
		setTrackFeatures(theTrackFeatures);

		console.log("theCurrentSong item id: " + theCurrentSong.item.id);

		const getAnalysis = await fetch(
			"https://api.spotify.com/v1/audio-analysis/" + theCurrentSong.item.id,
			{
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + authCode,
					"Content-Type": "application/json",
				},
			}
		);
		const theAnalysis = await getAnalysis.json();
		setAudioAnalysis(theAnalysis);

		if (theTrackFeatures.tempo == bpm) {
			console.log("nope");
		} else {
			setBPM(theTrackFeatures.tempo);
		}
	}
	const theCirc = useRef(null);
	const changeSize = () => {
		// to() is a method of `Konva.Node` instances
		theCirc.current.to({
			scaleX: Math.random() + 0.8,
			scaleY: Math.random() + 0.8,
			duration: 0.1,
		});
	};

	console.log(audioAnalysis);
	// console.log(bpm);
	return (
		<>
			{/* <canvas className="theCanvas" /> */}
			<Stage
				className="stage"
				width={window.innerWidth}
				height={window.innerHeight}
				fill={randomColor}
			>
				<Layer fill={randomColor}>
					<Rect
						x={0}
						y={0}
						width={window.innerWidth}
						height={window.innerHeight}
						fill={randomColor}
						shadowBlur={5}
					/>
					<Circle
						ref={theCirc}
						x={window.innerWidth / 2}
						y={window.innerHeight / 2}
						fill={"rgba(255,255,0,0.4)"}
						radius={70}
					/>
				</Layer>
			</Stage>
			<style jsx>{``}</style>
		</>
	);
};

export default Visualizer;
