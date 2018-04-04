import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import Backbone from './backbone'
import { ModelResponder, CollectionResponder } from './responders'
import { observable, observe } from 'model-x'

const app = new Backbone.Model({
	name: 'My Tasks',
	showCompleted: true
})
const tasks = new Backbone.Collection([
	{ text: 'Task 1', done: false, priority: 1 },
	{ text: 'Task 2', done: false, priority: 2 },
	{ text: 'Task 3', done: false, priority: 3 }
])

window.state = observable({
	name: 'foo'
})
observe(state, 'name', name => {
	console.log('changed name', name)
})

window.tasks = tasks
window.model = app

// When 'text' attr is changed, only its item component should be updated
// when 'done' attr is changed, the entire collection should be updated due to showCompleted options

function ToDo(props) {
	return (
		<div>
			<ModelResponder target={app} bind={['name']}>
				{name => <h3>{name}</h3>}
			</ModelResponder>
			<ModelResponder target={app} bind={['showCompleted']}>
				{showCompleted => (
					<React.Fragment>
						<div>
							<button onClick={e => tasks.add({ text: '', done: false, priority: 1 })}>Add</button>
							<button
								onClick={e => {
									if (confirm('Are you sure?')) {
										tasks.reset([])
									}
								}}
							>
								Clear
							</button>
							<input
								type="checkbox"
								checked={!showCompleted}
								onChange={() => app.set('showCompleted', !showCompleted)}
							/>
							<span>Hide Completed</span>
						</div>
						<CollectionResponder target={tasks} bind={['priority']}>
							{() => {
								let output = tasks.sortBy(m => 0 - m.get('priority'))
								if (!showCompleted) output = output.filter(task => !task.get('done'))
								return (
									<ul>
										{output.map(task => {
											return (
												<ModelResponder
													key={task.cid}
													target={task}
													bind={['text', 'done', 'priority']}
												>
													{(text, done, priority) => {
														return (
															<li hidden={!showCompleted && task.get('done') === true}>
																<input
																	type="checkbox"
																	checked={done}
																	onChange={e => task.set('done', e.target.checked)}
																/>
																<input
																	value={text}
																	onChange={e => task.set('text', e.target.value)}
																	placeholder="Untitled Task"
																/>
																<select
																	value={priority}
																	onChange={e => task.set('priority', e.target.value)}
																>
																	{_.times(5, n => <option key={n}>{n + 1}</option>)}
																</select>
																<button
																	onClick={e => {
																		if (confirm('Are you sure?')) {
																			tasks.remove(task)
																		}
																	}}
																>
																	X
																</button>
															</li>
														)
													}}
												</ModelResponder>
											)
										})}
									</ul>
								)
							}}
						</CollectionResponder>
					</React.Fragment>
				)}
			</ModelResponder>
		</div>
	)
}

ReactDOM.render(<ToDo />, window.app)
