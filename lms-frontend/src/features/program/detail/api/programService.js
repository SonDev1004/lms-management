
export async function getProgramDetail(id) {
    const { default: mock } = await import("../mocks/programDetail.js");
    if (!mock?.id || (id && String(mock.id) !== String(id))) return null;
    return mock;
}
