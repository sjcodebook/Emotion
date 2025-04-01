export const queryKeys = {
  getCurrentUserDocumentsAction: () => ['getCurrentUserDocumentsAction'],
  getCurrentUserDocumentByParentDocumentIdAction: (parentId?: string | null) => [
    'getCurrentUserDocumentByParentDocumentIdAction',
    parentId ?? 'root',
  ],
}
