# Use an Ubuntu base image
FROM ubuntu:22.04

# Install necessary dependencies
# RUN apt-get update && apt-get install -y \
#     gnupg \
#     wget \
#     lsb-release \
#     curl \
#     software-properties-common \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# # Install Node.js
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt-get install -y nodejs

# # Set the working directory
# WORKDIR /premium-sigmadialer

# Copy the application files to the container
COPY . /premium-sigmadialer

# Install the app dependencies
RUN npm install

# Expose the ports the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
