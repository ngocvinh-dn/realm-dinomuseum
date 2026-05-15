import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Ion } from "cesium";
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDQxYzA5My04NDk0LTQyMTEtOTdhMC05MWUzYTc1ZmIzMTMiLCJpZCI6NDMxNTUxLCJpc3MiOiJodHRwczovL2lvbi5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3Nzg3NjI0ODB9.mkE1SyDbQoHTXqVel6LrwUOygrElQixrcw4b-q4iRQ8';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
