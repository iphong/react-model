import React from 'react'
import _ from 'underscore'

export class ModelResponder extends React.Component {
	componentDidMount() {
		this.subscribe()
		if (typeof this.props.onMount === 'function') this.props.onMount()
	}
	componentDidUpdate() {
		this.unsubscribe()
		this.subscribe()
		if (typeof this.props.onUpdate === 'function') this.props.onUpdate()
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	update = _.debounce(() => this.forceUpdate())
	subscribe() {
		this.props.bind.forEach(attr => {
			this.props.target.on('change:' + attr, this.update, this)
		})
	}
	unsubscribe() {
		this.props.target.off(null, null, this)
	}
	render() {
		return this.props.children(...this.props.bind.map(attr => this.props.target.get(attr))) || null
	}
}

export class CollectionResponder extends React.PureComponent {
	componentDidMount() {
		this.subscribe()
		if (typeof this.props.onMount === 'function') this.props.onMount()
	}
	componentDidUpdate() {
		this.unsubscribe()
		this.subscribe()
		if (typeof this.props.onUpdate === 'function') this.props.onUpdate()
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	update = _.debounce(() => this.forceUpdate())
	subscribe() {
		if (this.props.bind)
			this.props.bind.forEach(attr => {
				this.props.target.on('change:' + attr, this.update, this)
			})
		this.props.target.on('update reset sort', this.update, this)
	}
	unsubscribe() {
		this.props.target.off(null, null, this)
	}
	render() {
		return this.props.children(...this.props.bind.map(attr => this.props.target.get(attr))) || null
	}
}
