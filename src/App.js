import React from 'react';
import './App.css';
import Wave from './wave.component';

class App extends React.Component {
	state = {
		speed: 1,
		color: 0xffffff,
		height: 50,
		scale: 4
	}

	render() {
		return (
			<div>
				<Wave
					{...this.state}
					style={{width: '100vw', height: '90vh', backgroundColor: 'black'}}
				/>

				<div style={{height: '10vh'}}>
					<div>
						<label>Speed</label>
						<input
							type="range"
							step="1"
							value={this.state.speed}
							min="1"
							max="5"
							onChange={evt => this.setState({speed: parseInt(evt.target.value)})}
						/>
					</div>

					<div>
						<label>Color</label>
						<input
							type="range"
							step="1"
							value={this.state.color}
							min={0x000000}
							max={0xffffff}
							onChange={evt => this.setState({color: parseInt(evt.target.value)})}
						/>
					</div>

					<div>
						<label>Height</label>
						<input
							type="range"
							step="1"
							value={this.state.height}
							min="1"
							max="1000"
							onChange={evt => this.setState({height: parseInt(evt.target.value)})}
						/>
					</div>

					<div>
						<label>Scale</label>
						<input
							type="range"
							step="1"
							value={this.state.scale}
							min="1"
							max="50"
							onChange={evt => this.setState({scale: parseInt(evt.target.value)})}
						/>
					</div>

				</div>
			</div>
		);
	}
}

export default App;
