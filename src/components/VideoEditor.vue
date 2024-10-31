<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
const isReady = ref(false);
const isProcessing = ref(false);
const videoFile = ref<File | null>(null);
const processedVideoUrl = ref('');
const message = ref('');

onMounted(async () => {
  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    isReady.value = true;
    message.value = 'FFmpeg is ready!';
  } catch (error) {
    message.value = 'Error loading FFmpeg: ' + error;
  }
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    videoFile.value = input.files[0];
  }
};

const processVideo = async () => {
  if (!videoFile.value) {
    message.value = 'Please select a video file first';
    return;
  }

  try {
    isProcessing.value = true;
    message.value = 'Processing video...';

    // Write the file to FFmpeg's file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile.value));

    // Run FFmpeg command (example: compress video)
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'fast',
      '-c:a', 'aac',
      'output.mp4'
    ]);

    // Read the processed file
    const data = await ffmpeg.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    processedVideoUrl.value = URL.createObjectURL(blob);
    message.value = 'Video processing complete!';
  } catch (error) {
    message.value = 'Error processing video: ' + error;
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="video-editor">
    <h2>Video Editor</h2>
    <p>{{ message }}</p>

    <div v-if="isReady" class="controls">
      <input 
        type="file" 
        accept="video/*" 
        @change="handleFileChange" 
        :disabled="isProcessing"
      >
      
      <button 
        @click="processVideo" 
        :disabled="!videoFile || isProcessing"
      >
        {{ isProcessing ? 'Processing...' : 'Process Video' }}
      </button>

      <div v-if="videoFile" class="preview">
        <h3>Original Video:</h3>
        <video 
          :src="videoFile ? URL.createObjectURL(videoFile) : ''" 
          controls 
          width="400"
        ></video>
      </div>

      <div v-if="processedVideoUrl" class="preview">
        <h3>Processed Video:</h3>
        <video 
          :src="processedVideoUrl" 
          controls 
          width="400"
        ></video>
      </div>
    </div>

    <div v-else class="loading">
      Loading FFmpeg...
    </div>
  </div>
</template>

<style scoped>
.video-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin: 20px 0;
}

.preview {
  margin: 20px 0;
}

button {
  margin: 10px 0;
  padding: 8px 16px;
}

input[type="file"] {
  margin: 10px 0;
}

video {
  max-width: 100%;
  margin: 10px 0;
}
</style>