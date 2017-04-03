import React from "react";
import ReactDOM from "react-dom";
import axios from "axios"



console.clear();

console.log("test2");
console.log("test3");
const Title = () => {
  return (
    <div>
       <div>
          <h1>to-do</h1>
       </div>
    </div>
  );
}

const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        addTodo(input.value);
        input.value = '';
      }}>
        +
      </button>
    </div>
  );
};


const Todo = ({todo, remove, toggle}) => {
  // Each Todo
  return (<li >

  <div id="checkBoxx" ><input type="checkbox" onChange={()=>{toggle(todo.id)}} /></div>
  <div id="todoText"
  style={{
    textDecoration:
    todo.completed_at==null?
      'none':
    'line-through'

  }}>{todo.name}</div>

  <button aria-label="Close Account Info Modal Box" onClick={() => {remove(todo.id)}}>&times;</button>
  </li>);
}


const TodoList = ({todos =[], remove, toggle}) => {
  // Map through the todos

  const todoNode = todos.map((todo,i) => {
    return (<Todo todo={todo} key={i} remove={remove} toggle={toggle}/>)
  });
  return (<ul>{todoNode}</ul>);

}

// Contaner Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    // this.apiURl='http://todolist.coligoapp.com/raghda/todos'
  }


  componentDidMount(){
  axios.get('http://todolist.coligoapp.com/raghda/todos')
    .then((response)=> {

      let todoList=response.data.todos;
      console.log(todoList);
      let todoData=todoList.map((todo)=>{return todo.name})
      console.log(todoData);
      // let testData=todoData[0];
      // console.log(todoData[0]);
      this.setState({data:response.data.todos});
    },
    function (error) {
      console.log(error);
    } ) ;


}
  //lifecycle method
  // compDidMount(){
  //   console.log("getmethoooood");
  // axios.get(this.apiUrl).then((response)=>{
  //   // Set state with result
  //   this.setState({data:response.data});
  //
  // });
  // }

  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {name: val, id: window.id++}
    axios.post('http://todolist.coligoapp.com/raghda/todos', todo)
       .then((response) => {
          this.state.data.push(response.data.todos);
          this.setState({data:response.data.todos});
       },function (error) {
         console.log(error);
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete('http://todolist.coligoapp.com/raghda/todos'+'/'+id)
      .then((response) => {
        this.setState({data: remainder});
      },function (error) {
        console.log(error);
      });
  }

  toggleTodo(id){

   axios.patch('http://todolist.coligoapp.com/raghda/todos'+'/'+id+'/toggle')
     .then((response) => {
      //  console.log(response);
       this.setState({data:response.data.todos});
     },function (error) {
       console.log(error);
     });

 }
 //   if(!todo[i].checked){
 //     this.state.todo[i].checked = true;
 //     this.state.todo[i].textDecor='line'
 //     this.setState({
 //      todo: this.state.todo
 //     });
 //   }
 //   else {
 //     this.state.todo[i].checked = false;
 //     this.state.todo[i].textDecor=null
 //     this.setState({
 //       todo: this.state.todo
 //     });
 //   }
 // };

  // toggleToDo(){
  //
  //   axios.patch('http://todolist.coligoapp.com/raghda/todos'+'/'+id+'/toggle')
  //     .then((response) => {
  //
  //       console.log(response);
  //     },function (error) {
  //       console.log(error);
  //     });
  //
  // }

  render(){
    // Render JSX
    return (
      <div>
        <Title />
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          toggle={this.toggleTodo.bind(this)}

        />
      </div>
    );
  }
}
ReactDOM.render(<TodoApp />, document.getElementById('container'));
