package com.antigravity.translator

import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.telecom.Connection
import android.telecom.ConnectionRequest
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import com.antigravity.translator.audio.AudioCapture
import com.antigravity.translator.engine.SttEngine
import com.antigravity.translator.engine.TranslationEngine
import com.antigravity.translator.engine.TtsEngine

class CallConnection(private val context: Context) : Connection() {
    companion object {
        private const val TAG = "AntigravityConnection"
    }

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var audioCapture: AudioCapture? = null
    private var sttEngine: SttEngine? = null
    private var translationEngine: TranslationEngine? = null
    private var ttsEngine: TtsEngine? = null

    fun initializingCall(request: ConnectionRequest?) {
        Log.d(TAG, "Initializing call connection")
        connectionCapabilities = CAPABILITY_MUTE or CAPABILITY_SUPPORT_HOLD
        audioModeIsVoip = false
    }

    override fun onAnswer() {
        super.onAnswer()
        Log.d(TAG, "Call answered")
        setActive()
        showTranslationOverlay()
        startAudioProcessing()
    }

    override fun onDisconnect() {
        super.onDisconnect()
        Log.d(TAG, "Call disconnected")
        setDisconnected(android.telecom.DisconnectCause(android.telecom.DisconnectCause.LOCAL))
        destroyTranslationOverlay()
        stopAudioProcessing()
        destroy()
    }

    private fun showTranslationOverlay() {
        if (overlayView != null) return
        
        windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        
        val layoutInflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        overlayView = layoutInflater.inflate(R.layout.call_overlay, null)

        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            y = 100 // Offset from bottom of screen
        }

        overlayView?.let { view ->
            val tvOriginal = view.findViewById<TextView>(R.id.tv_original)
            val tvTranslated = view.findViewById<TextView>(R.id.tv_translated)
            val btnToggle = view.findViewById<Button>(R.id.btn_toggle_translate)

            btnToggle.setOnClickListener {
                if (audioCapture?.isCapturing == true) {
                    audioCapture?.stop()
                    btnToggle.text = "Translate (OFF)"
                    tvOriginal.text = "Tarjima to'xtatildi."
                    tvTranslated.text = ""
                } else {
                    audioCapture?.start()
                    btnToggle.text = "Translate (ON)"
                    tvOriginal.text = "Eshitish jarayoni faollashmoqda..."
                }
            }

            windowManager?.addView(view, params)
        }
    }

    private fun startAudioProcessing() {
        sttEngine = SttEngine(context)
        translationEngine = TranslationEngine(context)
        ttsEngine = TtsEngine(context)

        audioCapture = AudioCapture { pcmData ->
            sttEngine?.processAudio(pcmData) { originalText ->
                if (originalText.isNotEmpty()) {
                    updateOriginalSubtitle(originalText)
                    translationEngine?.translate(originalText, "uz", "en") { translatedText ->
                        updateTranslatedSubtitle(translatedText)
                        ttsEngine?.speak(translatedText)
                    }
                }
            }
        }
    }

    private fun updateOriginalSubtitle(text: String) {
        overlayView?.post {
            val tvOriginal = overlayView?.findViewById<TextView>(R.id.tv_original)
            tvOriginal?.text = text
        }
    }

    private fun updateTranslatedSubtitle(text: String) {
        overlayView?.post {
            val tvTranslated = overlayView?.findViewById<TextView>(R.id.tv_translated)
            tvTranslated?.text = "➔ $text"
        }
    }

    private fun stopAudioProcessing() {
        audioCapture?.stop()
        sttEngine?.release()
        translationEngine?.release()
        ttsEngine?.release()
    }

    private fun destroyTranslationOverlay() {
        overlayView?.let {
            windowManager?.removeView(it)
            overlayView = null
        }
    }
}
