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
	const [songTatums, setSongTatums] = useState(null);
	const [tatumBool, setTatumBool] = useState(false);
	const [boolin, setBoolin] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			try {
				songBars.forEach((start) => {
					//   console.log(Math.trunc(start));
					//   console.log(Math.trunc(currentTime / 1000));
					//   console.log(start);
					if (
						Math.round(start * 10) / 10 ==
						Math.round((currentTime / 1000) * 10) / 10
					) {
						console.log(
							"start: " +
								Math.trunc(start) +
								" current: " +
								Math.trunc(currentTime / 1000) +
								" hit"
						);
						changeSize("bars");
					}
				});

				songTatums.forEach((start) => {
					if (
						Math.round(start * 10) / 10 ==
						Math.round((currentTime / 1000) * 10) / 10
					) {
						console.log(
							"start: " +
								Math.trunc(start) +
								" current: " +
								Math.trunc(currentTime / 1000) +
								" hit"
						);
						changeSize("tatums");
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
			const tatums = [];
			audioAnalysis.bars.map((theBars) => {
				// console.log(currentTime / 1000);
				// console.log(theBars.start);
				songBars.push(theBars.start);
			});
			audioAnalysis.tatums.map((theTatums) => {
				// console.log(currentTime / 1000);
				// console.log(theBars.start);
				tatums.push(theTatums.start);
			});
			console.log(songBars);

			setSongBars(songBars);
			setSongTatums(tatums);
			//   console.log(Math.trunc(trackFeatures.duration_ms / 1000));
			//   console.log(Math.trunc(currentTime / 1000));
		}
	}, [audioAnalysis]);

	useEffect(() => {
		setBoolin(false);
		setCurrentTime(theCurrentSong.progress_ms + 1800);
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
				changeSize("tatums");
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
	const baseCirc = useRef(null);
	const theCirc = useRef(null);
	const tatumCirc = useRef(null);

	const changeSize = (change) => {
		// to() is a method of `Konva.Node` instances
		const max = 0.2;
		const min = 0.52;
		let highlightedNumber = Math.random() * (max - min) + min;

		if (change == "bars") {
			highlightedNumber = Math.random() * (max - min) + min;
			theCirc.current.to({
				scaleX: highlightedNumber + 1,
				scaleY: highlightedNumber + 1,
				duration: 0.2,
			});
		}
		// tatumCirc.current.to({
		// 	scaleX: 1,
		// 	scaleY: 1,
		// 	duration: 0.1,
		// });
		else if (change == "tatums" && tatumBool) {
			highlightedNumber = Math.random() * (max - min) + min;
			tatumCirc.current.to({
				scaleX: 1.1,
				scaleY: 1.1,
				duration: 0.1,
			});
			theCirc.current.to({
				scaleX: highlightedNumber + 1,
				scaleY: highlightedNumber + 1,
				duration: 0.2,
			});
			// const max = 0.02;
			// const min = 0.12;
			// const highlightedNumber = Math.random() * (max - min) + min;
			// tatumCirc.current.to({
			// 	scaleX: highlightedNumber + 1,
			// 	scaleY: highlightedNumber + 1,
			// 	duration: 0.2,
			// });
		} else if (change == "tatums" && !tatumBool) {
			highlightedNumber = Math.random() * (max - min) + min;
			tatumCirc.current.to({
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 0.1,
			});
			theCirc.current.to({
				scaleX: highlightedNumber + 1,
				scaleY: highlightedNumber + 1,
				duration: 0.2,
			});
		}
		setTatumBool(tatumBool == !tatumBool);
	};

	// console.log(trackFeatures);
	// console.log(bpm);
	return (
		<>
			{/* <canvas className="theCanvas" /> */}
			<Stage
				className="stage"
				width={window.innerWidth}
				height={window.innerHeight}
			>
				<Layer>
					<Rect
						x={0}
						y={0}
						width={window.innerWidth}
						height={window.innerHeight}
						shadowBlur={5}
						fill={randomColor}
					/>
					<Circle
						ref={tatumCirc}
						x={window.innerWidth / 2}
						y={window.innerHeight / 2}
						fill={randomColor}
						radius={80}
					/>
					<Circle
						ref={baseCirc}
						x={window.innerWidth / 2}
						y={window.innerHeight / 2}
						radius={70}
						fill={randomColor}
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
