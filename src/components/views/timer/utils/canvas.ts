import { m2PI, dpr } from '../../../../support/utils'

interface Circle {
	radius: number
	color: string
	opacity: number
	width: number
	center: {
		x: number
		y: number
	}
}

export function drawCircle({
	circle,
	startAngle,
	endAngle,
	ctx,
}: {
	circle: Circle
	startAngle: number
	endAngle: number
	ctx: CanvasRenderingContext2D
}) {
	const color = circle.color.substring(0, circle.color.length - 1) + ', ' + circle.opacity + ')'

	ctx.beginPath()
	ctx.arc(circle.center.x, circle.center.y, circle.radius, startAngle, endAngle)
	ctx.lineWidth = circle.width
	ctx.lineCap = 'round'
	ctx.strokeStyle = color
	ctx.stroke()
}

export function drawPoint({ circle, angle, ctx }: { circle: Circle; angle: number; ctx: CanvasRenderingContext2D }) {
	const x = circle.center.x + circle.radius * Math.cos(angle)
	const y = circle.center.y + circle.radius * Math.sin(angle)

	drawCircle({
		circle: {
			radius: 2,
			color: circle.color,
			opacity: circle.opacity,
			width: 12,
			center: { x, y },
		},
		startAngle: 0,
		endAngle: m2PI,
		ctx,
	})
	drawCircle({
		circle: {
			radius: 6,
			color: circle.color,
			opacity: Math.min(circle.opacity / (1 / 0.15), 0.15),
			width: 20,
			center: { x, y },
		},
		startAngle: 0,
		endAngle: m2PI,
		ctx,
	})
}

function drawGradient({ ctx }: { ctx: CanvasRenderingContext2D }) {
	const width = ctx.canvas.width / dpr
	const height = ctx.canvas.height / dpr
	const centerX = width / 2
	const centerY = height / 2
	const outerRadius = Math.sqrt(width * width + height * height) / 2
	const innerRadius = 0
	const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius)

	gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
	gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.8)')
	gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.7)')
	gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.6)')
	gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.5)')
	gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')

	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function drawBackgroundImage({ img, ctx }: { img: HTMLImageElement; ctx: CanvasRenderingContext2D }) {
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const imgRatio = img.height / img.width
	const winRatio = screenHeight / screenWidth

	if (imgRatio > winRatio) {
		const height = screenWidth * imgRatio
		ctx.drawImage(img, 0, (screenHeight - height) / 2, screenWidth, height)
	} else {
		const width = (screenWidth * winRatio) / imgRatio
		ctx.drawImage(img, (screenWidth - width) / 2, 0, width, screenHeight)
	}
}

export function drawBackground({ ctx, img }: { ctx: CanvasRenderingContext2D; img: HTMLImageElement }) {
	if (!img.complete) {
		return
	}

	drawBackgroundImage({ ctx, img })
	drawGradient({ ctx })
}
