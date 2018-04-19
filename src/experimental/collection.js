// @flow
import Events from './events'
import Model from './model'

const methods = ['has', 'map', 'forEach', 'keys', 'values']

export default class Collection extends Events {
	constructor(models: [Model] = []) {
		super()
		this.models = models
	}
	add(model: Model): boolean {
		this.models.add(model)
		this.emit('add', model)
		this.emit('update')
	}
	remove(model) {
		this.models.remove(model)
		this.emit('remove', model)
		this.emit('update')
	}
	clear() {
		this.models.clear()
		this.emit('reset')
	}
	get size() {
		return this.models.size()
	}
}

methods.forEach(
	method =>
		(Collection.prototype[method] = function(...args) {
			Reflect.apply(this.models[method], this, args)
		})
)
