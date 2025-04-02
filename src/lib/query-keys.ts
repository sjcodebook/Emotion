export const queryKeys = {
  getCurrentUserDocumentsAction: () => ['getCurrentUserDocumentsAction'],
  getCurrentUserArchivedDocumentsAction: () => ['getCurrentUserArchivedDocumentsAction'],
  getCurrentUserDocumentByParentDocumentIdAction: (parentId?: string | null) => [
    'getCurrentUserDocumentByParentDocumentIdAction',
    parentId ?? 'root',
  ],
}
