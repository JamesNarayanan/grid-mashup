const API_KEY = "19768797-ca79ba778fd3ca82030c55e9e";

export const getImages = query => {
	return fetch(
		`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
			query
		)}&per_page=7`
	)
		.then(response => response.json())
		.then(json => {
			console.log(json);
			return json;
		})
		.catch(error => console.log("Failure to fetch images", error));
};

export const getVideos = query => {
	// per_page=2 is not allowed, otherwise I would use it
	return fetch(
		`https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(
			query
		)}&per_page=3`
	)
		.then(response => response.json())
		.then(json => {
			console.log(json);
			return json;
		})
		.catch(error => console.log("Failure to fetch videos", error));
};
