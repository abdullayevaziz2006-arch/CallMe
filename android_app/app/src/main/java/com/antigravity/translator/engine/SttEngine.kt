package com.antigravity.translator.engine

import android.content.Context
import android.util.Log
import org.json.JSONObject
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.StorageService
import java.io.IOException

class SttEngine(private val context: Context) {
    companion object {
        private const val TAG = "AntigravitySttEngine"
        private const val SAMPLE_RATE = 16000.0f
    }

    private var voskModel: Model? = null
    private var voskRecognizer: Recognizer? = null
    private var isInitialized = false

    init {
        initializeVosk()
    }

    private fun initializeVosk() {
        // Vosk requires unpacking model files from assets folder to external/internal device storage
        StorageService.unpack(context, "model-en-us", "model",
            { model ->
                try {
                    voskModel = model
                    voskRecognizer = Recognizer(voskModel, SAMPLE_RATE)
                    isInitialized = true
                    Log.d(TAG, "Vosk offline STT initialized successfully")
                } catch (e: Exception) {
                    Log.e(TAG, "Vosk Recognizer creation failed", e)
                }
            },
            { exception ->
                Log.e(TAG, "Vosk model unpacking failed", exception)
            }
        )
    }

    fun processAudio(pcmData: ShortArray, onTextRecognized: (String) -> Unit) {
        if (!isInitialized || voskRecognizer == null) {
            Log.w(TAG, "STT Engine not initialized yet")
            return
        }

        // Write raw shorts to recognizer
        val resultReady = voskRecognizer?.acceptWaveForm(pcmData, pcmData.size) ?: false
        if (resultReady) {
            val jsonResult = voskRecognizer?.result ?: ""
            val text = parseVoskText(jsonResult)
            if (text.isNotEmpty()) {
                onTextRecognized(text)
            }
        } else {
            // Check partial results if continuous stream transcription is needed
            val jsonPartial = voskRecognizer?.partialResult ?: ""
            Log.d(TAG, "Partial: $jsonPartial")
        }
    }

    private fun parseVoskText(json: String): String {
        if (json.isEmpty()) return ""
        return try {
            val obj = JSONObject(json)
            obj.optString("text", "")
        } catch (e: Exception) {
            ""
        }
    }

    fun release() {
        voskRecognizer?.close()
        voskRecognizer = null
        voskModel = null
        isInitialized = false
    }
}
