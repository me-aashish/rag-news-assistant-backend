# 📰 RAG Backend – News Assistant

This is the **backend** for the Retrieval-Augmented Generation (RAG) powered news assistant.  
It provides a clean, interactive interface for chatting with the assistant, managing sessions, and displaying AI responses retrieved via the backend.

---

## 🚀 Features

- 🔹 Session-based chat with history stored in Redis
- 🔹 Embedding generation via external service
- 🔹 Vector search using Qdrant
- 🔹 LLM integration (Gemini)
- 🔹 REST and Socket.IO APIs

---

## 🛠️ Run Backend

Follow these steps to run the backend:

1. **Install Prerequisites**  
   Ensure you have the following installed:

   - [Docker / Docker Desktop](https://docs.docker.com/get-docker/)
   - [docker-compose](https://docs.docker.com/compose/install/)

2. **Start Redis Service**  
   Make sure the Redis service is **running on port `6379`**. Run this command from the repository root (where `redis.yml` is located):

   ```bash
   docker-compose -f redis.yml up -d
   ```

3. **Start Qdrant Service**  
   Make sure the Qdrant service is **running on port `6333`**. Run this command from the repository root (where `qdrant.yml` is located):

   ```bash
   docker-compose -f qdrant.yml up -d
   ```

4. **Start Embedder Service**  
   Make sure the Embedder service is **running on port `3002`**. Run this command from the repository root (where `embedder.yml` is located):

   ```bash
   docker-compose -f embedder.yml up -d
   ```

5. **Start Ingestor Service**  
   Make sure to run Ingestor service\*\*. Run this command from the repository root (where `ingestor.yml` is located):

   ```bash
   docker-compose -f ingestor.yml up -d

   ```

6. **Start backend Service**  
   Now run backend service. Run this command from the repository root (where `backend.yml` is located):
   ```bash
   docker-compose -f backend.yml up -d
   ```
