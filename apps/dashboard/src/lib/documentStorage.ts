const DATABASE_NAME = "website-system-documents";
const DATABASE_VERSION = 1;
const DOCUMENT_STORE_NAME = "documents";

type StoredDocumentFile = {
  storageKey: string;
  projectId: string;
  fileName: string;
  mimeType: string;
  size: number;
  content: Blob;
  createdAt: string;
};

export interface DocumentStorageService {
  saveFile(
    file: File,
    projectId: string
  ): Promise<string>;

  getFile(
    storageKey: string
  ): Promise<Blob | null>;

  deleteFile(
    storageKey: string
  ): Promise<void>;
}

function openDocumentDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(
        new Error(
          "Der Browser unterstützt keine lokale Dateispeicherung."
        )
      );
      return;
    }

    const request = window.indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION
    );

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            "Die lokale Dokumentendatenbank konnte nicht geöffnet werden."
          )
      );
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      if (
        !database.objectStoreNames.contains(
          DOCUMENT_STORE_NAME
        )
      ) {
        database.createObjectStore(
          DOCUMENT_STORE_NAME,
          {
            keyPath: "storageKey",
          }
        );
      }
    };
  });
}

function createStorageKey(
  projectId: string
): string {
  return `document-file_${projectId}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

class BrowserDocumentStorage
  implements DocumentStorageService
{
  async saveFile(
    file: File,
    projectId: string
  ): Promise<string> {
    const database = await openDocumentDatabase();
    const storageKey = createStorageKey(projectId);

    const storedFile: StoredDocumentFile = {
      storageKey,
      projectId,
      fileName: file.name,
      mimeType:
        file.type || "application/octet-stream",
      size: file.size,
      content: file,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        DOCUMENT_STORE_NAME,
        "readwrite"
      );

      const documentStore =
        transaction.objectStore(
          DOCUMENT_STORE_NAME
        );

      const request = documentStore.put(
        storedFile
      );

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              "Die Datei konnte nicht gespeichert werden."
            )
        );
      };

      transaction.oncomplete = () => {
        database.close();
        resolve(storageKey);
      };

      transaction.onerror = () => {
        database.close();

        reject(
          transaction.error ??
            new Error(
              "Die Datei konnte nicht gespeichert werden."
            )
        );
      };

      transaction.onabort = () => {
        database.close();

        reject(
          transaction.error ??
            new Error(
              "Das Speichern der Datei wurde abgebrochen."
            )
        );
      };
    });
  }

  async getFile(
    storageKey: string
  ): Promise<Blob | null> {
    const database = await openDocumentDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        DOCUMENT_STORE_NAME,
        "readonly"
      );

      const documentStore =
        transaction.objectStore(
          DOCUMENT_STORE_NAME
        );

      const request =
        documentStore.get(storageKey);

      request.onerror = () => {
        database.close();

        reject(
          request.error ??
            new Error(
              "Die Datei konnte nicht geladen werden."
            )
        );
      };

      request.onsuccess = () => {
        const storedFile =
          request.result as
            | StoredDocumentFile
            | undefined;

        database.close();

        resolve(storedFile?.content ?? null);
      };
    });
  }

  async deleteFile(
    storageKey: string
  ): Promise<void> {
    const database = await openDocumentDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        DOCUMENT_STORE_NAME,
        "readwrite"
      );

      const documentStore =
        transaction.objectStore(
          DOCUMENT_STORE_NAME
        );

      const request =
        documentStore.delete(storageKey);

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              "Die Datei konnte nicht gelöscht werden."
            )
        );
      };

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        database.close();

        reject(
          transaction.error ??
            new Error(
              "Die Datei konnte nicht gelöscht werden."
            )
        );
      };
    });
  }
}

export const documentStorage: DocumentStorageService =
  new BrowserDocumentStorage();