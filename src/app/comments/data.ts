export const comments = [
  {
    id: 1,  // Unique identifier for the comment
    text: 'This is the first comment.',  // The content of the comment
    author: 'Alice',  // The author of the comment
    timestamp: '2023-10-01T12:00:00Z'  // ISO 8601 format timestamp of when the comment was created
  },
  {
    id: 2,
    text: 'This is the second comment.',
    author: 'Bob',  // The author of the comment
    timestamp: '2023-10-01T12:05:00Z'  // ISO 8601 format timestamp of when the comment was created
  },
  {
    id: 3,
    text: 'This is the third comment.',
    author: 'Charlie',  // The author of the comment
    timestamp: '2023-10-01T12:10:00Z'  // ISO 8601 format timestamp of when the comment was created
  }
];

// This file exports an array of comment objects, each with a unique ID, text content, author name, and timestamp.
// The comments can be used in various parts of the application, such as displaying them on a page or processing them in an API route.