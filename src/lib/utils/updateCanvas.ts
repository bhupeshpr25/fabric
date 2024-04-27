import { fabric } from 'fabric';

// define member interface
interface Member {
	login: string;
	avatar_url: string;
	html_url: string;
}

// update canvas based on search input
export function updateCanvas(canvas: fabric.Canvas | undefined, members: Member[], search: string) {
	canvas?.clear(); // clear canvas

	// filter members based on input
	const filteredMembers = members.filter((member) => member.login.includes(search));

	// iterate over each filtered member
	filteredMembers.forEach((member, index) => {
		// define card for each member
		const card = new fabric.Rect({
			left: 100,
			top: 100 + index * 120,
			fill: '#008080',
			rx: 10,
			ry: 10,
			width: 250,
			height: 100,
			selectable: true,
			hasControls: false,
			hasBorders: false
		});

		// username
		const loginText = new fabric.Text(member.login, {
			left: 110,
			top: 110 + index * 120,
			fill: 'white',
			fontSize: 14,
			fontWeight: 'bold'
		});

		// profile link
		const profileLink = new fabric.Text(member.html_url, {
			left: 110,
			top: 130 + index * 120,
			fill: 'white',
			fontSize: 14
		});

		// avatar image
		fabric.Image.fromURL(
			member.avatar_url,
			function (img) {
				// set image properties
				img.set({
					left: 110,
					top: 150 + index * 120,
					width: 50,
					height: 50,
					cornerStyle: 'circle',
					selectable: false,
					hasControls: false,
					hasBorders: false
				});

				// for cors errors
				img.set({ crossOrigin: 'anonymous' });

				// add image to group
				const group = new fabric.Group([card, loginText, profileLink, img], {
					left: 100,
					top: 100 + index * 120
				});

				// add hover effects
				group.on('mouseover', () => {
					group.set({
						scaleX: 1.1,
						scaleY: 1.1,
						borderColor: 'blue'
					});
					canvas?.renderAll();
				});

				// remove hover effect
				group.on('mouseout', () => {
					group.set({
						scaleX: 1,
						scaleY: 1,
						borderColor: ''
					});
					canvas?.renderAll();
				});

				// handle click event to open profile
				group.on('mousedown', function (e) {
					const mouseEvent = e.e; // access the original MouseEvent
					if (mouseEvent.altKey) {
						mouseEvent.preventDefault();
						window.open(member.html_url, '_blank');
					}
					// if alt key is not pressed, the default behavior (dragging) will happen
				});

				// add the group to canvas
				canvas?.add(group);
			},
			{ crossOrigin: 'anonymous' }
		); // pass crossOrigin option to fromURL (for cors errors)
	});

	// render canvas and display upated members
	canvas?.renderAll();
}
