import React from 'react';
import PropTypes from 'prop-types';
import { PerspectiveCamera, Scene, Sprite } from 'three/build/three.module';
import { CanvasRenderer, SpriteCanvasMaterial } from './three-canvas-renderer';

/**
 * Wave Component
 * Makes a 3d wave with a transparent background that conforms to the size of its container
 * Props
 *  color: a hex value for a number 0xffffff
 *  separation: how far apart the orbs are. Cannot be reset during components life.
 *	amountX: how many orbs on the X axis
 *	amountY: how many orbs on the Y axis
 *	speed: how fast the wave is pulsing
 *	height: how tall the waves are
 *	scale: a scaling factor for the orbs as they pulse
 * @export
 * @class Wave
 * @extends {React.Component}
 */
export class Wave extends React.Component {
	static propTypes = {
		color: PropTypes.number,
		separation: PropTypes.number,
		height: PropTypes.number,
		amountX: PropTypes.number,
		amountY: PropTypes.number,
		speed: PropTypes.number,
		scale: PropTypes.number
	}

	static defaultProps = {
		color: 0xffffff,
		separation: 100,
		height: 50,
		amountX: 50,
		amountY: 50,
		speed: 1,
		scale: 4
	}

	componentDidMount() {
		this.wave = new WaveScene(this.el, {color: this.props.color});
	}

	componentWillReceiveProps(nextProps) {
		this.wave.updateOpts(nextProps);
	}

	componentWillUnmount() {
		this.wave.destroy();
	}

	render() {
		const {color, separation, height, amountX, amountY, speed, ...rest} = this.props;
		return <div ref={el => (this.el = el)} {...rest}/>;
	}
}

/**
 * Contains the 3JS logic for rendering the wave
 * @class WaveScene
 */
class WaveScene {
	constructor(el, opts = {}) {
		this.el = el;
		this.opts = {
			color: 0xffffff,
			separation: 100,
			height: 50,
			amountX: 50,
			amountY: 50,
			speed: 1,
			scale: 4,
			...opts
		};

		this.camera = new PerspectiveCamera(75, this.el.offsetWidth / this.el.offsetHeight, 1, 10000);
		this.camera.position.z = 1000;
		this.scene = new Scene();
		this.particles = [];
		this.count = 0;
		this.animationFrameId = undefined;
		this.mouseX = 0;
		this.mouseY = 0;
		this.elHalfX = this.el.offsetWidth / 2;
		this.elHalfY = this.el.offsetHeight / 2;
		this.registeredListeners = [];

		this.material = new SpriteCanvasMaterial({
			color: this.opts.color,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.5, 0, Math.PI * 2, true);
				context.fill();
			}
		});

		this.init();
		this.animate();
	}

	init() {
		var i = 0;
		for (var ix = 0; ix < this.opts.amountX; ix++) {
			for (var iy = 0; iy < this.opts.amountY; iy++) {
				const particle = this.particles[i++] = new Sprite(this.material);
				particle.position.x = ix * this.opts.separation - ((this.opts.amountX * this.opts.separation) / 2);
				particle.position.z = iy * this.opts.separation - ((this.opts.amountY * this.opts.separation) / 2);
				this.scene.add(particle);
			}
		}
		this.renderer = new CanvasRenderer({alpha: true});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

		this.el.appendChild(this.renderer.domElement);
		this.registerListener(this.el, 'mousemove', evt => this.onDocumentMouseMove(evt));
		this.registerListener(this.el, 'touchstart', evt => this.onDocumentTouch(evt));
		this.registerListener(this.el, 'touchmove', evt => this.onDocumentTouch(evt));
		this.registerListener(window, 'resize', evt => this.onWindowResize(evt));
	}

	registerListener(obj, evtName, callback) {
		obj.addEventListener(evtName, callback, false);
		this.registeredListeners.push(() => obj.removeEventListener(evtName, callback));
	}

	onWindowResize() {
		this.elHalfX = this.el.offsetWidth / 2;
		this.elHalfY = this.el.offsetHeight / 2;
		this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
	}

	onDocumentMouseMove(event) {
		this.mouseX = event.clientX - this.elHalfX;
		this.mouseY = event.clientY - this.elHalfY;
	}

	onDocumentTouch(event) {
		if (event.touches.length === 1) {
			event.preventDefault();
			this.mouseX = event.touches[0].pageX - this.elHalfX;
			this.mouseY = event.touches[0].pageY - this.elHalfY;
		}
	}

	animate() {
		this.animationFrameId = window.requestAnimationFrame(() => this.animate());
		this.render3d();
	}

	render3d() {
		this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
		this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
		this.camera.lookAt(this.scene.position);
		var i = 0;
		for (var ix = 0; ix < this.opts.amountX; ix++) {
			for (var iy = 0; iy < this.opts.amountY; iy++) {
				const particle = this.particles[i++];
				particle.position.y = (Math.sin((ix + this.count) * 0.3) * this.opts.height) +
					(Math.sin((iy + this.count) * 0.5) * 50);
				particle.scale.x = particle.scale.y = (Math.sin((ix + this.count) * 0.3) + 1) * 4 +
					(Math.sin((iy + this.count) * 0.5) + 1) * this.opts.scale;
			}
		}
		this.renderer.render(this.scene, this.camera);
		this.count += 0.1 * this.opts.speed;
	}

	updateOpts(nextOpts) {
		this.opts = Object.keys(this.opts).reduce((acc, key) => {
			acc[key] = nextOpts[key] !== undefined ? nextOpts[key] : this.opts[key];
			return acc;
		}, {});

		this.material.setValues({color: this.opts.color});
	}

	destroy() {
		window.cancelAnimationFrame(this.animationFrameId);
		this.el.removeChild(this.renderer.domElement);
		this.particles.forEach(particle => this.scene.remove(particle));
		this.material.dispose();
		this.scene.children = [];
		this.registeredListeners.forEach(unbind => unbind());
		this.renderer.domElement = null;
		this.el = null;
		this.scene = null;
		this.projector = null;
		this.camera = null;
		this.material = null;
	}
}

export default Wave;