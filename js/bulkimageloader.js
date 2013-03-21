define([signals],
	function(signals){
		return {
			imageLoader:imageLoader
		}
		
		function imageLoader(imageURLs){
			return{
				images:images,
				allLoaded:completeSignal,
				imageLoaded:singleCompleteSignal,
				toLoad:imagesToLoad,
				loaded:imagesLoaded
			};
		}
	}
}