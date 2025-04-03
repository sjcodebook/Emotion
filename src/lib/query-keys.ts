export const queryKeys = {
  getDocumentByIdAction: (documentId: string) => ['getDocumentByIdAction', documentId],
  getCurrentUserArchivedDocumentsAction: () => ['getCurrentUserArchivedDocumentsAction'],
  getCurrentUserUnArchivedDocumentsAction: () => ['getCurrentUserUnArchivedDocumentsAction'],
  getCurrentUserDocumentByParentDocumentIdAction: (parentId?: string | null) => [
    'getCurrentUserDocumentByParentDocumentIdAction',
    parentId ?? 'root',
  ],
}
