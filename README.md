# Virtual Try-On APIs

This project implements Virtual Try-On using VertexAI services, allowing requests to be sent to various models such as `gemini-flash-image` and `google-virtual-try-on-preview` for comparison.

## Getting Started

Before starting the project, you need a Google Cloud project.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd virtual-try-on
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Google Cloud Authentication (Service Account):**
    This project uses a service account for authentication. This is a more secure and robust method than using manual access tokens.

    *   **Create a Service Account:**
        1.  In the Google Cloud Console, navigate to "IAM & Admin" > "Service Accounts".
        2.  Click "+ CREATE SERVICE ACCOUNT".
        3.  Give it a name (e.g., "virtual-try-on-runner") and grant it the "Vertex AI User" role.
        4.  Click "Done".

    *   **Create a Service Account Key:**
        1.  Find the service account you just created in the list.
        2.  Click the three-dot menu under "Actions" and select "Manage keys".
        3.  Click "ADD KEY" > "Create new key".
        4.  Choose "JSON" as the key type and click "CREATE". A JSON key file will be downloaded to your computer.

4.  **Environment Variables:**
    *   Create a `.env` file in the project root.
    *   Add your Google Cloud project ID to the `.env` file:
        ```
        GOOGLE_CLOUD_PROJECT_ID=your-project-id
        ```
            *   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the path of the JSON key file you downloaded. For development, you can add it to your `.env` file (e.g., `GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/keyfile.json`). Ensure the path is absolute.
    
                **Example for your `.env` file:**
                ```
                GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/keyfile.json
                ```
5.  **Run the application:**
    ```bash
    npm start
    ```
    You can then access a simple web interface in your browser.