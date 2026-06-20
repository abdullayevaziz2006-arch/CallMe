package com.antigravity.translator

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.TextView
import com.antigravity.translator.engine.TranslationEngine
import com.antigravity.translator.engine.TtsEngine

class TranslationAccessibilityService : AccessibilityService() {
    companion object {
        private const val TAG = "TranslationAccessibility"
    }

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var translationEngine: TranslationEngine? = null
    private var ttsEngine: TtsEngine? = null
    private var lastCapturedText: String = ""

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")
        translationEngine = TranslationEngine(applicationContext)
        ttsEngine = TtsEngine(applicationContext)
        showOverlay()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val rootNode = rootInActiveWindow ?: return
        
        val textNodes = ArrayList<AccessibilityNodeInfo>()
        findTextNodes(rootNode, textNodes)

        if (textNodes.isNotEmpty()) {
            val latestNode = textNodes.last()
            val text = latestNode.text?.toString() ?: ""
            
            if (text.isNotEmpty() && text != lastCapturedText) {
                lastCapturedText = text
                Log.d(TAG, "New message intercepted: $text")

                translationEngine?.translate(text, "en", "uz") { translatedText ->
                    updateOverlayText(text, translatedText)
                    ttsEngine?.speak(translatedText)
                }
            }
        }
    }

    private fun findTextNodes(node: AccessibilityNodeInfo, list: ArrayList<AccessibilityNodeInfo>) {
        if (node.className == "android.widget.TextView" && node.text != null) {
            list.add(node)
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (child != null) {
                findTextNodes(child, list)
            }
        }
    }

    private fun showOverlay() {
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        overlayView = inflater.inflate(R.layout.call_overlay, null)

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
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            y = 150
        }

        overlayView?.let { view ->
            view.findViewById<View>(R.id.btn_toggle_translate).visibility = View.GONE
            val tvOriginal = view.findViewById<TextView>(R.id.tv_original)
            tvOriginal.text = "Antigravity Messenger Translation Active"
            windowManager?.addView(view, params)
        }
    }

    private fun updateOverlayText(original: String, translated: String) {
        overlayView?.post {
            val tvOriginal = overlayView?.findViewById<TextView>(R.id.tv_original)
            val tvTranslated = overlayView?.findViewById<TextView>(R.id.tv_translated)
            tvOriginal?.text = original
            tvTranslated?.text = "➔ $translated"
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "Service Interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        overlayView?.let {
            windowManager?.removeView(it)
            overlayView = null
        }
        translationEngine?.release()
        ttsEngine?.release()
    }
}
