import { Client, Account, Databases, Storage, Functions } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/constants';

// TODO: replace with your Appwrite endpoint
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database helpers
export const db = {
  users: {
    get: (userId: string) => databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.USERS, userId),
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.USERS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.USERS, 'unique()', data),
    update: (userId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.USERS, userId, data),
    delete: (userId: string) => databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.USERS, userId),
  },
  hosts: {
    get: (hostId: string) => databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.HOSTS, hostId),
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.HOSTS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.HOSTS, 'unique()', data),
    update: (hostId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.HOSTS, hostId, data),
    delete: (hostId: string) => databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.HOSTS, hostId),
  },
  wallets: {
    get: (userId: string) => databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.WALLETS, userId),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.WALLETS, 'unique()', data),
    update: (userId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.WALLETS, userId, data),
  },
  coinTransactions: {
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.COIN_TRANSACTIONS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.COIN_TRANSACTIONS, 'unique()', data),
    update: (transactionId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.COIN_TRANSACTIONS, transactionId, data),
  },
  callSessions: {
    get: (sessionId: string) => databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.CALL_SESSIONS, sessionId),
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.CALL_SESSIONS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.CALL_SESSIONS, 'unique()', data),
    update: (sessionId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.CALL_SESSIONS, sessionId, data),
  },
  earnings: {
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.EARNINGS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.EARNINGS, 'unique()', data),
    update: (earningId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.EARNINGS, earningId, data),
  },
  withdrawalRequests: {
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'unique()', data),
    update: (requestId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, requestId, data),
  },
  reports: {
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.REPORTS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.REPORTS, 'unique()', data),
    update: (reportId: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.REPORTS, reportId, data),
  },
  appSettings: {
    get: (key: string) => databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.APP_SETTINGS, key),
    list: (queries?: string[]) => databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.APP_SETTINGS, queries),
    create: (data: any) => databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.APP_SETTINGS, 'unique()', data),
    update: (key: string, data: any) => databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.APP_SETTINGS, key, data),
  },
};

// Storage helpers
export const fileStorage = {
  upload: (file: File, fileId?: string) => storage.createFile('default', fileId || 'unique()', file),
  get: (fileId: string) => storage.getFile('default', fileId),
  getView: (fileId: string) => storage.getFileView('default', fileId),
  delete: (fileId: string) => storage.deleteFile('default', fileId),
};

// Auth helpers
export const auth = {
  signUp: (email: string, password: string, name?: string) => account.create('unique()', email, password, name),
  signIn: (email: string, password: string) => account.createEmailPasswordSession(email, password),
  signOut: () => account.deleteSession('current'),
  getCurrentUser: () => account.get(),
  updatePassword: (password: string, oldPassword?: string) => account.updatePassword(password, oldPassword),
  updateEmail: (email: string, password: string) => account.updateEmail(email, password),
  updateName: (name: string) => account.updateName(name),
  createRecovery: (email: string) => account.createRecovery(email, `${APP_URL}/reset-password`),
  updateRecovery: (userId: string, secret: string, password: string) => account.updateRecovery(userId, secret, password),
  deleteAccount: () => account.delete(),
};