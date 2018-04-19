// @flow
import Events from './events'

export default class Model extends Events {
	attrs: Map
	changed: Map
	constructor(attrs: {} = {}) {
		super()
		this.attrs = new Map(Object.entries(attrs))
	}
	set(attr, value) {
		if (typeof attr === 'string')
			return this.set({ [attr]: value })
		this.changed = new Map()
		Object.entries(attr).forEach(([key, value]) => {
			if (!Object.is(value, this.attrs.get(key))) {
				this.changed.set(key, value)
				this.attrs.set(key, value)
				this.emit('change:' + key, value)
			}
		})
		if (this.changed.size) {
			this.emit('change', this.changed)
		}
	}
	get(attr) {
		return this.attrs.get(attr)
	}
}
