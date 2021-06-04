// Contents Check
async function selectContentsCheck(connection, [userIdx, contents]) {
    const contentsCheckQuery = `
      select exists(select searchContents from Search where userIdx = ? and searchContents = ?) as exist;
       `;
    const [contentsCheckRow] = await connection.query(contentsCheckQuery, [userIdx, contents]);
    return contentsCheckRow;
}

// Search Status Check
async function selectSearchStatusCheck(connection, [userIdx, contents]) {
    const statusCheckQuery = `
        select status
        from Search
        where userIdx = ? and searchContents = ?;
       `;
    const [statusCheckRow] = await connection.query(statusCheckQuery, [userIdx, contents]);
    return statusCheckRow;
}

// Insert Search
async function insertSearch(connection, [userIdx, contents]) {
    const insertSearchQuery = `
        insert into Search(userIdx, searchContents)
        values (?, ?)
       `;
    const [insertSearchRow] = await connection.query(insertSearchQuery, [userIdx, contents]);
    return insertSearchRow;
}

// Update Search Status
async function updateSearchStatus(connection, [userIdx, contents]) {

    const updateStatusQuery = `
        update Search
        set status = 'N'
        where userIdx = ? and searchContents = ?;
      `;
    const [updateStatusRow] = await connection.query(updateStatusQuery, [userIdx, contents]);
  
    return updateStatusRow;
}

// User Contents Check
async function selectUserContentsCheck(connection, userIdx) {
    const contentsCheckQuery = `
      select exists(select searchContents from Search where userIdx = ? and status = 'N') as exist;
       `;
    const [contentsCheckRow] = await connection.query(contentsCheckQuery, userIdx);
    return contentsCheckRow;
}

// Delete Contents
async function deleteContents(connection, userIdx) {

    const updateStatusQuery = `
        update Search
        set status = 'Y'
        where userIdx = ?;
      `;
    const [updateStatusRow] = await connection.query(updateStatusQuery, userIdx);
  
    return updateStatusRow;
}

// Select Recent Search
async function selectRecentSearch(connection, userIdx) {
    const recentSearchQuery = `
        select s.searchContents
        from Search s
        where userIdx = ? and s.status = 'N'
        group by s.searchContents
        order by s.createdAt DESC;
       `;
    const [recentSearchRow] = await connection.query(recentSearchQuery, userIdx);
    return recentSearchRow;
}

// Select Now Best Search
async function selectNowBestSearch(connection) {
    const nowBestSearchQuery = `
        select s.searchContents
        from Search s
        where timestampdiff(day, s.createdAt, current_timestamp) < 1
        group by s.searchContents
        order by count(s.searchContents) DESC;
       `;
    const [nowBestSearchRow] = await connection.query(nowBestSearchQuery,);
    return nowBestSearchRow;
}

module.exports = {
    selectContentsCheck,
    selectSearchStatusCheck,
    insertSearch,
    updateSearchStatus,
    selectUserContentsCheck,
    deleteContents,
    selectRecentSearch,
    selectNowBestSearch

};