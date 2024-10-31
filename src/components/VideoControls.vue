<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'process', settings: {
    startTime: string,
    duration: string,
    outputFormat: string
  }): void
}>();

const props = defineProps<{
  isProcessing: boolean
}>();

const startTime = ref('0');
const duration = ref('10');
const outputFormat = ref('mp4');

const handleProcess = () => {
  emit('process', {
    startTime: startTime.value,
    duration: duration.value,
    outputFormat: outputFormat.value
  });
};
</script>

<template>
  <div class="controls">
    <div class="control-group">
      <label>Start Time (seconds):</label>
      <input 
        type="number" 
        v-model="startTime" 
        min="0" 
        :disabled="isProcessing"
      >
    </div>
    
    <div class="control-group">
      <label>Duration (seconds):</label>
      <input 
        type="number" 
        v-model="duration" 
        min="1" 
        :disabled="isProcessing"
      >
    </div>
    
    <div class="control-group">
      <label>Output Format:</label>
      <select v-model="outputFormat" :disabled="isProcessing">
        <option value="mp4">MP4</option>
        <option value="webm">WebM</option>
        <option value="gif">GIF</option>
      </select>
    </div>
    
    <button 
      @click="handleProcess" 
      :disabled="isProcessing"
      class="process-button"
    >
      {{ isProcessing ? 'Processing...' : 'Process Video' }}
    </button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input[type="number"],
select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #333;
  color: white;
}

.process-button {
  padding: 10px 20px;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.process-button:disabled {
  background: #4a4a4a;
  cursor: not-allowed;
}
</style>