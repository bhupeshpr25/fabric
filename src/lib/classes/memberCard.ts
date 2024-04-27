import { fabric } from 'fabric';
import type { Member } from '$lib/api/fetchMembers';

// define class for member card
export class MemberCard extends fabric.Group {
	constructor(member: Member, canvas: fabric.Canvas, options: fabric.IGroupOptions = {}) {
		// create a group of fabric objects for the member card
		super(
			[
				new fabric.Rect({
					left: 10,
					top: 10,
					fill: '#f55',
					rx: 10,
					ry: 10,
					width: 200,
					height: 100,
					selectable: true,
					hasControls: false,
					hasBorders: false
				}),
				new fabric.Text(member.login, {
					left: 10,
					top: 10,
					fontSize: 16,
					fill: 'black'
				}),
				new fabric.Image(member.avatar_url, {
					left: 10,
					top: 10,
					width: 50,
					height: 50
				})
			],
			{
				...options,
				left: 100,
				top: 100,
				selectable: true,
				hasControls: true,
				hasBorders: true
			}
		);

		// event listener for mouse events

		this.on('mouseover', () => {
			this.stroke = 'red';
			this.strokeWidth = 2;
			canvas.renderAll();
		});

		this.on('mouseout', () => {
			this.stroke = '';
			this.strokeWidth = 0;
			canvas.renderAll();
		});

		this.on('mousedown', () => {
			// open member in new tab when clicked
			window.open(member.html_url, '_blank');
		});
	}
}
