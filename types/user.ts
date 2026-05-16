export type UserRole = 'client' | 'freelancer';

export type NotificationPreference = 'telegram' | 'whatsapp' | 'both';

export interface UserProfile {
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  imageUrl?: string;
  notificationPreference?: NotificationPreference;
}
