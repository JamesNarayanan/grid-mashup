import {useState} from "react";
import {getImages, getVideos} from "./apiRequest";
import "./App.css";

export default function App() {
	const [query, updateQuery] = useState("");

	const [images, updateImages] = useState([]);
	const [videos, updateVideos] = useState([]);

	var searchQuery = "";

	const updateInputQuery = input => {
		updateQuery(input.target.value);
	};

	const getImagesAndVideos = () => {
		searchQuery = query;
		getImages(query).then(data => {
			if (data && data.totalHits > 0) {
				var imageList = [];
				data.hits.forEach(hit => {
					imageList.push(hit.largeImageURL);
				});
				updateImages(imageList);
			}
		});
		getVideos(query).then(data => {
			if (data && data.totalHits > 0) {
				var videoList = [];
				for (let i = 0; i < 2 && i < data.hits.length; i++) {
					const hit = data.hits[i];
					videoList.push({
						large: hit.videos.large.url,
						tiny: hit.videos.tiny.url
					});
				}
				updateVideos(videoList);
			}
		});
	};

	const inputKeyDown = event => {
		if (event.keyCode === 13) getImagesAndVideos();
	};

	return (
		<div className="grid center" style={{gap: "1rem"}}>
			<div className="grid center">
				<input
					id="input-query"
					placeholder="Search"
					style={{
						width: "250px",
						padding: "0.5rem",
						border: "none",
						borderRadius: "5px",
						fontSize: "1.75rem",
						backgroundColor: "rgba(0,0,0,0.1)"
					}}
					value={query}
					onChange={updateInputQuery}
					onKeyDown={inputKeyDown}
				/>
				<div style={{display: "flex", justifyContent: "center"}}>
					<button onClick={getImagesAndVideos} className="custom-button">
						Find Images
					</button>
				</div>
			</div>
			<div className="image-grid">
				{images.map((image, i) => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
					>
						<div className="number-tag">{i + 1}</div>
						<img src={image} alt={searchQuery} style={{maxWidth: "300px"}} />
					</div>
				))}
				{videos.map((video, i) => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
					>
						<div className="number-tag">{i + 8}</div>
						<img
							src={video.tiny}
							alt={searchQuery}
							style={{maxWidth: "300px"}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
