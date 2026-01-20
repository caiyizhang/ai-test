<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <a-layout class="bg-transparent">
      <!-- Updated Header: Darker background for better visibility -->
      <a-layout-header class="bg-blue-600 shadow-sm rounded-lg mb-8 flex items-center px-6 h-auto py-4">
        <h1 class="text-2xl font-bold text-white m-0">Kanban Board</h1>
      </a-layout-header>

      <a-layout-content>
        <!-- Add Task Section -->
        <div class="mb-8 flex justify-center">
          <div class="w-full max-w-xl flex gap-4">
            <a-input 
              v-model:value="newTaskTitle" 
              placeholder="What needs to be done?" 
              size="large"
              @keyup.enter="addTask"
              class="rounded-lg shadow-sm"
            >
              <template #prefix>
                <plus-outlined class="text-gray-400" />
              </template>
            </a-input>
            <a-button type="primary" size="large" @click="addTask" class="rounded-lg px-8 shadow-sm bg-blue-600 hover:bg-blue-700">
              Add Task
            </a-button>
          </div>
        </div>

        <!-- Board Columns -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Todo Column: Blue Background -->
          <div class="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-lg font-semibold text-gray-700 m-0">To Do</h2>
              <a-tag color="blue" class="rounded-full px-3">{{ todoTasks.length }}</a-tag>
            </div>
            <draggable 
              v-model="todoTasks" 
              group="tasks" 
              item-key="id"
              class="flex-1 min-h-[200px]"
              ghost-class="ghost-card"
              @change="(e) => onChange(e, 'todo')"
            >
              <template #item="{ element }">
                <a-card class="mb-3 cursor-move hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500 rounded-lg" size="small">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="font-medium text-gray-800">{{ element.title }}</div>
                      <div v-if="element.description" class="text-gray-500 text-sm mt-2">{{ element.description }}</div>
                    </div>
                    <delete-outlined @click.stop="deleteTask(element.id)" class="text-red-400 hover:text-red-600 ml-2 mt-1 cursor-pointer"/>
                  </div>
                </a-card>
              </template>
            </draggable>
          </div>

          <!-- Doing Column: Orange Background -->
          <div class="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-100 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-lg font-semibold text-gray-700 m-0">In Progress</h2>
              <a-tag color="orange" class="rounded-full px-3">{{ doingTasks.length }}</a-tag>
            </div>
            <draggable 
              v-model="doingTasks" 
              group="tasks" 
              item-key="id" 
              class="flex-1 min-h-[200px]"
              ghost-class="ghost-card"
              @change="(e) => onChange(e, 'doing')"
            >
              <template #item="{ element }">
                <a-card class="mb-3 cursor-move hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500 rounded-lg" size="small">
                   <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="font-medium text-gray-800">{{ element.title }}</div>
                      <div v-if="element.description" class="text-gray-500 text-sm mt-2">{{ element.description }}</div>
                    </div>
                    <delete-outlined @click.stop="deleteTask(element.id)" class="text-red-400 hover:text-red-600 ml-2 mt-1 cursor-pointer"/>
                  </div>
                </a-card>
              </template>
            </draggable>
          </div>

          <!-- Done Column: Green Background -->
          <div class="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-lg font-semibold text-gray-700 m-0">Done</h2>
              <a-tag color="green" class="rounded-full px-3">{{ doneTasks.length }}</a-tag>
            </div>
            <draggable 
              v-model="doneTasks" 
              group="tasks" 
              item-key="id" 
              class="flex-1 min-h-[200px]"
              ghost-class="ghost-card"
              @change="(e) => onChange(e, 'done')"
            >
              <template #item="{ element }">
                <a-card class="mb-3 cursor-move hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500 rounded-lg opacity-75 hover:opacity-100" size="small">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="font-medium text-gray-800 line-through decoration-gray-400">{{ element.title }}</div>
                      <div v-if="element.description" class="text-gray-500 text-sm mt-2">{{ element.description }}</div>
                    </div>
                    <delete-outlined @click.stop="deleteTask(element.id)" class="text-red-400 hover:text-red-600 ml-2 mt-1 cursor-pointer"/>
                  </div>
                </a-card>
              </template>
            </draggable>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import axios from 'axios';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const API_URL = 'http://localhost:8001/api/tasks/';

export default {
  components: {
    draggable,
    PlusOutlined,
    DeleteOutlined,
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
        message.error('Failed to load tasks');
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
        message.success('Task added successfully');
      } catch (error) {
        console.error('Error adding task:', error);
        message.error('Failed to add task');
      }
    },
    async deleteTask(id) {
        try {
            await axios.delete(`${API_URL}${id}/`);
            this.todoTasks = this.todoTasks.filter(t => t.id !== id);
            this.doingTasks = this.doingTasks.filter(t => t.id !== id);
            this.doneTasks = this.doneTasks.filter(t => t.id !== id);
            message.success('Task deleted');
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('Failed to delete task');
        }
    },
    async onChange(event, status) {
      if (event.added) {
        const task = event.added.element;
        try {
          await axios.patch(`${API_URL}${task.id}/`, { status: status });
          message.success(`Moved to ${status}`);
        } catch (error) {
          console.error('Error updating task status:', error);
          message.error('Failed to update status');
          // Revert change locally if failed (simplified, ideal would be reload)
          this.fetchTasks(); 
        }
      }
    }
  },
};
</script>

<style scoped>
.ghost-card {
  opacity: 0.5;
  background: #f0f0f0;
  border: 1px dashed #ccc;
}
</style>
