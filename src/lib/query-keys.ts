export const queryKeys = {
  getCurrentUserArchivedDocumentsAction: () => ['getCurrentUserArchivedDocumentsAction'],
  getCurrentUserUnArchivedDocumentsAction: () => ['getCurrentUserUnArchivedDocumentsAction'],
  getCurrentUserDocumentByParentDocumentIdAction: (parentId?: string | null) => [
    'getCurrentUserDocumentByParentDocumentIdAction',
    parentId ?? 'root',
  ],
}
