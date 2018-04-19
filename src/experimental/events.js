// @flow
const EVENTS = Symbol('events')
const ALL = Symbol('all')

export default class Events {
	constructor() {
		Reflect.defineProperty(this, EVENTS, {
			value: new Set(),
			writable: false,
			enumerable: false,
			configurable: false
		})
	}
	on(type: string, listener: Function, context?: {} = null) {
		if (type && listener) this[EVENTS].add({ type, listener, context })
	}
	off(type: string, listener: Function, context?: {} = null) {
		if (!type && !listener && !context) {
			return this[EVENTS].clear()
		}
		this[EVENTS].forEach(event => {
			if (type && type !== event.type) return
			if (listener && listener !== event.listener) return
			if (context && context !== event.context) return
			this[EVENTS].delete(event)
		})
	}
	emit(type: string, ...args: [any]) {
		this[EVENTS].forEach(event => {
			if (type === event.type) Reflect.apply(event.listener, event.context, args)
			if (event.type === '*') Reflect.apply(event.listener, event.context, [type, ...args])
		})
	}
}
