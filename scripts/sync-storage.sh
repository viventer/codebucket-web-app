#!/usr/bin/env bash
#
# Synchronizuje pliki z Firebase Storage projektu DEV do projektu PROD.
# Firebase Storage to bucket Google Cloud Storage, więc transfer odbywa się
# server-side (Google -> Google), bez pobierania plików na dysk lokalny.
#
# Wymagania:
#   1. Zainstaluj Google Cloud CLI (WSL/Ubuntu):
#        sudo apt-get update
#        sudo apt-get install -y apt-transport-https ca-certificates gnupg curl
#        curl https://packages.cloud.google.com/apt/doc/apt-key.gpg \
#          | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
#        echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
#          | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
#        sudo apt-get update
#        sudo apt-get install -y google-cloud-cli
#   2. Zaloguj się: gcloud auth login
#
# Uruchomienie:
#   npm run sync:storage             # dograj/zaktualizuj pliki w PROD (bezpieczne)
#   npm run sync:storage -- --mirror # dodatkowo USUŃ w PROD pliki, których nie ma w DEV
#   npm run sync:storage -- --dry-run
#
set -euo pipefail

SOURCE="gs://codebucket-dev.firebasestorage.app"
DEST="gs://codebucket-prod.firebasestorage.app"

MIRROR=0
DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --mirror)
      MIRROR=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    *)
      echo "Nieznana opcja: $arg" >&2
      echo "Dozwolone: --mirror, --dry-run" >&2
      exit 1
      ;;
  esac
done

if ! command -v gcloud >/dev/null 2>&1; then
  echo "Błąd: nie znaleziono 'gcloud'. Zainstaluj Google Cloud CLI:" >&2
  echo "  https://cloud.google.com/sdk/docs/install" >&2
  echo "a następnie zaloguj się: gcloud auth login" >&2
  exit 1
fi

ARGS=(--recursive)
if [[ "$MIRROR" -eq 1 ]]; then
  ARGS+=(--delete-unmatched-destination-objects)
fi
if [[ "$DRY_RUN" -eq 1 ]]; then
  ARGS+=(--dry-run)
fi

echo "Źródło: $SOURCE"
echo "Cel:    $DEST"
if [[ "$MIRROR" -eq 1 ]]; then
  echo "Tryb:   MIRROR (pliki nieobecne w źródle zostaną usunięte w celu)"
else
  echo "Tryb:   ADD/UPDATE (tylko dodawanie i aktualizacja)"
fi
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "        DRY-RUN (nic nie zostanie zmienione)"
fi
echo

gcloud storage rsync "${ARGS[@]}" "$SOURCE" "$DEST"

echo
echo "Synchronizacja zakończona."
