import { fabric } from 'fabric';

// define image data interface
interface ImageData {
	id: string;
	dataURL: string;
}

// export cards as image
export function exportCardsAsImage(canvas: fabric.Canvas | undefined): ImageData | null {
	if (!canvas) return null; // return null if canvas is undefined

	// convert canvas to image data
	const dataURL = canvas.toDataURL({
		format: 'png',
		quality: 1,
		enableRetinaScaling: true
	});

	// return image data object
	return {
		id: 'canvas-image',
		dataURL: dataURL
	};
}

// show image in sidebar
export function showImageInSidebar(image: ImageData): void {
	const sidebar = document.getElementById('sidebar');
	if (sidebar) {
		sidebar.innerHTML = ''; // clear sidebar content

		// create image element
		const img = document.createElement('img');

		// set image source and style
		img.src = image.dataURL;
		img.id = image.id;
		img.style.width = '200px';
		img.style.height = '300px';
		sidebar.appendChild(img);
	}
}
