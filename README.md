# 🤖 AI Exercise Generator  

This project is a **web application for teachers** to automatically **generate exercises using AI** and manage them in a central dashboard.  
It allows teachers to **filter exercises by subject, delete them, and build exams** from generated exercises.  

The app is built with **React**, uses **Supabase** for database storage, and integrates with the **Cohere AI API** (can be adapted to OpenAI or other providers).  

---

## 🚀 Features  

- 🔹 **Generate Exercises with AI**  
  Teachers can enter a subject (e.g., *Maths, History, Science*) and instantly generate 3 detailed exercises with statements and corrections.  

- 🔹 **Save to Database**  
  Generated exercises are automatically saved to **Supabase** for later use.  

- 🔹 **Browse All Exercises**  
  View all exercises stored in the system, sorted by date.  

- 🔹 **Filter by Category**  
  Filter exercises by subject for quick access.  

- 🔹 **Manage Exercises**  
  Delete unnecessary exercises.  

- 🔹 **Exam Creation Ready**  
  Teachers can reuse the stored exercises to prepare exams.  

---

## 🛠️ Technologies Used  

**Frontend:**  
- React  
- React Router  
- Material-UI (MUI)  
- Axios  

**Backend / Database:**  
- Supabase  

**AI Integration:**  
- Cohere AI Generate API (or OpenAI GPT as alternative)  

**Other Tools / Libraries:**  
- JavaScript (ES6+)  
- Node.js (for project setup)  

---

## 📂 Project Structure  
```
/src
├── components
│ ├── AllExercice.jsx # List + filter all saved exercises
│ ├── Generate.jsx # Generate exercises using AI
├── App.js # Routes setup
├── index.js # Entry point
```
