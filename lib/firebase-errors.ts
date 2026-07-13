const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Konto z tym adresem email już istnieje.",
  "auth/invalid-email": "Podany adres email jest nieprawidłowy.",
  "auth/user-not-found": "Nie znaleziono konta z tym adresem email.",
  "auth/wrong-password": "Nieprawidłowe hasło.",
  "auth/invalid-credential": "Nieprawidłowy email lub hasło.",
  "auth/too-many-requests": "Zbyt wiele prób logowania. Spróbuj ponownie później.",
  "auth/user-disabled": "To konto zostało zablokowane.",
  "auth/account-exists-with-different-credential":
    "Konto z tym adresem email jest już powiązane z inną metodą logowania.",
  "auth/popup-closed-by-user": "Okno logowania zostało zamknięte.",
  "auth/cancelled-popup-request": "Anulowano poprzednie okno logowania.",
  "auth/popup-blocked": "Przeglądarka zablokowała okno logowania. Zezwól na wyskakujące okna.",
  "auth/network-request-failed": "Błąd połączenia. Sprawdź internet i spróbuj ponownie.",
  "auth/requires-recent-login": "Ta operacja wymaga ponownego zalogowania.",
  "auth/weak-password": "Hasło jest za słabe.",
};

export function getFirebaseErrorMessage(code: string): string {
  return FIREBASE_ERROR_MESSAGES[code] ?? "Wystąpił błąd. Spróbuj ponownie.";
}
