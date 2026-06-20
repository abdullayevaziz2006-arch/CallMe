package com.antigravity.translator

import android.telecom.Connection
import android.telecom.ConnectionRequest
import android.telecom.ConnectionService
import android.telecom.PhoneAccountHandle
import android.util.Log

class CallService : ConnectionService() {
    companion object {
        private const val TAG = "AntigravityCallService"
    }

    override fun onCreateIncomingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection {
        Log.d(TAG, "onCreateIncomingConnection triggered")
        val connection = CallConnection(applicationContext)
        connection.initializingCall(request)
        return connection
    }

    override fun onCreateOutgoingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection {
        Log.d(TAG, "onCreateOutgoingConnection triggered")
        val connection = CallConnection(applicationContext)
        connection.initializingCall(request)
        return connection
    }
}
