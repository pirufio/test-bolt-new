<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'fileSelected', file: File): void
}>();

const videoFile = ref<File | null>(null);
const videoPreview = ref<string>('');

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    videoFile.value = input.files[0];
    videoPreview.value = URL.createObjectURL(input.files[0]);
    emit('fileSelected', input.files[0]);
  }
};
</script>

<template>
  <div class="upload-section">
    <input 
      type="file" 
      accept="video/*" 
      @change="handleFileUpload"
    >
    <video 
      v-if="videoPreview"
      :src="videoPreview" 
      controls 
      class="video-preview"
    ></video>
  </div>
</template>

<style scoped>
.upload-section {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-preview {
  max-width: 100%;
  max-height: 400px;
  margin-top: 1rem;
}
</style>