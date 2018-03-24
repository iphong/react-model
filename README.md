# React Model Responders

## The Problem

This is an official [React proposal on how to handle Model layer](https://reactjs.org/docs/integrating-with-other-libraries.html#using-backbone-models-in-react-components), such as Backbone Model. It looked reasonable at first, until your project grows. Imagine rewriting these code in your components all over the places.

```js
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

## The Solution

Here is a proposed solutions that using render props and support pure function components.

```js
import { Model, Collection } from 'backbone'
import ModelResponder from './ModelResponder'
import CollectionResponder from './CollectionResponder'

const app = new Model({
  name: 'MyApp',
  hideCompleted: false
})
const tasks = new Collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: false },
  { id: 3, text: 'Task 3', done: false },
])

const App = props => (
  <div>
    <ModelResponder target={app} bind={['name']}>
      {name => (
        <h3>{name}</h3>
      )}
    </ModelResponder>
   <ul>
     <CollectionResponder target={tasks}>
       <ModelResponder target={app} bind={['hideCompleted']}>
        {hideCompleted => {
          const filteredTasks = !hideCompleted ? tasks.toArray() : tasks.filter({ done: false })
          return filteredTasks.map(task => (
            <ModelResponder key={task.cid} target={task} bind={['text']}>
              {text => (
                <li>{text}</li>
              )}
            </ModelResponder>
          ))
        }}
       </ModelResponder>
     </CollectionResponder>
   </ul>
  </div>
)
```
