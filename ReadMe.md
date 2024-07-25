# 🌐 Realtime Chatting with WebSockets & Robust Authentication

A dynamic chat application developed using Django, React, and MySQL featuring secure user authentication, real-time messaging, and persistent message storage. Users can find and invite others, chat instantly upon acceptance, and access message history.

## 🚀 Frontend

Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm install
npm run dev

```

Marvel at the responsive and captivating user interface crafted with the brilliance of Vite JS.

## 🛠️ Backend

1. Create a .env File
Navigate to the `backend` directory and create a `.env` file with the following content:

    ```.env
    DB_NAME=YOUR_DB_NAME
    DB_USER=YOUR_DB_USER
    DB_PASSWORD=YOUR_DB_PASSWORD
    DB_HOST=localhost
    DB_PORT=3306
    ```

    Replace `YOUR_DB_NAME`, `YOUR_DB_USER`, and `YOUR_DB_PASSWORD` with your actual database credentials.

2. Install dependencies using following terminal commands:

    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. Apply Migrations

    Apply the database migrations with:

    ```bash
    python manage.py makemigrations
    python manage.py makemigrations chat
    python manage.py migrate 
    ```

4. Create a Superuser

    Create a superuser for the Django admin interface:

    ```bash
    python manage.py createsuperuser 
    ```

5. Launch the Server

    Start the server and witness the magic unfold:

    ```bash
    python manage.py runserver
    ```

### 🔄 Change Server Target

If your server is running on a different port, update the `frontend/vite.config.js` file:

```js
export default defineConfig({
...
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", //change the target
        changeOrigin: true,
        secure: false,
      },
    },
...
  });

```

## 🚀Contribution to Future Enhancement

Here are some planned features and improvements for future versions of the application than you can contribute :

- **🔒End-to-End Encryption**: Implement end-to-end encryption to ensure that messages are secure and can only be read by the intended recipients.

- **👤User Online Status**: Introduce a feature to display users' online status, allowing others to see when their contacts are active.

- **📸 Profile Upload Functionalities**: Enable users to upload and manage profile pictures, enhancing personalization and user experience.

- **💬 Different Groups**: Support for creating and managing different chat groups, allowing users to engage in group conversations and manage group memberships.

- **🔄 Status Updates**: Implement status update functionality, allowing users to share and update their current status or mood.

- **📂 Media Upload Functionalities**: Allow users to upload and share media files (images, videos, etc.) within chat conversations, enhancing the richness of interactions.

We welcome contributions! Feel free to open issues, propose new features, or submit pull requests. Let's make this project even better together! 🎉

## 📝License

This project is licensed under the MIT License. 🚀
