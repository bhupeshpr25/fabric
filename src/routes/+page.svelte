<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';
	import { fetchMembers } from '$lib/api/fetchMembers';
	import { updateCanvas } from '$lib/utils/updateCanvas';
	import { exportCardsAsImage, showImageInSidebar } from '$lib/utils/exportCards';

	// define member interface
	interface Member {
		login: string;
		avatar_url: string;
		html_url: string;
	}

	// declare variables for canvas, members and search input
	let canvas: fabric.Canvas | undefined;
	let members: Member[] = [];
	let search = '';

	// fetch members and initialize canvas on mount
	onMount(async () => {
		try {
			members = await fetchMembers();
			canvas = new fabric.Canvas('canvas-container', {
				width: window.innerWidth - 300,
				height: window.innerHeight + 3000
			});
			updateCanvas(canvas, members, search);
		} catch (error) {
			console.error('Failed to fetch members:', error);
		}

		// attach the event listener for keydown
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			//  remove event listener when component is destroyed
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	// handle keydown events for exports
	function handleKeyDown(event: KeyboardEvent) {
		if (event.altKey && event.key === 's') {
			event.preventDefault();
			if (canvas) {
				const image = exportCardsAsImage(canvas);
				if (image !== null) {
					showImageInSidebar(image);
				}
			}
		}
	}

	// update member cards based on search input
	$: {
		if (canvas) {
			updateCanvas(canvas, members, search);
		}
	}

	// handle window resize
	const resizeCanvas = () => {
		canvas?.setWidth(window.innerWidth);
		canvas?.setHeight(window.innerHeight - 50);
		canvas?.renderAll();
	};

	// attach event listener for window resize on mounr
	onMount(() => {
		window.addEventListener('resize', resizeCanvas);
		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	});

	// clear canvas when dragging starts
	canvas?.on('object:moving', () => {
		canvas?.clear();
	});

	// redraw canvas after dragging ends
	canvas?.on('object:modified', () => {
		updateCanvas(canvas, members, search);
	});
</script>

<body>
	<div id="main-container">
		<input type="text" bind:value={search} placeholder="Search members..." />
		<canvas id="canvas-container"></canvas>
	</div>

	<div id="sidebar-container">
		<div class="shortcut">
			<strong>open : </strong>
			<p>alt+click</p>
		</div>
		<div class="shortcut">
			<strong>export : </strong>
			<p>alt+s</p>
		</div>
		<h3>EXPORTS</h3>
		<div id="sidebar"></div>
	</div>
</body>

<style>
	body {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100vh;
		margin: 0;
		overflow-x: hidden;
		font-family: 'Quicksand', sans-serif;
	}

	#main-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		transition: flex-direction 0.3s ease;
		overflow-y: auto;
		background: #242423;
	}

	#sidebar-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 300px;
		background: #333;
		color: #fff;
		height: 100vh;
		position: fixed;
		top: 0;
		right: 0;
		color: '#008080';
	}

	#sidebar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.shortcut {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-family: 'Courier New', Courier, monospace;
		font-size: 14px;
		color: #fff;
		margin: 10px;
		padding: 0 10px;
		background-color: #242423;
		border-radius: 5px;
	}

	p {
		margin-left: 10px;
	}

	input {
		display: block;
		margin: 0 auto;
		margin-top: 50px;
		width: 50%;
		padding: 10px;
		border: 2px solid #008080;
		border-radius: 10px;
	}

	canvas {
		display: block;
		margin: 0 auto;
		margin-top: 20px;
	}

	@media (max-width: 768px) {
		body {
			flex-direction: column;
			overflow-y: auto;
		}
		#main-container,
		#sidebar {
			width: 100%;
		}
		#sidebar-container {
			position: static;
			width: 100%;
			height: auto;
		}
	}
</style>
