<template>
  <div class="kanban-container">
    <div class="add-task-form">
      <input v-model="newTaskTitle" placeholder="New Task Title" @keyup.enter="addTask" class="task-input" />
      <button @click="addTask" class="add-btn">Add Task</button>
    </div>
    
    <div class="kanban-board">
      <div class="column">
        <h2>To Do</h2>
        <draggable 
          v-model="todoTasks" 
          group="tasks" 
          item-key="id"
          class="drag-area"
          @change="(e) => onChange(e, 'todo')"
        >
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p v-if="element.description">{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>

      <div class="column">
        <h2>Doing</h2>
        <draggable 
          v-model="doingTasks" 
          group="tasks" 
          item-key="id" 
          class="drag-area"
          @change="(e) => onChange(e, 'doing')"
        >
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p v-if="element.description">{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>

      <div class="column">
        <h2>Done</h2>
        <draggable 
          v-model="doneTasks" 
          group="tasks" 
          item-key="id" 
          class="drag-area"
          @change="(e) => onChange(e, 'done')"
        >
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p v-if="element.description">{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import axios from 'axios';

const API_URL = 'http://localhost:8001/api/tasks/';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      newTaskTitle: '',
      todoTasks: [],
      doingTasks: [],
      doneTasks: [],
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get(API_URL);
        const tasks = response.data;
        this.todoTasks = tasks.filter(t => t.status === 'todo');
        this.doingTasks = tasks.filter(t => t.status === 'doing');
        this.doneTasks = tasks.filter(t => t.status === 'done');
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async addTask() {
      if (!this.newTaskTitle.trim()) return;
      try {
        const response = await axios.post(API_URL, {
          title: this.newTaskTitle,
          status: 'todo'
        });
        this.todoTasks.push(response.data);
        this.newTaskTitle = '';
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async onChange(event, status) {
      if (event.added) {
        const task = event.added.element;
        try {
          await axios.patch(`${API_URL}${task.id}/`, { status: status });
        } catch (error) {
          console.error('Error updating task status:', error);
        }
      }
    }
  },
};
</script>

<style scoped>
.kanban-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.add-task-form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.task-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  max-width: 300px;
}
.add-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-btn:hover {
  background-color: #3aa876;
}
.kanban-board {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.column {
  flex: 1;
  background: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  min-width: 250px;
}
.column h2 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}
.drag-area {
  min-height: 200px;
}
.task-card {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.task-card:active {
  cursor: grabbing;
}
.task-card h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}
.task-card p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}
</style>
