# Use lightweight nginx to serve static frontend
FROM nginx:alpine

# Copy built frontend artifacts into nginx html folder
COPY frontend/ /usr/share/nginx/html

# Expose port 80 inside container
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
