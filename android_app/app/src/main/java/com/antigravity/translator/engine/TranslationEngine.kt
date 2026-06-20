package com.antigravity.translator.engine

import android.content.Context
import android.util.Log
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class TranslationEngine(private val context: Context) {
    companion object {
        private const val TAG = "AntigravityTranslation"
    }

    private var ortEnv: OrtEnvironment? = null
    private var ortSession: OrtSession? = null
    private var isOfflineReady = false
    private val scope = CoroutineScope(Dispatchers.IO)

    init {
        initializeOnnx()
    }

    private fun initializeOnnx() {
        scope.launch {
            try {
                ortEnv = OrtEnvironment.getEnvironment()
                val modelFile = context.getFileStreamPath("nllb_200_distilled.onnx")
                if (modelFile.exists()) {
                    ortSession = ortEnv?.createSession(modelFile.absolutePath, OrtSession.SessionOptions())
                    isOfflineReady = true
                    Log.d(TAG, "ONNX NLLB offline translation model loaded successfully")
                } else {
                    Log.w(TAG, "NLLB model file not found, falling back to Online API translation")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error initializing ONNX runtime", e)
            }
        }
    }

    fun translate(
        text: String,
        sourceLang: String,
        targetLang: String,
        onTranslationCompleted: (String) -> Unit
    ) {
        scope.launch {
            if (isOfflineReady && ortSession != null) {
                val translated = runOfflineTranslation(text, sourceLang, targetLang)
                withContext(Dispatchers.Main) {
                    onTranslationCompleted(translated)
                }
            } else {
                val translated = runOnlineTranslation(text, sourceLang, targetLang)
                withContext(Dispatchers.Main) {
                    onTranslationCompleted(translated)
                }
            }
        }
    }

    private fun runOfflineTranslation(text: String, src: String, target: String): String {
        return try {
            // Tokenizer preprocessing and inference placeholder
            "Offline Tarjima: $text"
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    private fun runOnlineTranslation(text: String, src: String, target: String): String {
        var connection: HttpURLConnection? = null
        return try {
            val srcLocale = if (src == "uz") "uz" else "en"
            val targetLocale = if (target == "en") "en" else "uz"

            val urlStr = "https://api.mymemory.translated.net/get?q=" +
                    URLEncoder.encode(text, "UTF-8") +
                    "&langpair=" + srcLocale + "|" + targetLocale
            
            val url = URL(urlStr)
            connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 5000
            connection.readTimeout = 5000

            val responseCode = connection.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()

                val jsonObject = JSONObject(response.toString())
                val responseData = jsonObject.getJSONObject("responseData")
                responseData.getString("translatedText")
            } else {
                "Translation Error ($responseCode)"
            }
        } catch (e: Exception) {
            Log.e(TAG, "Online translation failed", e)
            "Translate Error: ${e.message}"
        } finally {
            connection?.disconnect()
        }
    }

    fun release() {
        ortSession?.close()
        ortSession = null
        ortEnv?.close()
        ortEnv = null
        isOfflineReady = false
    }
}
