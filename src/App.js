import {useState} from "react";
import {getImages, getVideos} from "./apiRequest";
import "./App.css";

export default function App() {
	const [query, updateQuery] = useState("");

	const [images, updateImages] = useState([]);
	const [videos, updateVideos] = useState([]);

	const [selectedImages, updateSelectedImages] = useState([]);

	const [prevSearchQuery, updatePrevSearchQuery] = useState("");

	const updateInputQuery = input => {
		updateQuery(input.target.value);
	};

	const getImagesAndVideos = () => {
		updatePrevSearchQuery(query);
		updateImages([]);
		updateVideos([]);
		updateSelectedImages([]);

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
				console.log(videoList);
			}
		});
	};

	const inputKeyDown = event => {
		const disabled = !query || query === prevSearchQuery;
		if (event.keyCode === 13 && !disabled) getImagesAndVideos();
	};

	const toggleSelectedImage = imageNum => {
		var currentSelectedImages = [...selectedImages];
		if (!currentSelectedImages.includes(imageNum)) {
			currentSelectedImages.push(imageNum);
		} else {
			currentSelectedImages.splice(currentSelectedImages.indexOf(imageNum), 1);
		}
		updateSelectedImages(currentSelectedImages);
	};

	const saveFavorites = () => {
		var data = `{${prevSearchQuery}: [`;
		selectedImages.forEach((imageIndex, i) => {
			if (imageIndex <= 7) {
				// Image
				data += images[imageIndex - 1];
			} else {
				// Videos
				data += videos[imageIndex - 8].large || videos[imageIndex - 8].tiny;
			}
			if (i !== selectedImages.length - 1) {
				data += ", ";
			}
		});
		data += "]}";

		const filename = "favorites.json";
		var file = new Blob([data], {type: "json"});
		if (window.navigator.msSaveOrOpenBlob) {
			// IE10+
			window.navigator.msSaveOrOpenBlob(file, filename);
		} else {
			// Others
			var a = document.createElement("a"),
				url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		}
	};

	return (
		<div className="grid center" style={{marginTop: "1rem", gap: "1rem"}}>
			<div
				className="grid center"
				style={{gridTemplate: "auto auto / auto auto", gap: "0.25rem"}}
			>
				<input
					id="input-query"
					placeholder="Search"
					style={{
						padding: "0.5rem",
						border: "none",
						borderRadius: "5px",
						fontSize: "1.75rem",
						backgroundColor: "rgba(0,0,0,0.1)",
						gridColumn: "1 / 3"
					}}
					value={query}
					onChange={updateInputQuery}
					onKeyDown={inputKeyDown}
				/>
				{/* <div style={{display: "flex", justifyContent: "center"}}> */}
				<button
					onClick={getImagesAndVideos}
					className="custom-button"
					style={{width: "100%"}}
					disabled={!query || query === prevSearchQuery}
				>
					Find Images
				</button>
				<button
					className="custom-button"
					style={{width: "100%"}}
					onClick={saveFavorites}
					disabled={selectedImages.length === 0}
				>
					Save Favorites
				</button>
				{/* </div> */}
			</div>
			<div className="image-grid">
				{images.map((image, i) => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
						key={i}
					>
						<div
							className="number-tag"
							onClick={() => toggleSelectedImage(i + 1)}
							style={{
								color: selectedImages.includes(i + 1)
									? "lime"
									: "rgb(255, 46, 46)",
								cursor: "pointer"
							}}
						>
							{i + 1}
						</div>
						<img
							src={image}
							alt={prevSearchQuery}
							style={{maxWidth: "300px"}}
						/>
					</div>
				))}
				{videos.map((video, i) => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							position: "relative"
						}}
						key={i + 7}
					>
						<div
							className="number-tag"
							onClick={() => toggleSelectedImage(i + 8)}
							style={{
								color: selectedImages.includes(i + 8)
									? "lime"
									: "rgb(255, 46, 46)",
								cursor: "pointer",
								zIndex: "1"
							}}
						>
							{i + 8}
						</div>
						<video src={video.tiny} width="300" autoplay controls />
					</div>
				))}
			</div>
		</div>
	);
}
