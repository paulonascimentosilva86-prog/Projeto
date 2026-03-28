#!/bin/bash
# Hook: Backup automatico de documentos gerados
# Cria copia com timestamp

FILE="$1"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    exit 0
fi

BACKUP_DIR="$(dirname "$FILE")/.backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME=$(basename "$FILE")
cp "$FILE" "$BACKUP_DIR/${TIMESTAMP}_${FILENAME}"

echo "[BACKUP] Copia salva: ${TIMESTAMP}_${FILENAME}"
exit 0
