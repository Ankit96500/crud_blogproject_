const crudCrudApiUrl = 'https://crudcrud.com/api/c7fc43bdb0b24f4d926132eab68d773d/blogs'; // Replace with your crudcrud API key

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogs();
});

document.getElementById('blog-form').addEventListener('submit', handleFormSubmit);

let editingBlogId = null;

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const blogData = {
        title: document.getElementById('title').value,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
    };

    if (editingBlogId) {
        // Update the existing blog
        updateBlog(editingBlogId, blogData);
    } else {
        // Create a new blog
        createBlog(blogData);
    }

    // Reset the form fields
    document.getElementById('blog-form').reset();
}

// Fetch all blogs
function fetchBlogs() {
    axios.get(crudCrudApiUrl)
        .then(response => {
            const blogs = response.data;
            document.getElementById('blog-list').innerHTML = '';
            blogs.forEach(blog => displayBlogOnScreen(blog));
            updateBlogCount(blogs.length);
        })
        .catch(error => console.log('Error fetching blogs:', error));
}

// Create a new blog (POST)
function createBlog(blogData) {
    axios.post(crudCrudApiUrl, blogData)
        .then(response => {
            displayBlogOnScreen(response.data);
            updateBlogCount();
        })
        .catch(error => console.log('Error posting blog:', error));
}

// Display a blog on the screen
function displayBlogOnScreen(blog) {
    const blogList = document.getElementById('blog-list');
    const blogPost = document.createElement('div');
    blogPost.classList.add('blog-post');
    blogPost.setAttribute('data-id', blog._id);

    blogPost.innerHTML = `
        <h3>${blog.title}</h3>
        <img src="${blog.imageUrl}" alt="${blog.title}">
        <p>${blog.description}</p>
        <button onclick="editBlog('${blog._id}')">Edit</button>
        <button onclick="deleteBlog('${blog._id}')">Delete</button>
    `;

    blogList.appendChild(blogPost);
    updateBlogCount();
}

// Update a blog (PUT)
function updateBlog(id, updatedData) {
    axios.put(`${crudCrudApiUrl}/${id}`, updatedData)
        .then(() => {
            fetchBlogs();  // Refresh the blog list after update
            editingBlogId = null;  // Reset editing state
        })
        .catch(error => console.log('Error updating blog:', error));
}

// Edit a blog
function editBlog(id) {
    axios.get(`${crudCrudApiUrl}/${id}`)
        .then(response => {
            const blog = response.data;
            document.getElementById('title').value = blog.title;
            document.getElementById('imageUrl').value = blog.imageUrl;
            document.getElementById('description').value = blog.description;
            editingBlogId = id;  // Set the blog id to edit
        })
        .catch(error => console.log('Error fetching blog for edit:', error));
}

// Delete a blog (DELETE)
function deleteBlog(id) {
    axios.delete(`${crudCrudApiUrl}/${id}`)
        .then(() => {
            fetchBlogs();  // Refresh the blog list after deletion
        })
        .catch(error => console.log('Error deleting blog:', error));
}

// Update the blog count
function updateBlogCount(count = null) {
    const blogCountElement = document.getElementById('blogCount');
    const currentCount = count !== null ? count : document.querySelectorAll('.blog-post').length;
    blogCountElement.textContent = currentCount;
}



