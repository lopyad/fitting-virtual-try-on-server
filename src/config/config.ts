export const config = {
  googleCloud: {
    location: 'us-central1',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  },
  models: {
    virtualTryOn: 'virtual-try-on-preview-08-04',
    geminiFlashImage: 'gemini-2.5-flash-image', // Default model, can be changed
  },
};
