package com.antigravity.translator.engine

import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

class TtsEngine(context: Context) : TextToSpeech.OnInitListener {
    companion object {
        private const val TAG = "AntigravityTtsEngine"
    }

    private var tts: TextToSpeech? = null
    private var isInitialized = false

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.US)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e(TAG, "Language not supported or missing data")
            } else {
                isInitialized = true
                Log.d(TAG, "Android TextToSpeech initialized successfully")
            }
        } else {
            Log.e(TAG, "TTS Initialization failed")
        }
    }

    fun speak(text: String, locale: Locale = Locale.US) {
        if (!isInitialized || tts == null) {
            Log.w(TAG, "TTS Engine not initialized yet")
            return
        }

        try {
            tts?.setLanguage(locale)
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "antigravity_utterance")
        } catch (e: Exception) {
            Log.e(TAG, "TTS playback error", e)
        }
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isInitialized = false
    }
}
