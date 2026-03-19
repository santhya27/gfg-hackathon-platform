import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import google.generativeai as genai
from dotenv import load_dotenv  # <--- NEW LINE 1

load_dotenv()  # <--- NEW LINE 2: This reads your .env file automatically!

app = FastAPI()

# --- FIX 1: CORRECTED CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False, # Must be False when origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FIX 2: SECURE AI CONFIGURATION ---
# This pulls the secret key from your .env file (locally) or Render (live)!
api_key = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash') 

def get_db_connection():
    conn = sqlite3.connect('hackathon.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rollNo TEXT NOT NULL,
            email TEXT NOT NULL,
            eventTitle TEXT NOT NULL,
            ticketId TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class Event(BaseModel):
    title: str
    date: str
    location: str

class Registration(BaseModel):
    name: str
    rollNo: str
    email: str
    eventTitle: str
    ticketId: str

class ChatMessage(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "GfG Hackathon Backend is Live!"}

@app.get("/api/events")
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM events').fetchall()
    conn.close()
    return [dict(event) for event in events]

@app.post("/api/events")
def create_event(event: Event):
    conn = get_db_connection()
    conn.execute('INSERT INTO events (title, date, location) VALUES (?, ?, ?)',
                 (event.title, event.date, event.location))
    conn.commit()
    conn.close()
    return {"message": "Event published successfully!"}

@app.delete("/api/events/{event_id}")
def delete_event(event_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()
    return {"message": "Event deleted successfully!"}

@app.post("/api/register")
def register_student(reg: Registration):
    conn = get_db_connection()
    existing = conn.execute('SELECT * FROM registrations WHERE rollNo = ? AND eventTitle = ?', (reg.rollNo, reg.eventTitle)).fetchone()
    
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="This Roll Number is already registered for this event!")

    conn.execute('INSERT INTO registrations (name, rollNo, email, eventTitle, ticketId) VALUES (?, ?, ?, ?, ?)',
                 (reg.name, reg.rollNo, reg.email, reg.eventTitle, reg.ticketId))
    conn.commit()
    conn.close()
    return {"message": "Student registered successfully!"}

@app.get("/api/registrations")
def get_all_registrations():
    conn = get_db_connection()
    regs = conn.execute('SELECT * FROM registrations').fetchall()
    conn.close()
    return [dict(reg) for reg in regs]

# --- AI CHAT ENDPOINT ---
@app.post("/api/chat")
def chat_with_ai(chat: ChatMessage):
    try:
        system_prompt = f"""
        You are 'GeekBot', the official, friendly AI assistant for the GeeksforGeeks (GfG) RIT Campus Club. 
        Keep your answers concise, helpful, and enthusiastic. Use emojis.
        User asks: {chat.message}
        """
        response = model.generate_content(system_prompt)
        return {"reply": response.text}
    except Exception as e:
        print("AI Error:", e)
        return {"reply": "Oops! My AI circuits are currently resting. Please try again later! 🤖💤"}