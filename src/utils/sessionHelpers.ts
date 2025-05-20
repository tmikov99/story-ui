import { store } from '../redux/store';
import { loginSuccess, logout } from '../redux/authSlice';
import { showConfirmDialog } from './confirmDialogController';
import { AuthResponse, logoutRequest } from '../api/auth';

export function handleSessionRefresh(res: AuthResponse): Promise<void> {
  return new Promise((resolve, reject) => {
    const newUsername = res.username;
    const currentUser = store.getState().auth.user;

    const sessionChanged = !newUsername || (currentUser && currentUser.username !== newUsername);

    if (!sessionChanged) {
      store.dispatch(loginSuccess(res));
      resolve();
      return;
    }

    showConfirmDialog(
      {
        title: "Session Update",
        message: "Your session has changed (Probably due to login in another tab). \nDo you want to continue?",
        confirmText: "Continue",
        cancelText: "Log out",
      },
      () => {
        store.dispatch(loginSuccess(res));
        resolve();
      },
      () => {
        logoutRequest()
          .catch(() => {})
          .finally(() => {
            store.dispatch(logout());
            window.location.href = "/landing";
            reject(new Error("User chose to log out"));
          });
      }
    );
  });
}

export function handleSessionExpired(): Promise<void> {
  return new Promise((resolve, reject) => {
    showConfirmDialog(
      {
        title: "Session Expired",
        message: "You’ve been logged out (possibly in another tab). \nWould you like to log in again?",
        confirmText: "Log in",
        cancelText: "Cancel",
      },
      () => {
        store.dispatch(logout());
        window.location.href = "/signIn";
        reject(new Error("User chose to log in again"));
      },
      () => {
        store.dispatch(logout());
        window.location.href = "/landing";
        reject(new Error("User chose to go to landing page"));
      }
    );
  });
}