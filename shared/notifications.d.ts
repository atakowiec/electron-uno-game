export interface Notification {
  type: NotificationType;
  message: string;
}

export type NotificationType = 'info' | 'success' | 'error' | 'warning';