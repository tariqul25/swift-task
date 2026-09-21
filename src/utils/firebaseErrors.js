/**
 * Converts Firebase auth error codes into friendly, actionable messages.
 */
export const getFriendlyFirebaseErrorMessage = (error) => {
  if (!error) return 'An error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered in Firebase. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in Firebase Console! Go to Firebase Console > Authentication > Sign-in method and Enable Email/Password.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a few minutes.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not initialized yet. Please click "Get Started" in Firebase Console > Authentication.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};
