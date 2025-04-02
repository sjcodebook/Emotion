export const queryKeys = {
  getCurrentUserArchivedDocumentsAction: () => ['getCurrentUserArchivedDocumentsAction'],
  getCurrentUserDocumentByParentDocumentIdAction: (parentId?: string | null) => [
    'getCurrentUserDocumentByParentDocumentIdAction',
    parentId ?? 'root',
  ],
}
