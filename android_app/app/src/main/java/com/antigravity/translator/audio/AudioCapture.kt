package com.antigravity.translator.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import kotlin.math.sqrt

class AudioCapture(private val onAudioChunkCaptured: (ShortArray) -> Unit) {
    companion object {
        private const val TAG = "AntigravityAudioCapture"
        private const val SAMPLE_RATE = 16000
        private const val CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO
        private const val AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT
        private const val VAD_THRESHOLD = 500.0 // RMS threshold to filter silence
    }

    private var audioRecord: AudioRecord? = null
    private var isRecording = false
    private var recordingThread: Thread? = null
    val isCapturing: Boolean get() = isRecording

    @SuppressLint("MissingPermission")
    fun start() {
        if (isRecording) return
        
        val minBufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT)
        if (minBufferSize == AudioRecord.ERROR_BAD_VALUE) {
            Log.e(TAG, "Invalid Audio Parameters")
            return
        }

        // We capture using MediaRecorder.AudioSource.VOICE_COMMUNICATION to get echo cancellation
        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.VOICE_COMMUNICATION,
            SAMPLE_RATE,
            CHANNEL_CONFIG,
            AUDIO_FORMAT,
            minBufferSize * 2
        )

        if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
            Log.e(TAG, "AudioRecord initialization failed")
            return
        }

        audioRecord?.startRecording()
        isRecording = true
        Log.d(TAG, "Audio recording started")

        recordingThread = Thread {
            // Buffer size of 3200 shorts = 200ms of audio at 16kHz
            val buffer = ShortArray(3200)
            while (isRecording) {
                val readResult = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                if (readResult > 0) {
                    val pcmData = buffer.copyOf(readResult)
                    if (isSpeechDetected(pcmData)) {
                        onAudioChunkCaptured(pcmData)
                    }
                }
            }
        }.apply {
            priority = Thread.MAX_PRIORITY
            start()
        }
    }

    fun stop() {
        if (!isRecording) return
        isRecording = false
        recordingThread?.join()
        recordingThread = null

        try {
            audioRecord?.stop()
            audioRecord?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping AudioRecord", e)
        }
        audioRecord = null
        Log.d(TAG, "Audio recording stopped")
    }

    // Voice Activity Detection (VAD) via Root Mean Square (RMS) calculation
    private fun isSpeechDetected(audioData: ShortArray): Boolean {
        var sum = 0.0
        for (sample in audioData) {
            sum += sample * sample
        }
        val rms = sqrt(sum / audioData.size)
        return rms > VAD_THRESHOLD
    }
}
