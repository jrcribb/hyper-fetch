import { Firestore } from "firebase-admin/firestore";

import { FirebaseAdminDBTypes, FirebaseAdminSocketAdapterTypes } from "./adapter.admin.types";
import { realtimeSocketsAdmin } from "../../realtime/admin/realtime.admin.sockets";
import { firestoreAdminSockets } from "../../firestore/admin/firestore.admin.sockets";

export const firebaseSocketsAdminAdapter = <T extends FirebaseAdminDBTypes>(
  database: T,
): FirebaseAdminSocketAdapterTypes<T> => {
  if (database instanceof Firestore) {
    return firestoreAdminSockets(database) as unknown as FirebaseAdminSocketAdapterTypes<T>;
  }
  return realtimeSocketsAdmin(database) as unknown as FirebaseAdminSocketAdapterTypes<T>;
};