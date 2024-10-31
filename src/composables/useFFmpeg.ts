import { ref } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const ffmpeg = new FFmpeg();
  const isReady = ref(false);
  const isProcessing = ref(false);

  const loadFFmpeg = async () => {
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm', 'application/wasm'),
        wasmURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm', 'application/wasm'),
        workerURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.worker.js', 'text/javascript')
      });
      isReady.value = true;
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw error;
    }
  };

  const processVideo = async (
    file: File,
    startTime: string,
    duration: string,
    outputFormat: string
  ) => {
    if (!isReady.value) {
      throw new Error('FFmpeg is not ready');
    }

    isProcessing.value = true;
    try {
      const inputFileName = 'input.mp4';
      const outputFileName = `output.${outputFormat}`;

      // Write input file to memory
      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      // Run FFmpeg command
      await ffmpeg.exec([
        '-i', inputFileName,
        '-ss', startTime,
        '-t', duration,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        outputFileName
      ]);

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName);
      const blob = new Blob([data], { type: `video/${outputFormat}` });
      return URL.createObjectURL(blob);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    isReady,
    isProcessing,
    loadFFmpeg,
    processVideo
  };
}