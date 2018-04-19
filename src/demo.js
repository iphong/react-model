// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'underscore'
import Backbone from './backbone'
import { ModelResponder, CollectionResponder } from './responders'

// When 'text' attr is changed, only its item component should be updated
// when 'done' attr is changed, the entire collection should be updated due to showCompleted options

class ToDo extends React.Component {
	static propTypes = {
		options: PropTypes.instanceOf(Backbone.Model),
		tasks: PropTypes.instanceOf(Backbone.Collection)
	}
	render() {
		const { options, tasks } = this.props
		return (
			<div>
				<ModelResponder target={options} bind={['title']}>
					{title => <h3>{title}</h3>}
				</ModelResponder>
				<ModelResponder target={options} bind={['showCompleted']}>
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
									onChange={() => options.set('showCompleted', !showCompleted)}
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
																<li
																	hidden={!showCompleted && task.get('done') === true}
																>
																	<input
																		type="checkbox"
																		checked={done}
																		onChange={e =>
																			task.set('done', e.target.checked)
																		}
																	/>
																	<input
																		value={text}
																		onChange={e => task.set('text', e.target.value)}
																		placeholder="Untitled Task"
																	/>
																	<select
																		value={priority}
																		onChange={e =>
																			task.set('priority', e.target.value)
																		}
																	>
																		{_.times(5, n => (
																			<option key={n}>{n + 1}</option>
																		))}
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
}

class Setting extends React.Component {
	render() {
		const { options } = this.props
		return (
			<div>
				<h3>Settings</h3>
				<ModelResponder target={options} bind={['title', 'showCompleted']}>
					{(title, showCompleted) => (
						<div>
							<div>
								<label>Title</label>
								<input
									type="text"
									value={title}
									onChange={e => options.set('title', e.target.value)}
								/>
							</div>
							<div>
								<input
									type="checkbox"
									checked={!showCompleted}
									onChange={() => options.set('showCompleted', !showCompleted)}
								/>
								<span>Hide Completed</span>
							</div>
						</div>
					)}
				</ModelResponder>
			</div>
		)
	}
}

const options = new Backbone.Model({
	title: 'My Tasks',
	showCompleted: true
})
const tasks = new Backbone.Collection([
	{ text: 'Task 1', done: false, priority: 1 },
	{ text: 'Task 2', done: false, priority: 2 },
	{ text: 'Task 3', done: false, priority: 3 }
])
ReactDOM.render(
	<div>
		<ToDo options={options} tasks={tasks} />
		<ToDo options={options} tasks={tasks} />
		<Setting options={options} />
	</div>,
	window.app
)
