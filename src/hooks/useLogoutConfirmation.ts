import { useCallback } from "react";
import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export function useLogoutConfirmation() {
  const { signOut } = useAuth();

  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar dari akun Anda?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Keluar", style: "destructive", onPress: signOut },
      ],
      { cancelable: true }
    );
  }, [signOut]);

  return { confirmLogout, signOut };
}
