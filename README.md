# Courseify

Courseify is a full-stack MERN (MongoDB, Express, React, Node.js) web application for online course management, featuring user authentication, admin dashboard, course creation, purchase, and cloud image upload.

---

## Features

- **User Authentication:** Signup, login, and protected routes for users and admins.
- **Admin Panel:** Create, manage, and delete courses.
- **Course Catalog:** Browse, search, and purchase courses.
- **Purchases:** Users can view their purchased courses.
- **Cloudinary Integration:** Course images are uploaded and served from Cloudinary.
- **Responsive UI:** Built with React and Tailwind CSS.
- **Secure API:** JWT-based authentication, CORS configured for production and development.

---

## Project Architecture

```
Courseify-2/
│
├── backend/
│   ├── index.js                # Main Express server setup
│   ├── .env                    # Environment variables (not committed)
│   ├── routes/
│   │   ├── course.routes.js    # Course-related API endpoints
│   │   ├── user.routes.js      # User authentication and purchase endpoints
│   │   └── admin.routes.js     # Admin authentication and management endpoints
│   ├── controllers/            # Business logic for each route (optional)
│   ├── models/                 # Mongoose models (Course, User, Admin, etc.)
│   ├── middlewares/            # Custom middleware (e.g., admin authentication)
│   └── ...                     # Other backend files
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components (Courses, Purchases, Signup, etc.)
│   │   ├── admin/              # Admin-specific React components
│   │   ├── utils/utlis.js      # Contains BACKEND_URL for API calls
│   │   └── App.js, index.js    # Main React app entry points
│   └── ...                     # Other frontend files
│
└── README.md                   # Project documentation
```

---

## How It Works

### Backend (Node.js + Express)
- **index.js** sets up the Express server, connects to MongoDB, configures CORS, and mounts all API routes.
- **Routes** are split into `/api/v1/course`, `/api/v1/user`, and `/api/v1/admin` for modularity.
- **Cloudinary** is used for image uploads.
- **CORS** is configured to allow requests from your deployed frontend and local development URLs.

### Frontend (React)
- **React Router** is used for navigation.
- **Components** handle user signup/login, course browsing, admin dashboard, and purchases.
- **API calls** use the `BACKEND_URL` from `src/utils/utlis.js` to communicate with the backend.
- **State management** is handled with React hooks (`useState`, `useEffect`).

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Courseify-2.git
cd Courseify-2
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, Cloudinary keys, and JWT secret
npm start
```

#### Example `.env`:
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

- Update `src/utils/utlis.js` with your backend URL (local or deployed).

---

## Deployment

- **Backend:** Deploy to [Render](https://render.com/), [Heroku](https://heroku.com/), or similar.
- **Frontend:** Deploy to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
- **CORS:** Make sure to add your deployed frontend URL to the backend's `allowedOrigins` array.

---

## Example API Endpoints

- `POST /api/v1/user/signup` — User registration
- `POST /api/v1/user/login` — User login
- `GET /api/v1/course/courses` — List all courses
- `POST /api/v1/course/create` — (Admin) Create a new course
- `POST /api/v1/admin/login` — Admin login
- `GET /api/v1/user/purchases` — Get user's purchased courses

---

## Security Notes

- Never commit your `.env` file or `node_modules/` to git.
- Always use HTTPS in production.
- Keep your JWT secret and Cloudinary credentials safe.

---

## License

MIT

---

## Authors

- [Your Name](https://github.com/yourusername)
- Saatvik Pandey

---

## Questions?

Open an issue or contact the maintainer.
