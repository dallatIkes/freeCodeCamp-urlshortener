# URL Shortener Microservice

## Project Overview

This is a **URL Shortener Microservice** built as a mini-project for [freeCodeCamp](https://www.freecodecamp.org/).  
It allows users to submit a URL and receive a numeric short URL. Users can then access the original URL using the short number.  

This version of the project uses **MongoDB** with **Mongoose** for persistent storage of URLs, allowing short URLs to be saved and retrieved across server restarts. A remote MongoDB database (Atlas or similar) is used via `process.env.MONGO_URI`.

---

## Features

- Shorten any valid URL into a numeric short URL.
- Redirect to the original URL using the short URL.
- Persistent storage using MongoDB and Mongoose.
- Modern frontend interface with:
  - Input field to submit URLs for shortening.
  - Display of the JSON response with the shortened URL.
  - Input field and button to access a short URL directly.
- Fully compatible with `application/x-www-form-urlencoded` forms.
- DNS validation to ensure submitted URLs are reachable.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dallatIkes/freeCodeCamp-urlshortener.git
cd freeCodeCamp-urlshortener
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your MongoDB connection string:

```text
MONGO_URI=your_mongodb_connection_string
```

4. Start the server:

```bash
npm run start
```

The server will run on `http://localhost:3000` by default.

---

## Usage

### Shorten a URL

- Enter a valid URL in the input field of the frontend form.
- Click **"Shorten URL"**.
- The JSON response will appear below the form:

```json
{
  "original_url": "https://www.example.com",
  "short_url": 1
}
```

### Access a Short URL

- Enter the numeric short URL in the second input field.
- Click **"Go"** to be redirected to the original URL.

---

## Example

1. Submit URL: `https://www.freecodecamp.org/`  
   JSON Response:

```json
{
  "original_url": "https://www.freecodecamp.org/",
  "short_url": 1
}
```

2. Access short URL `1` → redirects to `https://www.freecodecamp.org/`.

---

## Backend

- **Node.js** + **Express** serve the API endpoints.  
- **Mongoose** is used to define a `Link` schema with `original_url` and `short_url` fields.  
- When a URL is submitted:
  1. The backend validates that the URL is correctly formatted using the `URL` constructor.
  2. It checks DNS resolution to ensure the hostname is reachable.
  3. If the URL already exists in the database, it returns the existing short URL.
  4. Otherwise, it creates a new entry with an incremented numeric short URL.
- The API endpoints:
  - `POST /api/shorturl` → Create a new short URL.
  - `GET /api/shorturl/:short_url` → Redirect to the original URL.

---

## Frontend

- Simple HTML interface with:
  - Input field to submit URLs for shortening.
  - Display of JSON response.
  - Input and button to redirect using a short URL.
- Uses CSS to create a clean and modern look with uniform background (compatible with extensions like Dark Reader).

---

## Notes

- The project relies on a **remote MongoDB database**; the `MONGO_URI` environment variable must be set for it to work.  
- DNS lookup is used to prevent invalid or unreachable URLs from being shortened.  
- Compatible with the freeCodeCamp URL Shortener Microservice Challenge.

---

## License

This project is open source and available under the MIT License.
