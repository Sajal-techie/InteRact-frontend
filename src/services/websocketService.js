
let ws = null

export const initializeWebSocket = (token, onMessageReceived) => {
    ws = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/ws/chat/?token=${token}`)
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        onMessageReceived(data)
    }
}

export const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify(message))
    }
}

export const closeWebSocket = () => {
    if(ws) {
        ws.close()
    }
}